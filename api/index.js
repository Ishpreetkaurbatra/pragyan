const { createApp } = require('../backend/dist/app');

// Initialize Express app instance
const app = createApp();

const handler = (req, res) => {
  // Ensure /api prefix is preserved for Express routes when routed via Vercel
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/health')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};

module.exports = handler;
module.exports.default = handler;
