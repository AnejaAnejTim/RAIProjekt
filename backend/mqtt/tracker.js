const mqtt = require('mqtt');
const Location = require('../models/locationModel');

const mqttClient = mqtt.connect('mqtt://100.110.68.49:1883');
const onlineDevices = new Map();

mqttClient.on('connect', () => {
  console.log('📡 Connected to MQTT broker');
  mqttClient.subscribe('device/location');
});

mqttClient.on('message', async (topic, payload) => {
  try {
    const msg = JSON.parse(payload.toString());
    const { deviceId, latitude, longitude, timestamp, user } = msg;
    await Location.create({
      deviceId,
      latitude,
      longitude,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      user,
    });
    onlineDevices.set(deviceId, Date.now());
  } catch (e) {
    console.error('Error processing MQTT message:', e.message);
  }
});

setInterval(() => {
  const cutoff = Date.now() - 20 * 1000;
  for (const [id, last] of onlineDevices.entries()) {
    if (last < cutoff) {
      onlineDevices.delete(id);
    }
  }
}, 60 * 1000);

module.exports = {
  getActiveDevices: () => ({
    count: onlineDevices.size,
    devices: Array.from(onlineDevices.keys()),
  }),
};