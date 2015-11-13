
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
}

exports.products = function(req, res){
	res.render('products', {title: 'products'});
}

exports.events = function(req, res){
	res.render('events', {title: 'events'});
}

exports.adAnalytics = function(req, res){
	res.render('adAnalytics', {title: 'adAnalytics'});
}