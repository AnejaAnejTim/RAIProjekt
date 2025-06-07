var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
    'text': String,
    'user': {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    'recipe': {
        type: Schema.Types.ObjectId,
        ref: 'recipe'
    },
    'createdAt': {
        type: Date,
        default: Date.now
    },
    'updatedAt': {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
}
);
module.exports = mongoose.model('comment', commentSchema);

