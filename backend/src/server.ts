import mongoose from 'mongoose';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

type MongoSrvDnsError = NodeJS.ErrnoException & {
  hostname?: string;
};

async function connectMongoWithFallback() {
  try {
    await mongoose.connect(env.mongoUri);
    return;
  } catch (err) {
    const error = err as MongoSrvDnsError;
    const fallbackUri = env.mongoUriFallback;
    const shouldUseFallback =
      env.nodeEnv !== 'production' &&
      !!fallbackUri &&
      error.code === 'ECONNREFUSED' &&
      typeof error.hostname === 'string' &&
      error.hostname.startsWith('_mongodb._tcp.');

    if (!shouldUseFallback) {
      throw err;
    }

    logger.warn(
      'Primary MongoDB SRV lookup failed in development. Retrying with MONGODB_URI_FALLBACK.'
    );
    await mongoose.connect(fallbackUri);
  }
}

connectMongoWithFallback()
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(env.port, () => logger.info(`Server running on port ${env.port}`));
  })
  .catch((err) => {
    logger.error('Failed to start server:', err);
    process.exit(1);
  });