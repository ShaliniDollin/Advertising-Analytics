var userDao = require("../DatabaseConnections/UserDao");
var userobj = new userDao();

var ejs = require("ejs");

function Product() {


}

Product.prototype.addProduct = function(callback, request)
{
	var tags;
	if(request.body.tags instanceof Array){
		tags = request.body.tags;
	}
	else{
		tags = [];
		tags[0] = request.body.tags;
	}
	
	userobj.addProduct(function(err,res) {
		callback(err,res);

	},request.body.productName, request.body.ageGroup, request.body.gender, request.body.category, request.body.description, request.session.user.company_event, tags);

};

Product.prototype.getProducts = function(callback, request){
	console.log(request.session.user.company_event);
	userobj.getProducts(function(err, result){
		callback(err, result);
	}, request.session.user.company_event);
};


module.exports = Product;
