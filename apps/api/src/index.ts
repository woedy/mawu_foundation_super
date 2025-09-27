import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { loadEnvConfig } from '@mawu/config';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

const env = loadEnvConfig({ cwd: process.cwd() });

const app = express();
app.use(cors({ origin: env.CLIENT_URL ?? true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: env.NODE_ENV,
    stripeConfigured: Boolean(env.STRIPE_SECRET_KEY)
  });
});

app.listen(env.API_PORT, () => {
  logger.info(`API running on port ${env.API_PORT}`);
});
