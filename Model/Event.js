var userDao = require("../DatabaseConnections/UserDao");
var userobj = new userDao();

var ejs = require("ejs");

function Event() {
}

Event.prototype.addEvent = function(callback, request)
{

	userobj.addEvent(function(err,res) {
		callback(err,res);

	},request.body.eventName, request.body.ageGroup, request.body.gender, request.body.audienceNumber,
	request.body.city, request.body.description,request.session.user.company_event, 
	request.body.genre, request.body.organizerContact, request.body.organizerName, request.body.region,
	 request.body.tags );

};

Event.prototype.getEvents = function(callback, request){
	userobj.getEvents(function(err, result){
		callback(err, result);
	}, request.session.user.company_event);
};

Event.prototype.getAllEvents = function(callback, request){
	userobj.getAllEvents(function(err, result){
		callback(err, result);
	});
};




module.exports = Event;