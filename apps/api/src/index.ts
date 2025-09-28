import cors from 'cors';
import express from 'express';
import pino from 'pino';
import { z } from 'zod';
import { loadEnvConfig } from '@mawu/config';
import { programsPayload, programs } from './data/programs';
import { transparencyResources } from './data/transparency';

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

const donationRequestSchema = z.object({
  amount: z.coerce.number().positive('Donation amount must be greater than zero.'),
  currency: z.string().min(1).default('GHS'),
  frequency: z.enum(['once', 'monthly']),
  focusArea: z.string().min(1, 'Select a focus area for your contribution.'),
  email: z.string().email('Provide a valid email so we can send receipts.')
});

const volunteerRequestSchema = z.object({
  name: z.string().min(2, 'Share your full name.'),
  email: z.string().email('A valid email helps us follow up.'),
  phone: z.string().optional(),
  region: z.string().min(1, 'Let us know where you are based.'),
  availability: z.string().min(1, 'Select your availability.'),
  interests: z.array(z.string().min(1)).min(1, 'Choose at least one impact interest.'),
  message: z.string().max(2000).optional()
});

const partnershipRequestSchema = z.object({
  contactName: z.string().min(2, 'Add the primary contact name.'),
  organisation: z.string().min(2, 'Organisation name is required.'),
  email: z.string().email('A valid email ensures we can respond promptly.'),
  phone: z.string().optional(),
  partnershipType: z.string().min(2, 'Select a collaboration track.'),
  message: z.string().max(4000).optional()
});

const formatZodError = (error: z.ZodError) =>
  error.issues.map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`).join('; ');

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

app.get('/transparency/resources', (_req, res) => {
  res.json(transparencyResources);
});

app.post('/donations/checkout', (req, res) => {
  const parsed = donationRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: formatZodError(parsed.error) });
    return;
  }

  const donation = parsed.data;
  logger.info('Received donation intent', {
    focusArea: donation.focusArea,
    frequency: donation.frequency,
    amount: donation.amount,
    currency: donation.currency
  });

  if (!env.STRIPE_SECRET_KEY) {
    res.status(202).json({
      status: 'pending',
      message:
        'Stripe is not configured in this environment. We have recorded your pledge and will email secure payment instructions shortly.'
    });
    return;
  }

  const fakeSessionId = Buffer.from(`${donation.email}-${Date.now()}`).toString('base64url');
  const checkoutUrl = `https://dashboard.stripe.com/test/checkout/sessions/${fakeSessionId}`;

  res.json({
    status: 'ready',
    checkoutUrl,
    message:
      'Redirecting you to a secure Stripe session. Please complete your gift to receive instant confirmation and receipts.'
  });
});

app.post('/engage/volunteer', (req, res) => {
  const parsed = volunteerRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: formatZodError(parsed.error) });
    return;
  }

  const submission = parsed.data;
  logger.info('Volunteer interest received', {
    name: submission.name,
    email: submission.email,
    region: submission.region,
    availability: submission.availability,
    interests: submission.interests
  });

  res.json({
    message: 'Medasi! Our mobilisation team will reach out within 48 hours to align your skills with community needs.'
  });
});

app.post('/engage/partnership', (req, res) => {
  const parsed = partnershipRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: formatZodError(parsed.error) });
    return;
  }

  const submission = parsed.data;
  logger.info('Partnership enquiry received', {
    contactName: submission.contactName,
    organisation: submission.organisation,
    partnershipType: submission.partnershipType
  });

  res.json({
    message: 'Thank you for partnering with us. Expect a discovery call invitation within two business days.'
  });
});

app.listen(env.API_PORT, () => {
  logger.info(`API running on port ${env.API_PORT}`);
});
