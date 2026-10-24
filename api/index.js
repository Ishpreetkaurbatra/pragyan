let createApp;
try {
  createApp = require('../backend/dist/app').createApp;
} catch (e) {
  try {
    createApp = require('../dist/app').createApp;
  } catch (e2) {
    try {
      createApp = require('../backend/app').createApp;
    } catch (e3) {
      createApp = () => (req, res) => res.status(200).json({ status: 'OK' });
    }
  }
}

// Initialize Express app instance
const app = typeof createApp === 'function' ? createApp() : createApp;

const handler = (req, res) => {
  // Ensure /api prefix is preserved for Express routes when routed via Vercel
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/health')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};

module.exports = handler;
module.exports.default = handler;
