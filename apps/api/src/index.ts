import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { loadEnvConfig } from '@mawu/config';
import { programsPayload, programs } from './data/programs';

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

app.get('/programs', (_req, res) => {
  res.json(programsPayload);
});

app.get('/programs/:slug', (req, res) => {
  const program = programs.find((entry) => entry.slug === req.params.slug);

  if (!program) {
    res.status(404).json({ error: 'Program not found' });
    return;
  }

  res.json(program);
});

app.listen(env.API_PORT, () => {
  logger.info(`API running on port ${env.API_PORT}`);
});
