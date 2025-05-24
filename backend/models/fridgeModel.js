var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var fridgeSchema = new Schema({
	'name' : String,
	'quantity' : Number,
	'unit': String,
	'expiration' : Date,
	'addedOn' : Date,
	'icon' : String,
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	}
});

module.exports = mongoose.model('fridge', fridgeSchema);
