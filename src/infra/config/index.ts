import * as dotenv from 'dotenv';

if (!process?.env?.NODE_ENV) {
  dotenv.config();
}

const dev = 'development';

export default {
  Environment: process.env.NODE_ENV || dev,
  server: {
    Root: process.env.SERVER_ROOT || '/api',
    Host: process.env.SERVER_HOST || 'localhost',
    Port: process.env.PORT || 5001,
    Origins: process.env.ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:3002',
  },
  params: {
    envs: {
      dev: 'development',
      staging: 'staging',
      production: 'production',
    },
  },
};
