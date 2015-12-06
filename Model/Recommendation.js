var userDao = require("../DatabaseConnections/UserDao");
var userobj = new userDao();

var ejs = require("ejs");

function Recommendation() {
}

Recommendation.prototype.addProductRecommendation = function(callback, request)
{
	var genre;
	if (request.session.user.company_event == 'nike'){
		genre = 'sports';
	}
	else{
		genre = 'beauty';
	}
	userobj.getAllEventsForProduct(function(err, events){
		if(!err){
			//DOING THE COSINE SIMILARITY
			//NPM cosine functionality
			var product_tags = request.body.tags;
			var product_revenue = {
				"North America" : 0,
				"Central & Eastern Europe" : 0,
				"Western Europe" : 0,
				"Greater China" : 0,
				"Japan" : 0,
				"Emerging Markets" : 0
			};
			console.log(events);
			userobj.getRevenuesByCompany(function(err, revenues){
				//console.log(revenues);
				for(i = 0; i < revenues.rows.length; i++){
					if(product_revenue[revenues.rows[i].region] == 0){
						product_revenue[revenues.rows[i].region] = product_revenue[revenues.rows[i].region] + revenues.rows[i].revenue;
					}else{
						product_revenue[revenues.rows[i].region] = (product_revenue[revenues.rows[i].region] + revenues.rows[i].revenue)/2;
					}
					
				}
				
				var numerator = 0;
				var denominator = 0;
				
				for(i = 0; i < events.rows.length; i++){
					for(j = 0; j < events.rows[i].tags; j++){
						if (events.rows[i].tags[j] in product_tags){
							numerator = numerator + 1;
						}
					}

					numerator = numerator + product_revenue[events.rows[i].region];
					denominator = Math.sqrt(events.rows[i].tag.length) * Math.sqrt(product_tags.length +
													Math.pow(product_revenue["North America"],2) +
													Math.pow(product_revenue["Central & Eastern Europe"], 2) +
													Math.pow(product_revenue["Western Europe"], 2) +
													Math.pow(product_revenue["Greater China"], 2) +
													Math.pow(product_revenue["Japan"], 2) +
													Math.pow(product_revenue["Emerging Markets"], 2));
					
					events.rows[i].cosine = numerator / denominator;
					//console.log(events.rows[i]);
				}
				console.log(events.rows.sort(function(a, b){ return b.cosine - a.cosine;}));
				var events_result = [];
				for (i = 0; i < events.rows.length; i++){
					events_result.push(events.rows[i].name);
				}
				userobj.addProductRecommendation(function(err, success){
					if(!err){
						callback(null, success);
					}else{
						callback(err, null);
					}
				}, request.body.productName, request.session.user.company_event, events_result);
			}, request.session.user.company_event);
			
		}else{
			callback(err, null);
		}
	}, request.body.gender, genre, request.body.ageGroup);
	
};

module.exports = Recommendation;
