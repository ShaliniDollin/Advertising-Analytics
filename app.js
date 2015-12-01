
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'ssshhhhh'}));
app.use(app.router);
// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/users', routes.createuser);
app.post('/validateUser', routes.validateUser);
app.get('/logout', routes.logout);
//checked
app.get('/users/:userId', routes.getUserById);//checked


app.get('/:fname_lname/maincontent', routes.maincontent);
app.get('/:fname_lname/dashboard', routes.dashboard);
app.get('/:fname_lname/statistics', routes.statistics);
app.get('/:fname_lname/products', routes.products);
app.get('/:fname_lname/events', routes.events);
app.get('/:fname_lname/adAnalytics', routes.adAnalytics);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
