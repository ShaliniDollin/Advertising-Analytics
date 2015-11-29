var user = require('../Model/User');
var ejs = require("ejs");
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', result: 'name'});
};

exports.login = function(req, res){
  res.render('Login', { title: 'Express' });
};

exports.dashboard = function(req, res){
	var user = {};

	user.year = (new Date()).getFullYear();

	res.render('dashboard', { user: user });
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

			res.render('index', { title: 'Express'});
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
  			console.log("in index after" +result);
  			res.render('index', { title: 'Express' , result: result});
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
			res.render('index', { title: 'Express' });
		}

	}, req.params.email);

  };
