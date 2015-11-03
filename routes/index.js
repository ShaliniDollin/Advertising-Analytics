
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
