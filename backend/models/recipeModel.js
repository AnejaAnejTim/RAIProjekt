var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({
    'title': String,
    'description': String,
    'ingredients': [String],
    'prep_time': String,
    'cook_time': String,
    'user': {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    'views': {type: Number, default: 0},
    'viewedBy': [{
        user: {type: Schema.Types.ObjectId, ref: 'user'},
        date: {type: Date}
    }],
    'images': [{
        filename: String,
        originalName: String,
        path: String,
        mimetype: String,
        size: Number,
        uploadDate: {type: Date, default: Date.now}
    }],
    'mainImage': {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('recipe', recipeSchema);