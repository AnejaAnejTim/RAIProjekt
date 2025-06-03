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

router.get('/my-active-inactive-devices', requiresLogin, async (req, res) => {
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

        const activeDevicesObj = getActiveDevices();
        const activeDeviceIds = Array.isArray(activeDevicesObj.devices)
            ? activeDevicesObj.devices.map(id => id.toString())
            : [];

        const activeDevices = latestLocations.filter(device =>
            activeDeviceIds.includes(device.deviceId.toString())
        );
        const inactiveDevices = latestLocations.filter(device =>
            !activeDeviceIds.includes(device.deviceId.toString())
        );

        res.json({ activeDevices, inactiveDevices });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching devices' });
    }
});

router.get('/active-devices', requiresLogin, (req, res) => {
    try {
        const activeDevices = getActiveDevices();
        res.json(activeDevices);
    } catch (err) {
        res.status(500).json({error: 'Napaka pri pridobivanju aktivnih naprav'});
    }
});

router.get('/all-devices', async (req, res) => {
    try {
        const allDevices = await Location.find().distinct('deviceId');
        res.json(allDevices);
    } catch (err) {
        res.status(500).json({error: 'Napaka pri pridobivanju vseh naprav'});
    }
});

router.get('/locations', requiresLogin, async (req, res) => {
    try {
        const data = await Location.find().sort({timestamp: -1}).limit(100);
        res.json(data);
    } catch (err) {
        res.status(500).json({error: 'Napaka pri pridobivanju lokacij'});
    }
});

module.exports = router;
