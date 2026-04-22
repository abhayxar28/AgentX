import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI!,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
  jwtExpiresInAgent: process.env.JWT_EXPIRES_IN_AGENT || '1h',
  jwtExpiresInAdmin: process.env.JWT_EXPIRES_IN_ADMIN || '1h',
  jwtExpiresInUser: process.env.JWT_EXPIRES_IN_USER || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};
