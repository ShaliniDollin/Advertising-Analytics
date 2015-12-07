var cassandra = require('cassandra-driver');
var async = require('async');
var contactPoints = ['52.8.183.176'];
var options1 = {
  contactPoints: contactPoints,
	keyspace: "",
  encoding: {
    map: Map,
    set: Set
  }
};




var client1;

var netIncomeQ='select net_income from financial_data where year=?';
var advertisingExpense ='select demand_creation_expense from financial_data where year=?';
function VendorDao() {

}

VendorDao.prototype.getAdvertisingExpense = function(callback, year,vendor){
	 var param = [year];
	 options1.keyspace = vendor;
	 client1 = new cassandra.Client(options1);
	 client1.execute(advertisingExpense, param, {prepare: true}, function(err, result){
		 //close connection
		 if(!err){
			 console.log( 'expense query executed');
			 console.log(result);
			 	if (result.rows.length > 0){
			 		var expense = result.rows[0].demand_creation_expense;
			 		console.log("advertising expense is"+expense);
			 		callback(null,expense);
			 	}
			 	else{

				callback( "Advertising expense not found",null);
			 	}

       }
		 else {
			 console.log( err );
			 callback('ERROR',null);
      }
	});
};
VendorDao.prototype.getVendorIncome = function(callback, year,vendor){
	 var param = [parseInt(year) - 1];
	 options1.keyspace = vendor;
	 client1 = new cassandra.Client(options1);
	 client1.execute(netIncomeQ, param, {prepare: true}, function(err, result){
		 //Close connection
		 if(!err){
			 console.log( 'query executed');
			 console.log(result);
			 	if (result.rows.length > 0){
			 		var income = result.rows[0].net_income;
			 		console.log("net income is"+income);
			 		callback(null,income);
			 	}
			 	else{

				callback( "Netincome not found",null);
			 	}

        }
		 else {
 			 console.log( err );
 			 callback('ERROR',null);
       }
	});
};

module.exports = VendorDao;
