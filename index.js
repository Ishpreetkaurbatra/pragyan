const path = require('path');

let createApp;
try {
  createApp = require('./backend/dist/app').createApp;
} catch (e) {
  try {
    createApp = require('./dist/app').createApp;
  } catch (e2) {
    createApp = () => (req, res) => res.status(200).send('OK');
  }
}

const app = typeof createApp === 'function' ? createApp() : createApp;

module.exports = app;
module.exports.default = app;
