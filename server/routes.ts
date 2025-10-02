import express, { type Express, type Request, type Response } from 'express';
import { createServer, type Server } from 'http';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { storage } from './storage';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' })
  : null;

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.session.adminId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export function registerRoutes(app: Express): Server {
  
  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured' });
    }

    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(400).send('Webhook secret not configured');
    }

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { donationId, orderId, donorEmail, customerEmail, donorName, customerName } = paymentIntent.metadata;

        if (donationId) {
          await storage.updateDonationStatus(parseInt(donationId), 'completed', paymentIntent.id);
          
          if (resend && donorEmail) {
            await resend.emails.send({
              from: process.env.EMAIL_FROM || 'Mawu Foundation <noreply@mawufoundation.org>',
              to: donorEmail,
              subject: 'Thank you for your donation!',
              html: `
                <h1>Thank you, ${donorName}!</h1>
                <p>We received your donation of ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}.</p>
                <p>Your support helps us make a difference in communities across Africa.</p>
                <p>Best regards,<br>The Mawu Foundation Team</p>
              `,
            });
          }
        }

        if (orderId) {
          await storage.updateOrderStatus(parseInt(orderId), 'completed', paymentIntent.id);
          
          if (resend && customerEmail) {
            await resend.emails.send({
              from: process.env.EMAIL_FROM || 'Mawu Foundation <noreply@mawufoundation.org>',
              to: customerEmail,
              subject: 'Order Confirmation - Mawu Foundation',
              html: `
                <h1>Thank you for your order, ${customerName}!</h1>
                <p>Your order has been confirmed and will be processed soon.</p>
                <p>Order total: ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}</p>
                <p>Best regards,<br>The Mawu Foundation Team</p>
              `,
            });
          }
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  app.use(express.json());
  
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const admin = await storage.findAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await storage.verifyAdminPassword(admin, password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      req.session.adminId = admin.id;
      req.session.adminEmail = admin.email;

      const { password: _, ...adminData } = admin;
      res.json({ admin: adminData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/admin/me', requireAuth, async (req, res) => {
    try {
      const admin = await storage.findAdminByEmail(req.session.adminEmail!);
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      const { password: _, ...adminData } = admin;
      res.json({ admin: adminData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json({ products });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/products/:slug', async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/products', requireAuth, async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.json({ product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/products/:id', requireAuth, async (req, res) => {
    try {
      const product = await storage.updateProduct(parseInt(req.params.id), req.body);
      res.json({ product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/products/:id', requireAuth, async (req, res) => {
    try {
      await storage.deleteProduct(parseInt(req.params.id));
      res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/donations/create-payment-intent', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe is not configured' });
      }

      const { amount, currency, donorEmail, donorName, frequency, message, anonymous } = req.body;

      const donation = await storage.createDonation({
        donorEmail,
        donorName,
        amount: amount.toString(),
        currency: currency || 'USD',
        frequency: frequency || 'one-time',
        message,
        anonymous: anonymous || false,
        status: 'pending',
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100),
        currency: currency?.toLowerCase() || 'usd',
        metadata: {
          donationId: donation.id.toString(),
          donorEmail,
          donorName,
        },
      });

      await storage.updateDonationStatus(donation.id, 'processing', paymentIntent.id);

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        donationId: donation.id,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/orders/create-payment-intent', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe is not configured' });
      }

      const { items, customerEmail, customerName, shippingAddress, totalAmount, currency } = req.body;

      const order = await storage.createOrder({
        customerEmail,
        customerName,
        items,
        totalAmount: totalAmount.toString(),
        currency: currency || 'GHS',
        shippingAddress,
        status: 'pending',
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(totalAmount) * 100),
        currency: currency?.toLowerCase() || 'ghs',
        metadata: {
          orderId: order.id.toString(),
          customerEmail,
          customerName,
        },
      });

      await storage.updateOrderStatus(order.id, 'processing', paymentIntent.id);

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/orders', requireAuth, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json({ orders });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/donations', requireAuth, async (req, res) => {
    try {
      const donations = await storage.getAllDonations();
      res.json({ donations });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
