const path = require('path');
let appModule;
try {
  appModule = require('./dist/app');
} catch (e) {
  try {
    appModule = require('./app');
  } catch (e2) {
    appModule = {};
  }
}

const createApp = appModule.createApp;
const app = appModule.default || appModule.app || (typeof createApp === 'function' ? createApp() : appModule);

module.exports = app;
module.exports.default = app;
module.exports.app = app;
module.exports.createApp = createApp;
