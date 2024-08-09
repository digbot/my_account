// config.js
import developmentConfig from './config.development';
import productionConfig from './config.production';

const config = process.env.NODE_ENV === 'production'
  ? productionConfig
  : developmentConfig;

export default config;