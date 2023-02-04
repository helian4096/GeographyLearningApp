#!/usr/bin/nodejs


// ----------------- load packages -------------- //
var express = require('express');
var app = express();
var request = require('request');
var hbs = require('hbs');
var path = require('path');
var fs = require('fs');
var jquery = require('jquery');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var controllers = require('./controllers');
app.set('trust proxy', 1); // trust first proxy
// --------------------- cookie configuration -------------------- //
app.use(cookieSession({
    name: 'loooooooo',
    keys: ['jgikJFUjewoIDWH89342', 'fwepoakrgier#*4weJDW']
}));
// --------------- body parser initialization --------------- //
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

controllers.do_set(app);
//static
app.use(express.static(__dirname + '/static'));
app.use('/server_resources', express.static(path.join(__dirname, 'server_resources')));
// --------------- express initialization -------------- //
app.set('port', process.env.PORT || 8080 );
hbs.registerPartials(path.join(__dirname, 'views', 'partials'), function (err) {});
app.set('view engine', 'hbs');
//app.set('views', __dirname + '/views');

// --------------------- listener ---------------------- //
var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function(){
    console.log("Express server started.");
});