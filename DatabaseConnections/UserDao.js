var cassandra = require('cassandra-driver');

var timeId = cassandra.types.TimeUuid.now(); //new instance based on current date
var date = timeId.getDate(); //date representation
var async = require('async');
var contactPoints = ['172.31.6.240'];
var options = {
  contactPoints: contactPoints,
	keyspace: 'advertising',
  encoding: {
    map: Map,
    set: Set
  }
};
var client = new cassandra.Client(options);

var insertQ = 'INSERT INTO advertising.users (id, fname, lname, address, dob, email, password, typeofuser) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
var checkQ = 'select * from advertising.users where email = ?';
var authQ = 'select password from advertising.users where email = ?';

function UserDao() {

}

UserDao.prototype.createUser = function(callback, fname, lname, address, dob, email, password, typeofuser){

	 var param = {email: email};
	 client.execute(checkQ, param, {prepare: true}, function(err, result){
		 console.log("here"+err);
		 if(!err){
          console.log("here"+result);
		 		 if (result.length === 0){
					 var id = cassandra.types.Uuid.random(); //new uuid v4
					 var params = {id:id, fname:fname, lname:lname, address:address, dob: Date(dob), email:email, password:password, typeofuser:typeofuser};
					 client.execute(insertQ, param, {prepare: true}, function(err1, result1){
						 if( !err ) {
								 console.log( 'created'+user );
								 callback( null,user );
						 } else {
							 console.log( err );
							 callback('ERROR',null);
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
		var param = {email:email};
		client.execute(authQ, param, {prepare: true}, function (err, pwd){
			if (pwd.rows.length === 0){
				console.log('Not Found');
				callback('ERROR',null);
			}
			else{
				var pwd1 = pwd[0];
				if(password === pwd1){
					callback('success', email);
				}
				else{
					callback('Incorrect Password', null);
				}
			}
		});
	};

UserDao.prototype.getUserById = function (callback, email){
	param = {email:email};
	client.execute(checkQ, param, {prepare: true}, function(err, result){
		if(result.rows.length === 0){
			console.log('Not Found');
			callback('ERROR',null);
		}
		else {
			var fname = result.rows[0].fname;
			callback('success', fname);
			}
		});
	};

//db.connection.close();
module.exports = UserDao;
