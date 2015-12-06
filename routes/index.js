var user = require('../Model/User');
var vendor = require('../Model/Vendor');
var product = require('../Model/Product');
var event = require('../Model/Event');
var recommendation = require('../Model/Recommendation');
var twit = require('twit');

var ejs = require("ejs");
var express = require('express');
var googleFinance = require('google-finance');
var yahooFinance = require('yahoo-finance');
var session = require('express-session');

var http = require('http');
var https = require("https");
// create our app
var app = express();

var twitter = new twit({
	consumer_key: 'wR9CdHxufxPyKgsqo85Cxop1T',
  consumer_secret: 'RK8QIrTVayXsW7jSTB94oV1CG6c4RxQuJMJ29d2bX83oGgEh7I',
  access_token: '2372331446-eGzAm0vExfI2yBNQDGmBgXkk0k6wlv85AWzXAJy',
  access_token_secret: 'u4VVpg3shX4ZIYrSpdfilW6nKKqUsjuKiLi0Gtemy8MPX'
});


app.use(session({secret: 'ssshhhhh'}));
/*
 * GET home page.
 */

exports.index = function(req, res){
  var sess = req.session;
  if(!sess.user){
    sess.user ='name';
  }
   res.render('index', { title: 'Advertising Analytics', user: sess.user});
};

exports.login = function(req, res){
  var sess = req.session;
  res.render('Login', { title: 'Express' });
};

exports.dashboard = function(req, res){
  var sess = req.session;
	var user = sess.user;
	user.year = (new Date()).getFullYear();

	var newVendor = new vendor();
	newVendor.getVendorIncome(function(err, result){
		if(!err){
			sess.user.netIncome= result;
      res.render('dashboard', { user: sess.user});
    }
    else{
      res.render('error', { error: err});
    }
  },user.year,user.company_event);
};

exports.news = function(req, res) {
      var sess = req.session;
      var user = sess.user;
      if(user.company_event === 'nike'){
        symbol = 'NASDAQ:NKE';
        stocksymbol = 'NKE';
      }
      else {
        symbol = 'EPA:OR';
        stocksymbol = 'OR';
      }
      googleFinance.companyNews({
        symbol: symbol
      }, function (err, news) {
        if(news){
          res.send(news);
        }
        else{
          res.render('error', { error: err});
        }
        });
  };

exports.followers_count = function(req,res){
    var sess = req.session;
    var user = sess.user;
    if(user.company_event === 'nike'){
      symbol = 'Nike';
    }
    else {
      symbol = 'Loreal';
    }
    twitter.get('users/lookup', { screen_name: symbol},  function (err, data, response) {
      if(data){
        var coun = {followers_count: data[0].followers_count, status_count:data[0].statuses_count};
        console.log(coun);
        res.send(coun);
      }
      else{
        res.render('error', { error: err});
      }
});

};
exports.facebooklike = function(req, res){
  var sess = req.session;
  var user = sess.user;
  if(user.company_event === 'nike'){
    symbol = "SELECT share_count, total_count FROM link_stat WHERE url = www.nike.com/us/en_us/" ;
  }
  else {
    symbol = "SELECT share_count, total_count FROM link_stat WHERE url = http://www.loreal.com/" ;
  }

  http.get('graph.facebook.com/fql?q='+symbol, function(data,err){
    if(data){
        console.log(data);
        res.send(data);
    }
    else{
        res.render('error', { error: err});
    }

  });
};
exports.gettweets = function (req,res){
    var sess = req.session;
    var user = sess.user;
    if(user.company_event === 'nike'){
      symbol = 'NIKE';
    }
    else {
      symbol = 'loreal';
    }

  	twitter.get('search/tweets', {q: symbol, count:1000}, function(err, data) {
      if(data){
        res.send(data.statuses);
      }
      else{
        res.render('error', { error: err});
      }
    });

};

exports.lastTradePriceOnly = function(req, res) {
          var sess = req.session;
          var user = sess.user;
          if(user.company_event === 'nike'){
            symbol = 'NASDAQ:NKE';
            stocksymbol = 'NKE';
          }
          else {
            symbol = 'EPA:OR';
            stocksymbol = 'OR.PA';
          }
          yahooFinance.snapshot({
            symbol: stocksymbol,
            fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
            }, function (err, snapshot) {
            if (!err){
                res.send(snapshot);
              }
            else{
                res.render('error', { error: error});
              }
      });
};



exports.maincontent = function(req, res){
  var sess = req.session;
	var user = sess.user;
  if(user.type_user == 'Vendor'){
    res.render('vendormaincontent', { user: user});
  }else{
    res.render('eventmaincontent', {user: user});
  }
};


