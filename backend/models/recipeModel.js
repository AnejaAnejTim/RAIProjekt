var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var recipeSchema = new Schema({
	'title' : String,
	'description' : String,
	'ingredients' : String,
	'prep_time' : String,
	'cook_time' : String,
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	}
});

module.exports = mongoose.model('recipe', recipeSchema);
