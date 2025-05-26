const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');
const {getActiveDevices} = require('../mqtt/tracker');

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        console.log(req.session)
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/locations', requiresLogin, async (req, res) => {
    try {
        const data = await Location.find().sort({timestamp: -1}).limit(100);
        res.json(data);
    } catch (err) {
        res.status(500).json({error: 'Napaka pri pridobivanju lokacij'});
    }
});

router.get('/active-devices', requiresLogin, (req, res) => {
    res.json(getActiveDevices());
});

router.get('/my-latest-locations', requiresLogin, async (req, res) => {
    try {
        const userId = req.session.userId;
        const latestLocations = await Location.aggregate([
            { $match: { user: require('mongoose').Types.ObjectId(userId) } },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: "$deviceId",
                    deviceId: { $first: "$deviceId" },
                    latitude: { $first: "$latitude" },
                    longitude: { $first: "$longitude" },
                    timestamp: { $first: "$timestamp" }
                }
            }
        ]);
        res.json(latestLocations);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching latest locations' });
    }
});


module.exports = router;
