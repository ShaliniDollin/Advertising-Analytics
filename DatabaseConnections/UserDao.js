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

var insertQ = 'INSERT INTO advertising.user (fname, lname, dob, company_event, email, password, type_user) VALUES(?, ?, ?, ?, ?, ?)';
var checkQ = 'select count(*) from advertising.user where email = ?';
var authQ = 'select password from advertising.user where email = ?';


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
							 console.log( 'created');
               callback( null,fname);
					  } else {
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
    console.log("email"+email);
		client.execute(authQ, param, {prepare: true}, function (err, pwd){
      if(!err){
			if (pwd.rows.length < 1){
				console.log('Not Found');
				callback('Not Found',null);
			}
			else{
				var pwd1 = pwd.rows[0];
				if(password === pwd1){
					callback( null,email);
				}
				else{
					callback('Incorrect Password', null);
				}
			}
    }
    else{
      callback('ERROR', null);
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

//db.connection.close();
module.exports = UserDao;
