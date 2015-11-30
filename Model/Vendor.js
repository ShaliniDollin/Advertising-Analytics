var VendorDao = require("../DatabaseConnections/VendorDao");
var vendorobj = new VendorDao();

var ejs = require("ejs");

function Vendor() {

}

Vendor.prototype.getVendorIncome = function(callback, year,vendor_name)
{
	vendorobj.getVendorIncome(function(err,res) {
		callback(err,res);

	},year,vendor_name);

};

module.exports = Vendor;