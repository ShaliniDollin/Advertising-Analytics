var user = require('../Model/User');
var ejs = require("ejs");
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.login = function(req, res){
  res.render('Login', { title: 'Express' });
};

exports.dashboard = function(req, res){
	  res.render('dashboard', { title: 'Express' });
};

exports.statistics = function(req, res){
	res.render('statistics', {title: 'Statistics'});
};

exports.products = function(req, res){
	res.render('products', {title: 'products'});
};

exports.events = function(req, res){
	res.render('events', {title: 'events'});
};

exports.adAnalytics = function(req, res){
	res.render('adAnalytics', {title: 'adAnalytics'});
};

exports.validateUser =function(req,res){
	console.log("validate user");
	var newUser = new user();
	newUser.validateUser(function(err,result) {
		if(err){
			console.log("Error"+err);
			throw(err);
		}else
		{
			res.json(result);
		}

	},req.body);

	console.log("Username "+ req.param('email'));
  };

 exports.createuser =function(req,res){
  	var newUser = new user();
  	newUser.createUser(function(err,result) {
  		if(err){
  			console.log("Error"+err);
  			//throw(err);
  			res.json(err);
  		}else
  		{
  			console.log(result);
  			res.json(result);
  		}

  	},req.body);
  	//console.log("Username"+ req.param('password'));
  };

 exports.getUserById = function(req,res){
	console.log("In get user by id"+req.params.email);
	var newUser = new user();
	newUser.getUserById(function(err,result){
		if(err){
			console.log("Get user by Id"+err);
			res.json(err);
			//res.json(res.json({"status": err}));
			//throw(err);
		}else{
			//return number of rows that deleted
			console.log("return "+result);
			res.json(result);
		}

	}, req.params.email);

  };
