const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Generate CommonJS version (.cjs)
const cjsContent = `const path = require('path');
const express = require('express');

let createApp;
try {
  createApp = require('../../backend/dist/app').createApp;
} catch (e) {
  try {
    createApp = require('../backend/dist/app').createApp;
  } catch (e2) {
    try {
      createApp = require('./backend/dist/app').createApp;
    } catch (e3) {
      createApp = null;
    }
  }
}

const app = typeof createApp === 'function' ? createApp() : express();

app.use(express.static(__dirname));

app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
module.exports.default = app;
`;

// Generate ES Module version (.mjs and .js)
const esmContent = `import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let createApp;
try {
  createApp = require('../../backend/dist/app').createApp;
} catch (e) {
  try {
    createApp = require('../backend/dist/app').createApp;
  } catch (e2) {
    try {
      createApp = require('./backend/dist/app').createApp;
    } catch (e3) {
      createApp = null;
    }
  }
}

const app = typeof createApp === 'function' ? createApp() : express();

app.use(express.static(__dirname));

app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

export default app;
`;

// Write all entry point variations (.cjs, .mjs, .js)
fs.writeFileSync(path.join(distDir, 'index.cjs'), cjsContent);
fs.writeFileSync(path.join(distDir, 'app.cjs'), cjsContent);
fs.writeFileSync(path.join(distDir, 'server.cjs'), cjsContent);

fs.writeFileSync(path.join(distDir, 'index.mjs'), esmContent);
fs.writeFileSync(path.join(distDir, 'app.mjs'), esmContent);
fs.writeFileSync(path.join(distDir, 'server.mjs'), esmContent);

fs.writeFileSync(path.join(distDir, 'index.js'), esmContent);
fs.writeFileSync(path.join(distDir, 'app.js'), esmContent);
fs.writeFileSync(path.join(distDir, 'server.js'), esmContent);

console.log('Successfully generated all Express entry points in frontend/dist');