exports.statistics = function(req, res){
  var sess = req.session;
  var user = sess.user;
  if (user.company_event === 'nike'){
    res.render('statistics1', {title: 'Statistics'});
  }else {
    res.render('statistics2', {title: 'Statistics'});
  }

};

exports.products = function(req, res){
  var sess = req.session;
  var user = sess.user;
  var products = new product();
  products.getProducts(function(err, result){
    if(!err){
      res.render('products', {title: 'products', user: user, products: result});
    }
    else{
      res.render('error', {user:user, error : err});
    }
  }, req);


};

exports.events = function(req, res){
  var sess = req.session;
  var eventObj = new event();
  eventObj.getAllEvents(function(err, events){
    if(!err){
        sess.events = events;
        res.render('events', { user: user, events: events});
      }
      else{
        res.render('error', {user:user, error : err});
      }
  }, req);
	
};

exports.adAnalytics = function(req, res){
  var sess = req.session;
  res.render('adAnalytics', {user: sess.user});
 	
};

exports.getProducts = function(req, res){
  productModel = new product();

  productModel.getProducts(function(err, products){
    if(!err){
      res.send(products.rows);
    }else{
      res.render('error', {error: err});
    }
    
  }, req);
}




exports.validateUser =function(req,res){
  var sess = req.session;
	var newUser = new user();
	newUser.validateUser(function(err,result) {
		if(err){
			res.render('error', {error: err});
		}else{
      sess.user = result;
      res.redirect('/'+ sess.user.company_event +'/' + sess.user.fname +'_' + sess.user.lname + '/index');
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


exports.addProduct = function(req, res){

    var sess = req.session;
    var user = sess.user;

    var newProduct = new product();

    newProduct.addProduct(function(err, success){
      if(!err){
        // Add product to recommendation
        var recommendationObj = new recommendation();
        recommendationObj.addProductRecommendation(function(err, success){
          if(!err){
            res.redirect('/'+ sess.user.company_event + '/'+user.fname+'_'+user.lname+'/products');
          }else{
            res.render('error', {error: err});
          }
        }, req);
        
      }else{
        //Render a error page
        res.render('error', {user: user, error:err});

      }
    }, req);

  };


//EVENTS ROUTES
exports.event_dashboard = function(req, res){

    var sess = req.session;
    var user = sess.user;
    var eventobj = new event();
    eventobj.getEvents(function(err, events){
      if(!err){
        sess.events = events;
        res.render('event_dashboard', { user: user, events: events});
      }
      else{
        res.render('error', {user:user, error : err});
      }
  }, req);



};

exports.event_statistics= function(req, res){

    var sess = req.session;
    var user = sess.user;

    res.render('event_statistics', {user:user});

};

exports.event_events = function(req, res){

    var sess = req.session;
    var eventobj = new event();
    eventobj.getEvents(function(err, events){
      if(!err){
        sess.events = events;
        res.render('event_events', {title: 'Events', user: sess.user, events: sess.events});
      }
      else{
        res.render('error', {user:user, error : err});
      }
  }, req);
};

exports.addEvent = function(req, res){

    var sess = req.session;
    var user = sess.user;
    var newEvent = new event();
    newEvent.addEvent(function(err, success){
      if(!err){
        // DO RECOMMENDATION ON PRODUCTS

        //var recommendationObj = new recommendation();
        //recommendationObj.addEventRecommendation(function(err, success){
         // if(!err){
            res.redirect('/'+ sess.user.company_event + '/'+user.fname+'_'+user.lname+'/event_events');
         // }else{
            res.render('error', {error:err});
         // }


        //}, req);
      }else{
        //Render a error page
        res.render('error', {error: err});

      }
    }, req);

};

//ANALTYTICS API
exports.getDesicionTreeEvents = function(req, res){
  var user = req.session.user;

  var products = new product();
  products.getProducts(function(err, products){
    if(!err){
      console.log(products);
      var eventobj = new event();
      eventobj.getAllEvents(function(err, events){
        if(!err){
          console.log(events);

        }
        else{
          res.render('error', {user:user, error : err + "<br> Could not get Events"});
        }
      }, req);
    }
    else{
      res.render('error', {user:user, error : err + "<br>Could not get products!"});
    }
  }, req);
  
 
}


//ERROR API
exports.error = function(req, res){
  res.render('error', {user: req.session.user});
};


exports.NotFoundErrorPage = function(req,res){
  res.render('NotFoundErrorPage');
};
