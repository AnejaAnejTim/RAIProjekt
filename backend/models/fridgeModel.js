var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var fridgeSchema = new Schema({
	'item_name' : String,
	'quantity' : Number,
	'expiration' : Date,
	'barcode' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'barcode'
	},
	'addedOn' : Date,
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	}
});

module.exports = mongoose.model('fridge', fridgeSchema);
