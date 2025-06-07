const mqtt = require('mqtt');
const Location = require('../models/locationModel');

const client = mqtt.connect('mqtt://100.117.101.70:1883');
const activeDevices = new Map();

client.on('connect', () => {
  console.log('Povezan na MQTT broker');
  client.subscribe('device/location');
});

client.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const {deviceId, latitude, longitude, timestamp, user} = data;
    await Location.create({
      deviceId,
      latitude,
      longitude,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      user,
    });
    activeDevices.set(deviceId, Date.now());
    console.log("Got new location");
  } catch (err) {
    console.error('Napaka pri obdelavi sporočila:', err.message);
  }
});

setInterval(() => {
  const now = Date.now();
  for (const [deviceId, lastSeen] of activeDevices.entries()) {
    if (now - lastSeen > 20 * 1000) {
      activeDevices.delete(deviceId);
    }
  }
}, 60 * 1000);

module.exports = {
  getActiveDevices: () => ({
    count: activeDevices.size,
    devices: Array.from(activeDevices.keys()),
  }),
};
