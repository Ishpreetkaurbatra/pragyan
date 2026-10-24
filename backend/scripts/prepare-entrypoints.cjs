const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const backendDir = path.resolve(__dirname, '..');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// CommonJS wrapper that resolves the Express app instance
const distCjsContent = `const appModule = require('./app');
const createApp = appModule.createApp;
const app = appModule.default || appModule.app || (typeof createApp === 'function' ? createApp() : appModule);

module.exports = app;
module.exports.default = app;
module.exports.app = app;
module.exports.createApp = createApp;
`;

const rootCjsContent = `const path = require('path');
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
`;

// ES Module wrapper
const distEsmContent = `import appModule, { createApp, app } from './app.js';
const instance = app || appModule || (typeof createApp === 'function' ? createApp() : {});
export { createApp, instance as app };
export default instance;
`;

const rootEsmContent = `import path from 'path';
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
`;

// Write entrypoint files into backend/dist
fs.writeFileSync(path.join(distDir, 'index.js'), distCjsContent);
fs.writeFileSync(path.join(distDir, 'index.cjs'), distCjsContent);
fs.writeFileSync(path.join(distDir, 'index.mjs'), distEsmContent);

fs.writeFileSync(path.join(distDir, 'app.cjs'), distCjsContent);
fs.writeFileSync(path.join(distDir, 'app.mjs'), distEsmContent);

fs.writeFileSync(path.join(distDir, 'server.cjs'), distCjsContent);
fs.writeFileSync(path.join(distDir, 'server.mjs'), distEsmContent);

// Write entrypoint files into backend/ root
fs.writeFileSync(path.join(backendDir, 'index.js'), rootCjsContent);
fs.writeFileSync(path.join(backendDir, 'index.cjs'), rootCjsContent);
fs.writeFileSync(path.join(backendDir, 'index.mjs'), rootEsmContent);

fs.writeFileSync(path.join(backendDir, 'app.js'), rootCjsContent);
fs.writeFileSync(path.join(backendDir, 'app.cjs'), rootCjsContent);
fs.writeFileSync(path.join(backendDir, 'app.mjs'), rootEsmContent);

fs.writeFileSync(path.join(backendDir, 'server.js'), rootCjsContent);
fs.writeFileSync(path.join(backendDir, 'server.cjs'), rootCjsContent);
fs.writeFileSync(path.join(backendDir, 'server.mjs'), rootEsmContent);

console.log('Successfully prepared all Express entrypoints in backend and backend/dist');
