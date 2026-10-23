import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.APP_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  webOrigin: process.env.WEB_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  dataMode: process.env.DATA_MODE || 'demo', // 'demo' | 'live'
  intelligenceMode: process.env.INTELLIGENCE_MODE || 'mock', // 'mock' | 'local' | 'tgo' | 'gemini' | 'external'
  jwtSecret: process.env.JWT_SECRET || 'tgo-secret-jwt-key-2025',
  demoMode: process.env.DEMO_MODE !== 'false',

  // Gemini AI configuration
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',

  // Connectors
  youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
  redditClientId: process.env.REDDIT_CLIENT_ID || '',
  redditClientSecret: process.env.REDDIT_CLIENT_SECRET || '',
  redditUserAgent: process.env.REDDIT_USER_AGENT || 'TrendToGrowthBot/1.0',
  googleTrendsProvider: process.env.GOOGLE_TRENDS_PROVIDER || 'mock',
  googleTrendsApiKey: process.env.GOOGLE_TRENDS_API_KEY || '',

  // Local AI runtime (Ollama)
  aiRuntime: process.env.AI_RUNTIME || 'ollama',
  aiBaseUrl: process.env.AI_BASE_URL || 'http://localhost:11434',
  aiModel: process.env.AI_MODEL || 'llama3.1:8b',
  aiVersion: process.env.AI_VERSION || '8b-instruct',

  // Future T→G dedicated model
  tgoAiBaseUrl: process.env.TGO_AI_BASE_URL || '',
  tgoAiApiKey: process.env.TGO_AI_API_KEY || '',
  tgoAiModel: process.env.TGO_AI_MODEL || 'tgo-growth-8b',
  tgoAiVersion: process.env.TGO_AI_VERSION || 'tgo-v1',

  logLevel: process.env.LOG_LEVEL || 'info',
};
