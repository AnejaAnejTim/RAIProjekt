const mongoose = require('mongoose');
const { Schema } = mongoose;

const LocationSchema = new Schema({
  'deviceId': String,
  'latitude': Number,
  'longitude': Number,
  'timestamp': Date,
  'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	}
});

module.exports = mongoose.model('Location', LocationSchema);
