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
					if(product_revenue[revenues.rows[i].region] === 0){
						product_revenue[revenues.rows[i].region] = product_revenue[revenues.rows[i].region] + (revenues.rows[i].revenue/1000);
					}else{
						product_revenue[revenues.rows[i].region] = (product_revenue[revenues.rows[i].region] + (revenues.rows[i].revenue)/1000)/2;
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
				var ele = {};
				for (i = 0; i < events.rows.length; i++){
					ele = {};
					ele[events.rows[i].name] = events.rows[i].cosine;
					events_result.push(JSON.stringify(ele));
					//events_result.push(events.rows[i].name);
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

Recommendation.prototype.showperformance = function(callback, request){


	userobj.showperformance(function(err,res) {
		console.log("rec.js", res);
		callback(err,res);

	},request.session.user.company_event);

};
/*
Recommendation.prototype.addEventRecommendation = function(callback, request)
{
	var genre;
	if (request.session.user.company_event == 'nike'){
		genre = 'sports';
	}
	else{
		genre = 'beauty';
	}
	userobj.getAllProductsForEvent(function(err, products){
		if(!err){
			//DOING THE COSINE SIMILARITY
			//NPM cosine functionality
			var event_tags = request.body.tags;
			console.log(products);
			var nike_revenue = {
				"North America" : 0,
				"Central & Eastern Europe" : 0,
				"Western Europe" : 0,
				"Greater China" : 0,
				"Japan" : 0,
				"Emerging Markets" : 0
			};

			var loreal_revenue = {
				"North America" : 0,
				"Central & Eastern Europe" : 0,
				"Western Europe" : 0,
				"Greater China" : 0,
				"Japan" : 0,
				"Emerging Markets" : 0
			};

			userobj.getRevenuesByCompany(function(err, revenues_nike){
				if(!err){
					for(i = 0; i < revenues_nike.rows.length; i++){
						if(nike_revenue[revenues_nike.rows[i].region] == 0){
							nike_revenue[revenues_nike.rows[i].region] = nike_revenue[revenues_nike.rows[i].region] + (revenues_nike.rows[i].revenue/1000);
						}else{
							nike_revenue[revenues_nike.rows[i].region] = (nike_revenue[revenues_nike.rows[i].region] + (revenues_nike.rows[i].revenue)/1000)/2;
						}
					}
					userobj.getRevenuesByCompany(function(err, revenues_loreal){
						if(!err){
							for(i = 0; i < revenues_loreal.rows.length; i++){
								if(loreal_revenue[revenues_loreal.rows[i].region] == 0){
									loreal_revenue[revenues_loreal.rows[i].region] = loreal_revenue[revenues_loreal.rows[i].region] + (revenues_loreal.rows[i].revenue/1000);
								}else{
									loreal_revenue[revenues_loreal.rows[i].region] = (loreal_revenue[revenues_loreal.rows[i].region] + (revenues_loreal.rows[i].revenue)/1000)/2;
								}
							}
							var numerator = 0;
							var denominator = 0;
							for( i = 0; i < products.rows.length; i++){

								for(j = 0; j < products.rows[i].tags; j++){
									if (products.rows[i].tags[j] in event_tags){
										numerator = numerator + 1;
									}
								}
								if (products.rows[i].company == 'nike'){
									numerator = numerator + nike_revenue[products.rows[i].region];
									denominator = Math.sqrt(products.rows[i].tag.length) * Math.sqrt(event_tags.length +
												Math.pow(nike_revenue["North America"],2) +
												Math.pow(nike_revenue["Central & Eastern Europe"], 2) +
												Math.pow(nike_revenue["Western Europe"], 2) +
												Math.pow(nike_revenue["Greater China"], 2) +
												Math.pow(nike_revenue["Japan"], 2) +
												Math.pow(nike_revenue["Emerging Markets"], 2));
								}else{
									numerator = numerator + nike_revenue[products.rows[i].region];
									denominator = Math.sqrt(products.rows[i].tag.length) * Math.sqrt(event_tags.length +
												Math.pow(loreal_revenue["North America"],2) +
												Math.pow(loreal_revenue["Central & Eastern Europe"], 2) +
												Math.pow(loreal_revenue["Western Europe"], 2) +
												Math.pow(loreal_revenue["Greater China"], 2) +
												Math.pow(loreal_revenue["Japan"], 2) +
												Math.pow(loreal_revenue["Emerging Markets"], 2));
								}

								var ele = {};
								ele[request.body.eventName] = numerator / denominator;


								//cosine = {request.body.eventName : numerator / denominator};

								//BRING EACH PRODUCT and UPDATE THE ROW

								userobj.getProductFromRecommendation(function(err, recomendation){
									if(!err){
										recomendation.rows[0].events.push(JSON.stringify(ele));
										console.log(recomendation.rows[0].events);
									}else{
										callback(err, null);
									}
								}, products.rows[i].name);
							}

						}else{
							callback(err, null);
							}
					}, "loreal");
				}else{
					callback(err, null);
				}
			}, "nike");

		}else{
			callback(err, null);
		}
	}, request.body.gender, genre, request.body.ageGroup);

};*/


module.exports = Recommendation;
