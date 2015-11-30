var user = require('../Model/User');
var ejs = require("ejs");
var express = require('express');
var googleFinance = require('google-finance');
var session = require('express-session');
// create our app
var app = express();

app.use(session({secret: 'ssshhhhh'}));
/*
 * GET home page.
 */

exports.index = function(req, res){
  var sess = req.session;
  if(!sess.user){
    sess.user ='name';
  }
  res.render('index', { title: 'Express', user: sess.user});
};

exports.login = function(req, res){
  var sess = req.session;
  res.render('Login', { title: 'Express' });
};

exports.dashboard = function(req, res){
  var sess = req.session;
	var user = sess.user;
	user.year = (new Date()).getFullYear();

  if(user.company_event === 'nike'){
    symbol = 'NASDAQ:NKE';
  }
  else {
    symbol = 'NASDAQ:OR';
  }
  googleFinance.companyNews({
  symbol: symbol
  }, function (err, news) {
    if(news){
      sess.news = news;
    }
    else{
      sess.news = user.company_event;
    }
  });
  googleFinance.historical({
  symbol: symbol,
  from: '2015-01-01',
  to: '2015-11-29'
  }, function (err, quotes) {
    if (quotes){
      sess.quotes = quotes;
    }
    else{
      sess.quotes = "2$";
    }
  });
  res.render('dashboard', { user: user, news: news, quotes:quotes});
};
exports.maincontent = function(req, res){
  var sess = req.session;
	var user = sess.user;
  res.render('maincontent', { user: user});

};
exports.statistics = function(req, res){
  var sess = req.session;
	res.render('statistics', {title: 'Statistics'});
};

exports.products = function(req, res){
  var sess = req.session;
	res.render('products', {title: 'products'});
};

exports.events = function(req, res){
  var sess = req.session;
	res.render('events', {title: 'events'});
};

exports.adAnalytics = function(req, res){
  var sess = req.session;
	res.render('adAnalytics', {title: 'adAnalytics'});
};

exports.validateUser =function(req,res){
  var sess = req.session;
	console.log("validate user");
	var newUser = new user();
	newUser.validateUser(function(err,result) {
		if(err){
			console.log("Error"+err);
			throw(err);
		}else
		{
      sess.user = result;
			res.render('index', { title: 'Express', user:sess.user});
		}

	},req.body);


  };
  exports.logout =function(req,res){
    var sess = req.session;
  	console.log("validate user");
    req.session.destroy(function(err) {
      // cannot access session here
    });
  			res.render('index', { title: 'Express', user:'name'});
    };

 exports.createuser =function(req,res){
   var sess=req.session;
  	var newUser = new user();
  	newUser.createUser(function(err,result) {
  		if(err){
  			console.log("Error"+err);
  			//throw(err);
  			res.json(err);
  		}else
  		{
        sess.user = result;
  			res.render('index', { title: 'Express' , user: sess.user});
  		}

  	},req.body);
  	//console.log("Username"+ req.param('password'));
  };

 exports.getUserById = function(req,res){
   var sess = req.session;
	console.log("In get user by id"+req.params.email);
	var newUser = new user();
	newUser.getUserById(function(err,result){
		if(err){
			console.log("Get user by Id"+err);
			res.json(err);
			//res.json(res.json({"status": err}));
			//throw(err);
		}else{
			res.render('index', { title: 'Express' });
		}

	}, req.params.email);

  };
