var cassandra = require('cassandra-driver');
var async = require('async');
var contactPoints = ['52.8.183.176'];
var options = {
  contactPoints: contactPoints,
	keyspace: 'advertising',
  encoding: {
    map: Map,
    set: Set
  }
};
var client = new cassandra.Client(options);

var insertQ = 'INSERT INTO advertising.user (fname, lname, company_event, dob, email, password, type_user) VALUES(?, ?, ?, ?, ?, ?, ?)';
var checkQ = 'select * from advertising.user where email = ?';
var authQ = 'select * from advertising.user where email = ?';
var insertProductQ = 'INSERT INTO advertising.product (name, aud_age_e, aud_age_s, audience_gender, category, company, description, genre, tag) VALUES (?,?,?,?,?,?,?,?,?)';
var getProductsQ = 'select * from advertising.product where company = ?';
var insertEventQ = 'INSERT INTO advertising.event (name, aud_age_e, aud_age_s, audience_gender, audience_number, city, description, event_company_name, genre, organizer_contact, organizer_name ,region, tag ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
var getEventsQ = 'Select * from advertising.event where event_company_name = ?';

var getAllEventsQ = 'Select * from advertising.event';
var getAllEventsForProductQ1 = 'Select * from advertising.event where audience_gender =  ? and genre = ? and aud_age_e = ? and aud_age_s = ? ALLOW FILTERING';
var getAllEventsForProductQ2 = 'Select * from advertising.event where genre = ? and aud_age_e = ? and aud_age_s = ? ALLOW FILTERING';
var getRevenuesQ = "Select * from advertising.revenue where company = ?";
var addProductRecommendationsQ = 'INSERT INTO advertising.recommendation (product_name, company, events) VALUES (?,?,?)';
var getAllProductsForEventQ = 'Select * from advertising.product where audience_gender = ? and genre = ? and aud_age_e = ? and aud_age_s = ? ALLOW FILTERING ';
var getProductFromRecommendationQ = 'Select * from advertising.recommendation where product_name = ?';

function UserDao() {

}

UserDao.prototype.createUser = function(callback, fname, lname, company_event, dob, email, password, type_user){
	 var param = [email];
	 client.execute(checkQ, param, {prepare: true}, function(err, result){
		 if(!err){
		 		 if (result.rows.length < 1){
					 var param1 = [fname, lname, company_event, dob, email, password, type_user];
					 client.execute(insertQ, param1, {prepare: true}, function(err1){
					 if( !err1 ) {
                client.execute(checkQ, param, {prepare: true}, function(error, json){
                  if(!error){
                    if(json.rows.length > 0){
                          var user = json.rows[0];
                          callback( null,user);
                    }
                  }
                  else{
                    console.log( err1 );
                    callback('ERROR1',null);
                  }
                });
              }
             else{
               console.log( err1 );
							 callback('ERROR1',null);
             }
					 });
				 }
		 		 else{
		 			callback('User Already Exists',null);
		 		 }
		 }
		 else {
  			 console.log( err );
  			 callback('ERROR',null);
       }
	});
};



UserDao.prototype.validateUser = function(callback, email, password){
		var param = [email];
		client.execute(authQ, param, {prepare: true}, function (err, result){
      if(!err){
			if (result.rows.length > 0){
          var user = result.rows[0];
          if(user.password === password){
            callback(null, user);
          }
          else{
            callback( "Incorrect Password",null);
          }

			}
			else{
					callback( "Incorrect Email and Password",null);
				}
      }
				else{
      console.log(err);
					callback('Error', null);
				}
			});
};

UserDao.prototype.getUserById = function (callback, email){
	param = [email];
	client.execute(checkQ, param, {prepare: true}, function(err, result){
		if(result.rows.length === 0){
			console.log('Not Found');
			callback('ERROR',null);
		}
		else {
			var fname = result.rows[0].fname;
			callback(null, fname);
		}
	});
};


UserDao.prototype.addProduct = function(callback, name, age_group, gender, category, description, company, tags ){
	var aud_age_s, aud_age_e;
	switch(parseInt(age_group)){
		case 5:
			aud_age_s = "0";
			aud_age_e = "5";
			break;
		case 11:
			aud_age_s = "6";
			aud_age_e = "11";
			break;
		case 19:
			aud_age_s = "12";
			aud_age_e = "19";
			break;
		case 30:
			aud_age_s = "20";
			aud_age_e = "30";
			break;
		case 40:
			aud_age_s = "30";
			aud_age_e = "40";
			break;
		default:
			aud_age_s = "41";
			aud_age_e = "100";
	}
	var genre;
	if(company == 'nike'){
		genre = 'sports';
	}else{
		genre = 'beauty';
	}
	var param = [name, aud_age_e, aud_age_s, gender, category, company, description, genre, tags];
	client.execute(insertProductQ, param, {prepare: true}, function(err){
		if(err){
			console.log(err);
			callback("ERROR", null);
		}
		callback(null, "Product Inserted");
	});
};

