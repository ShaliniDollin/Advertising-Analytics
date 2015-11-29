var userDao = require("../DatabaseConnections/UserDao");
var userobj = new userDao();

var ejs = require("ejs");

function User() {

}
User.prototype.createUser = function(callback, request)
{
	userobj.createUser(function(err,res) {
		callback(err,res);

	},request.fname, request.lname, request.address, request.dob, request.email, request.password, request.typeofuser);

};

User.prototype.validateUser = function(callback,request)
{

	console.log("user function ");

	userobj.validateUser(function(err,res) {
		callback(err,res);

	},request.email,request.password);

};

User.prototype.getUserById = function(callback, email){


	userobj.getUserById(function(err,res){
		callback(err,res);
	},email);
};


module.exports = User;
