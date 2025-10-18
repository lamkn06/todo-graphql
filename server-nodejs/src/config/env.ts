import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? '',
};
