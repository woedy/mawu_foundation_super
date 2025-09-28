import express from 'express';
import cors from 'cors';
import { loadEnvConfig, AppEnv } from '@mawu/config';
import { programs } from './data/programs';
import { logger } from './utils/logger';
import { paymentRoutes } from './services/payment/payment.routes';
import { initializePaymentService } from './services/payment/payment.service';

// Load environment variables
const env = loadEnvConfig({
  cwd: process.cwd(),
  mode: process.env.NODE_ENV,
});

const app = express();

// Initialize services
initializePaymentService(env);

// Middleware
app.use(cors());
app.use(express.json({
  verify: (req: any, _res, buf) => {
    // Store the raw body for webhook signature verification
    if (req.originalUrl.startsWith('/api/payments/webhook')) {
      req.rawBody = buf.toString();
    }
  },
}));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      payment: env.STRIPE_SECRET_KEY ? 'enabled' : 'disabled',
    },
  });
});

// API Routes
app.use('/api/payments', paymentRoutes);

// Programs endpoints
app.get('/programs', (_req, res) => {
  res.json(programs);
});

app.get('/programs/:slug', (req, res) => {
  const program = programs.find((p) => p.slug === req.params.slug);
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }
  res.json(program);
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  });
});

// Start server
const server = app.listen(env.API_PORT, () => {
  logger.info(`API running on port ${env.API_PORT}`);
  
  if (!env.STRIPE_SECRET_KEY) {
    logger.warn('Stripe is not configured. Payment features will be disabled.');
  }
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
