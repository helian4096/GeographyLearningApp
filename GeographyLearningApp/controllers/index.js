var test = require('./test');
exports.do_set = function(app){
    app.get('/', test.test);
    app.get('/maps', test.map);
    app.get('/database', test.db);
    app.get('/login', test.login);
    app.post('/login_worker', test.login_worker);
    app.get('/account_manager', test.account_manager);
    app.post('/account_worker', test.account_worker);
    app.get('/logout', test.logout);
    app.post('/map_store', test.map_store);
    app.get('/user_results', test.user_results);
}