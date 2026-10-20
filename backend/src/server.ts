import { createApp } from './app';
import { config } from './config/env';

const app = createApp();

app.listen(config.port, () => {
  console.log(`
==============================================================
  T→G (Trend to Growth) — Business Intelligence API
==============================================================
  Port:              ${config.port}
  Environment:       ${config.env}
  Data Mode:         ${config.dataMode}
  Intelligence Mode: ${config.intelligenceMode}
  Version:           tgo-v1
  API Endpoint:      http://localhost:${config.port}/api
==============================================================
  `);
});
