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

function VendorDao() {

}


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
