
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
var twit = require('twit');
// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}


//twitter handler




//Index Page
app.get('/', routes.index);

//Login Authentication and logout
app.post('/users', routes.createuser);
app.post('/validateUser', routes.validateUser);
app.get('/logout', routes.logout);
//checked
app.get('/users/:userId', routes.getUserById);//checked

//Index for two kinds of users
app.get('/:company_name/:fname_lname/index', routes.index);

// VENDOR API
app.get('/:company_name/:fname_lname/maincontent', routes.maincontent);
app.get('/:company_name/:fname_lname/dashboard', routes.dashboard);
app.get('/:company_name/:fname_lname/statistics', routes.statistics);
app.get('/:company_name/:fname_lname/products', routes.products);
app.get('/news', routes.news);
app.get('/lastTradePriceOnly', routes.lastTradePriceOnly);
app.get('/gettweets', routes.gettweets);
app.get('/:company_name/:fname_lname/events', routes.events);
app.get('/:company_name/:fname_lname/adAnalytics', routes.adAnalytics);
app.post('/:company_name/:fname_lname/addProduct', routes.addProduct);

// EVENT API
app.get('/:company_name/:fname_lname/event_dashboard', routes.event_dashboard);
app.get('/:company_name/:fname_lname/event_statistics', routes.event_statistics);
app.get('/:company_name/:fname_lname/event_events', routes.event_events);
app.post('/:company_name/:fname_lname/addEvent', routes.addEvent);

//Error Handelling
app.get('/:fname_lname/error', routes.error);
app.get('*', routes.NotFoundErrorPage);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
