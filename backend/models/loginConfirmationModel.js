const mongoose = require('mongoose');

const loginRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    confirmationToken: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    deviceInfo: {
        browser: String,
        os: String,
        device: String,
        userAgent: String
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied', 'expired'],
        default: 'pending',
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    approvedAt: Date,
    deniedAt: Date,
    location: {
        country: String,
        city: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    }
}, {
    timestamps: true
});

loginRequestSchema.index({userId: 1, status: 1, expiresAt: 1});
loginRequestSchema.index({confirmationToken: 1, status: 1});

loginRequestSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

loginRequestSchema.pre('find', function () {
    this.where({expiresAt: {$gt: new Date()}});
});

loginRequestSchema.pre('findOne', function () {
    this.where({expiresAt: {$gt: new Date()}});
});

module.exports = mongoose.model('LoginRequest', loginRequestSchema);