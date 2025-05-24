var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'password' : String,
	'email' : String,
	'pushToken' : [{
		token: String,
		deviceId: String,
		platform: {
			type: String,
			enum: ['ios', 'android', 'web']
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		lastUsed: {
			type: Date,
			default: Date.now
		}
	}],
	'twoFactorEnabled': {
		type: Boolean,
		default: true
	},
	'loginHistory': [{
		timestamp: {
			type: Date,
			default: Date.now
		},
		ipAddress: String,
		userAgent: String,
		deviceInfo: {
			browser: String,
			os: String,
			device: String
		},
		location: {
			country: String,
			city: String,
			coordinates: {
				lat: Number,
				lng: Number
			}
		},
		status: {
			type: String,
			enum: ['success', 'failed', 'pending', 'denied'],
			default: 'success'
		}
	}],
	'accountSettings': {
		requireMobileApproval: {
			type: Boolean,
			default: true
		},
		notifyOnNewDevice: {
			type: Boolean,
			default: true
		},
		sessionTimeout: {
			type: Number,
			default: 24
		}
	}
}, {
	'timestamps': true
});

userSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		if(err){
			return next(err);
		}
		user.password = hash;
		next();
	});
});

userSchema.statics.authenticate = function(username, password, callback){
	User.findOne({username: username})
	.exec(function(err, user){
		if(err){
			return callback(err);
		} else if(!user) {
			var err = new Error("User not found.");
			err.status = 401;
			return callback(err);
		} 
		bcrypt.compare(password, user.password, function(err, result){
			if(result === true){
				return callback(null, user);
			} else{
				return callback();
			}
		});
		 
	});
}
userSchema.methods.comparePassword = function(candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ email: 1 });
userSchema.index({ 'pushTokens.token': 1 });

userSchema.methods.addPushToken = async function(tokenData) {
	this.pushTokens = this.pushTokens.filter(
		pt => pt.deviceId !== tokenData.deviceId
	);

	this.pushTokens.push({
		...tokenData,
		createdAt: new Date(),
		lastUsed: new Date()
	});

	if (this.pushTokens.length > 5) {
		this.pushTokens = this.pushTokens.slice(-5);
	}

	return this.save();
};

userSchema.methods.removePushToken = async function(tokenOrDeviceId) {
	this.pushTokens = this.pushTokens.filter(
		pt => pt.token !== tokenOrDeviceId && pt.deviceId !== tokenOrDeviceId
	);

	return this.save();
};

userSchema.methods.updateTokenLastUsed = async function(token) {
	const pushToken = this.pushTokens.find(pt => pt.token === token);
	if (pushToken) {
		pushToken.lastUsed = new Date();
		return this.save();
	}
};

userSchema.methods.addLoginHistory = async function(loginData) {
	this.loginHistory.unshift(loginData);

	if (this.loginHistory.length > 50) {
		this.loginHistory = this.loginHistory.slice(0, 50);
	}

	return this.save();
};

userSchema.methods.getActivePushTokens = function() {
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - 30);

	return this.pushTokens.filter(pt => pt.lastUsed > cutoffDate);
};

userSchema.methods.cleanupOldTokens = async function() {
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - 90);

	this.pushTokens = this.pushTokens.filter(pt => pt.createdAt > cutoffDate);

	return this.save();
};



var User = mongoose.model('user', userSchema);
module.exports = User;
