/* NOTE FOR AT SOME POINT: PEOPLE SHOULD BE ABLE TO CHOOSE DISPLAY NAMES */
var mysql = require('mysql');
// -------------- variable initialization -------------- //
var sql_params = {
    connectionLimit : 10,
    user            : process.env.DIRECTOR_DATABASE_USERNAME,
    password        : process.env.DIRECTOR_DATABASE_PASSWORD,
    host            : process.env.DIRECTOR_DATABASE_HOST,
    port            : process.env.DIRECTOR_DATABASE_PORT,
    database        : process.env.DIRECTOR_DATABASE_NAME
};
var pool = mysql.createPool(sql_params);
var path = require('path');
var fs = require('fs');
//var bcrypt_pbkdf = require('bcrypt-pbkdf');
var bcrypt = require('bcrypt'); //async mode??? figure that out
function loginChecker(req, res, next){
    res.locals.loggedIn = false;
    if(('username' in req.session)){
       res.locals.loggedIn = true;
    }
    next();
}
function southAmerica(req, res, next){
    var southamerica_path = path.join(__dirname, '..','server_resources', 'txt/southamerica.txt');
    fs.readFile(southamerica_path, function(er,dat_buf){
       var dat_string = dat_buf.toString();
       var dat_obj = JSON.parse(dat_string);
       res.locals.southamerica = dat_obj;
       next();
    });
}
function europe(req, res, next){
    var europe_path = path.join(__dirname, '..','server_resources', 'txt/europe.txt');
    fs.readFile(europe_path, function(er,dat_buf){
       var dat_string = dat_buf.toString();
       var dat_obj = JSON.parse(dat_string);
       res.locals.europe = dat_obj;
       next();
    });
}
function usa(req, res, next){
    var usa_path = path.join(__dirname, '..','server_resources', 'txt/usa.txt');
    fs.readFile(usa_path, function(er,dat_buf){
       var dat_string = dat_buf.toString();
       var dat_obj = JSON.parse(dat_string);
       res.locals.usa = dat_obj;
       next();
    });
}
function quiz_access(req, res, next){
    if(res.locals.loggedIn){
        pool.query('SELECT * FROM quiz_attempts WHERE user=?', req.session.username, function(error, results, field){
            if(error){
            throw error;
        }
        res.locals.quizattempts = results;
        next();
        });
    }
    else{
        next();
    }
}
function instances_access(req, res, next){
    if(res.locals.loggedIn){
        pool.query('SELECT * FROM instances WHERE user=?', req.session.username, function(error, results, field){
            if(error){
                throw error;
            }
            res.locals.instances = results;
            next();
        });
    }
    else{
        next();
    }
}
var map_asyncs = [southAmerica, europe, usa];
var general_asyncs = [loginChecker];
var database_access = [loginChecker, quiz_access, instances_access];
exports.test = function(req, res){
    console.log("User on site.");
    var user_name = false;
    var logged_in = false;
    if('username' in req.session){
        user_name = req.session.username;
        logged_in = true;
    }
    var feedDict = {
        "user_name": user_name,
        "logged_in": logged_in
    };
    res.render('index', feedDict);
};
exports.map = [map_asyncs, function(req, res){
    var user_name = false;
    var logged_in = false;
    if('username' in req.session){
        user_name = req.session.username;
        logged_in = true;
    }
    var map = "";
    var booleans = {
        "europe": 0,
        "southamerica": 0,
        "usa": 0
    };
    if('map' in req.query){
        booleans[req.query.map] = 1;
        map = req.query.map;
    }
    var feedDict = {
        "user_name": user_name,
        "logged_in": logged_in,
        "southamerica_bool": booleans.southamerica,
        "europe_bool": booleans.europe,
        "usa_bool": booleans.usa,
        "southamerica_info": JSON.stringify(res.locals.southamerica),
        "europe_info": JSON.stringify(res.locals.europe),
        "usa_info": JSON.stringify(res.locals.usa),
        "display_map": map
    };
    res.render('map', feedDict);
}];
exports.map_store = function(req, res){
    var user_name = false;
    var logged_in = false;
    if('username' in req.session){
        user_name = req.session.username;
        logged_in = true;
        var quiz_stuff = JSON.parse(req.body.quiz_current);
        var correctlist = quiz_stuff["quiz_results"];
        var total = quiz_stuff["total_correct"];
        var guessed = quiz_stuff["completed"];
        var map = quiz_stuff["map"];
        var quiz_name = quiz_stuff["quiz_name"];
        var attempt_number = 0;
        //access the attempt number
        var query_attempt = 'SELECT attempt FROM quiz_attempts WHERE user=\'' + user_name + '\' AND map=\'' + map + '\' AND quiz=\'' + quiz_name +'\';';
        pool.query(query_attempt, function(error, results, field){
            if(error){
                throw error;
            }
            console.log(results);
            attempt_number = results.length;
            console.log(attempt_number);
            var query_score = 'INSERT INTO quiz_attempts(user, map, quiz, attempt, score, guessed) VALUES';
            query_score += ' (\'' + user_name + '\', \'' + map + '\', \'' + quiz_name + '\', ' + attempt_number + ', ' + total + ', ' + guessed + ');';
            //put the score
            pool.query(query_score, function(error, results, field){
                if(error){
                    throw error;
                }
            });
            var query_elements = 'INSERT INTO instances(user, map, quiz, attempt, region, correct) VALUES ';
            for(const variable in correctlist){
                query_elements += '(\'' + user_name + '\', \'' + map + '\', \'' + quiz_name + '\', ' + attempt_number + ', \'' + variable + '\', ' + correctlist[variable] + '), ';
            }
            query_elements = query_elements.substring(0, query_elements.length - 2);
            query_elements += ';';
            pool.query(query_elements, function(error, results, field){
                if(error){
                    throw error;
                }
            });
        });
        var feedDict = {
            "user_name": user_name,
            "logged_in": logged_in
        };
        res.render('index', feedDict);
        }
    else{
        var feedDict = {
            "user_name": user_name,
            "logged_in": logged_in
        };
        res.render('huh', feedDict);
    }
};
exports.user_results = [database_access, function(req, res){
    var user_name = false;
    var logged_in = false;
    if('username' in req.session){
        user_name = req.session.username;
        logged_in = true;
    }
    var feedDict = {
        "user_name": user_name,
        "logged_in": logged_in
    };
    res.render('dbtables', feedDict);
}];
exports.db = function(req, res){
    var user_name = false;
    var logged_in = false;
    if('username' in req.session){
        user_name = req.session.username;
        logged_in = true;
    }
    var feedDict = {
        "user_name": user_name,
        "logged_in": logged_in
    };
    res.render('database', feedDict);
};
exports.login = function(req, res){
    var user_name = false;
    var logged_in = false;
    if('username' in req.session){
        user_name = req.session.username;
        logged_in = true;
    }
    var feedDict = {
        "wrong": "",
        "user_name": user_name,
        "logged_in": logged_in
    };
    res.render('login', feedDict);
};
exports.login_worker = function(req, res){
    var user_name = false;
    var logged_in = false;
    var username = req.body.user;
    var password = req.body.pass;
    var feedDict;
    var hash;
    pool.query('SELECT hash FROM loginfo WHERE username=?', username, function(error, results, field){
        if(error){
            throw error;
        }
        var results_str = JSON.stringify(results);
        if(results_str === "[]"){
            feedDict = {
                "wrong": "The username you provided does not exist on our site.",
                "user_name": user_name,
                "logged_in": logged_in
            };
            res.render('login', feedDict);
        }
        else{
            hash = results[0]["hash"]; //CHECK THIS!
            bcrypt.compare(password, hash, function(err, result) {
                if(result){
                    req.session.username = username;
                    user_name = username;
                    logged_in = true;
                    feedDict = {
                        "user_name": user_name,
                        "logged_in": logged_in
                    };
                    res.render('login_result', feedDict);
                }
                else{
                    feedDict = {
                        "wrong": "The password you entered is incorrect.",
                        "user_name": user_name,
                        "logged_in": logged_in
                    };
                    res.render('login', feedDict);
                }
            });
        }
    });
};
exports.account_manager = function(req, res){
    var user_name = false;
    var logged_in = false;
    if('username' in req.session){
        user_name = req.session.username;
        logged_in = true;
    }
    var feedDict = {
        "user_name": user_name,
        "logged_in": logged_in
    };
    res.render('account', feedDict);
};
exports.account_worker = function(req, res){
    var username = req.body.user;
    var password = req.body.pass;
    var password_confirm = req.body.pass2;
    var message;
    var user_name = false;
    var logged_in = false;
    if(('username' in req.session)){
        logged_in = true;
        var feedDict = {
            "user_name": req.session.username,
            "logged_in": logged_in
        };
        res.render('account', feedDict);
    }
    else{
        //In this part, put something about checking usernames
        var user_check;
        pool.query('SELECT username FROM loginfo WHERE username=\'' + username + '\'', function(error, results, field){
            if(error){
                throw error;
            }
            user_check = JSON.stringify(results);
            if(user_check !== "[]"){
                message = "The username you provided already exists on our website.";
                var feedDict = {
                    "message": message,
                    "user_name": false,
                    "logged_in": false
                };
                res.render('account', feedDict);
            }
            else{
                var pepper = "a627EU*^%4(98r23nfewfwe";
                if(password != password_confirm){
                    message = "Your password confirmation does not match your password.";
                    var feedDict = {
                        "message": message,
                        "user_name": false,
                        "logged_in": false
                    };
                    res.render('account', feedDict);
                }
                else{
                    bcrypt.hash(password, 10, function(err, hash) {
                        pool.query('INSERT INTO loginfo(username, hash) VALUES (\'' + username + '\', \'' + hash + '\')', 
                            function(error, results, field){
                                if(error){
                                    throw error;
                                }
                            });
                        // Store hash in your password DB.
                    });
                    //after hashing stuff
                    req.session.username = username;
                    user_name = req.session.username;
                    var feedDict = {
                        "user_name": user_name,
                        "logged_in": true,
                        "message": "Congratulations! Your account has been successfully made."
                    };
                    res.render('account', feedDict);
                }
            }
        });
        
    }
};
exports.logout = function(req, res){
    var feedDict = {
        "user_name": false,
        "logged_in": false,
        "message": ""
    };
    if(('username' in req.session)){
        req.session = null;
        feedDict["message"] = "You have successfully logged out of the GeoQuizzer.";
    }
    else{
        feedDict["message"] = "You were not logged in.";
    }
    res.render('logout', feedDict);
}