var userDao = require("../DatabaseConnections/UserDao");
var userobj = new userDao();

var ejs = require("ejs");

function Product() {


}

Product.prototype.addProduct = function(callback, request)
{
	userobj.addProduct(function(err,res) {
		callback(err,res);

	},request.body.productName, request.body.ageGroup, request.body.gender, request.body.category, request.body.description, request.session.user.company_event, request.body.tags);

};

Product.prototype.getProducts = function(callback, request){
	console.log(request.session.user.company_event);
	userobj.getProducts(function(err, result){
		callback(err, result);
	}, request.session.user.company_event);
};
/*
User.prototype.validateUser = function(callback,request)
{


	userobj.validateUser(function(err,res) {
		callback(err,res);

	},request.email,request.password);

};

User.prototype.getUserById = function(callback, email){


	userobj.getUserById(function(err,res){
		callback(err,res);
	},email);
};

*/
module.exports = Product;
