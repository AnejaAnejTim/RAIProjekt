var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var barcodeSchema = new Schema({
	'code' : String,
	'product_name' : String,
	'brand' : String,
	'weight' : String,
	'unit' : String
});

module.exports = mongoose.model('barcode', barcodeSchema);