UserDao.prototype.getProducts = function(callback, company){
	var param = [company];
	client.execute(getProductsQ, param, {prepare: true}, function(err, result){
		if(!err){
			callback(null, result);
		}else{
			callback(err, result);
		}
	});
};

UserDao.prototype.addEvent = function(callback, eventName, ageGroup, gender, audienceNumber,
	city, description,eventCompanyName,genre, organizerContact, organizerName, region, tags ){
	var aud_age_s, aud_age_e;
	switch(parseInt(ageGroup)){
		case 5:
			aud_age_s = "0";
			aud_age_e = "5";
			break;
		case 11:
			aud_age_s = "6";
			aud_age_e = "11";
			break;
		case 19:
			aud_age_s = "12";
			aud_age_e = "19";
			break;
		case 30:
			aud_age_s = "20";
			aud_age_e = "30";
			break;
		case 40:
			aud_age_s = "30";
			aud_age_e = "40";
			break;
		default:
			aud_age_s = "41";
			aud_age_e = "100";
	};

	var param = [eventName, aud_age_e, aud_age_s, gender, audienceNumber, city, description, eventCompanyName,genre, organizerContact, organizerName,region, tags ];
	client.execute(insertEventQ, param, {prepare: true}, function(err){
		if(err){
			console.log(err);
			callback("ERROR", null);
		}else{
			callback(null, "Event Inserted");
		}

	});
};



UserDao.prototype.getEvents = function(callback, event_company_name){
	var param = [event_company_name];
	client.execute(getEventsQ, param, {prepare: true}, function(err, result){
		if(!err){
			callback(null, result);
		}else{
			callback(err, result);
		}
	});
};


UserDao.prototype.getAllEvents = function(callback){
	client.execute(getAllEventsQ, function(err, result){
		if(!err){
			callback(null, result);
		}else{
			callback(err, result);
		}
	});
};


UserDao.prototype.getAllEventsForProduct = function(callback, gender, genre, age){
	var aud_age_s, aud_age_e;
	switch(parseInt(age)){
		case 5:
			aud_age_s = "0";
			aud_age_e = "5";
			break;
		case 11:
			aud_age_s = "6";
			aud_age_e = "11";
			break;
		case 19:
			aud_age_s = "12";
			aud_age_e = "19";
			break;
		case 30:
			aud_age_s = "20";
			aud_age_e = "30";
			break;
		case 40:
			aud_age_s = "30";
			aud_age_e = "40";
			break;
		default:
			aud_age_s = "41";
			aud_age_e = "100";
	};

	var query = getAllEventsForProductQ1;
	var param = [ gender, genre, aud_age_e, aud_age_s];

	if(gender == "young_atheletes"){
		query = getAllEventsForProductQ2;
		param = [genre, aud_age_e, aud_age_s];

	}
	console.log(param);
	client.execute(query, param, {prepare: true}, function(err, result){
		if(!err){
			//console.log(result);
			callback(null, result);
		}
		else{
			console.log(err);
			callback(err, result);
		}
	});
};

UserDao.prototype.getRevenuesByCompany = function(callback, company){
	//console.log(company);
	var param = [company];
	client.execute(getRevenuesQ,param, {prepare: true}, function(err, result){
		if(!err){
			//console.log(result);
			callback(null, result);
		}
		else{
			console.log(err);
			callback(err, result);
		}
	});
};

UserDao.prototype.addProductRecommendation = function(callback, productName, company, events){
	var param = [productName, company, events];
	client.execute(addProductRecommendationsQ,param, {prepare: true}, function(err, result){
		if(!err){
			//console.log(result);
			callback(null, result);
		}
		else{
			console.log(err);
			callback(err, result);
		}
	});
}

UserDao.prototype.getAllProductsForEvent = function(callback, gender, genre, age){
	var aud_age_s, aud_age_e;
	switch(parseInt(age)){
		case 5:
			aud_age_s = "0";
			aud_age_e = "5";
			break;
		case 11:
			aud_age_s = "6";
			aud_age_e = "11";
			break;
		case 19:
			aud_age_s = "12";
			aud_age_e = "19";
			break;
		case 30:
			aud_age_s = "20";
			aud_age_e = "30";
			break;
		case 40:
			aud_age_s = "30";
			aud_age_e = "40";
			break;
		default:
			aud_age_s = "41";
			aud_age_e = "100";
	};
	
	var query = getAllProductsForEventQ;
	var param = [ gender, genre, aud_age_e, aud_age_s];

	if(gender == "both"){
		param = ["young_atheletes", genre, aud_age_e, aud_age_s];

	}
	console.log(param);
	client.execute(query, param, {prepare: true}, function(err, result){
		if(!err){
			//console.log(result);
			callback(null, result);
		}
		else{
			console.log(err);
			callback(err, result);
		}
	});
}

UserDao.prototype.getProductFromRecommendation = function(callback, product_name){
	var param = [product_name];
	client.execute(getProductFromRecommendationQ, param, {prepare: true}, function(err, result){
		if(!err){
			callback(null, result);
		}else{
			callback(err, result);
		}
	});
}
//db.connection.close();
module.exports = UserDao;
