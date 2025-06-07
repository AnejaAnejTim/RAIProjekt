var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var pushNotificationSchema = new Schema({
    'token' : String,
    'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	}
});

module.exports = mongoose.model('pushNotification', pushNotificationSchema);
