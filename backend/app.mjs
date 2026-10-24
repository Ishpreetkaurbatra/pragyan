import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
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
const instance = appModule.default || appModule.app || (typeof createApp === 'function' ? createApp() : {});
export { createApp, instance as app };
export default instance;
