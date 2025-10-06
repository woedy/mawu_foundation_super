import express, { type Express, type Request, type Response } from 'express';
import { createServer, type Server } from 'http';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { eq } from 'drizzle-orm';
import { storage, db } from './storage-factory';
import { emailService, type OrderStatusUpdateData, type AdminNotificationData } from './email-service';
import * as schema from '../shared/schema';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-09-30.clover' })
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
  
  // Stripe webhook endpoint - must be before express.json() middleware
  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) {
      console.error('[Webhook] Stripe is not configured');
      return res.status(500).json({ error: 'Stripe is not configured' });
    }

    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('[Webhook] Webhook secret not configured');
      return res.status(400).send('Webhook secret not configured');
    }

    if (!sig) {
      console.error('[Webhook] Missing stripe-signature header');
      return res.status(400).send('Missing stripe-signature header');
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.log(`[Webhook] Received event: ${event.type} (ID: ${event.id})`);
    } catch (error: any) {
      console.error('[Webhook] Signature verification failed:', error.message);
      return res.status(400).send(`Webhook signature verification failed: ${error.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.canceled':
          await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
          break;

        case 'charge.refunded':
          await handleChargeRefunded(event.data.object as Stripe.Charge);
          break;

        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      res.json({ received: true, eventType: event.type });
    } catch (error: any) {
      console.error(`[Webhook] Error processing event ${event.type}:`, error);
      // Return 500 to tell Stripe to retry the webhook
      res.status(500).json({ 
        error: 'Webhook processing failed', 
        details: error.message,
        eventType: event.type 
      });
    }
  });

  // Webhook handler functions
  async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.log(`[Webhook] Processing payment_intent.succeeded: ${paymentIntent.id}`);
    
    const { donationId, orderId, donorEmail, customerEmail, donorName, customerName } = paymentIntent.metadata;

    // Handle donation payment
    if (donationId) {
      try {
        const donation = await storage.getDonationById(parseInt(donationId));
        
        if (!donation) {
          console.error(`[Webhook] Donation not found: ${donationId}`);
          return;
        }

        console.log(`[Webhook] Updating donation ${donationId} to completed`);
        await storage.updateDonationStatus(parseInt(donationId), 'completed', paymentIntent.id);
        
        if (donorEmail) {
          try {
            console.log(`[Webhook] Sending donation receipt to ${donorEmail}`);
            
            // Send donation receipt to donor
            await emailService.sendDonationReceipt({
              donorName: donorName || 'Valued Donor',
              donorEmail,
              amount: (paymentIntent.amount / 100).toFixed(2),
              currency: paymentIntent.currency.toUpperCase(),
              donationDate: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }),
              transactionId: paymentIntent.id,
              anonymous: donation.anonymous,
              message: donation.message || undefined,
            });

            // Send admin notification for new donation
            const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
            if (adminEmail) {
              console.log(`[Webhook] Sending admin notification for donation ${donationId}`);
              await emailService.sendAdminNotification({
                type: 'new_donation',
                donorName: donation.anonymous ? 'Anonymous Donor' : (donorName || 'Valued Donor'),
                amount: (paymentIntent.amount / 100).toFixed(2),
                currency: paymentIntent.currency.toUpperCase(),
                date: new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }),
                adminEmail,
              });
            }
            
            console.log(`[Webhook] Successfully sent donation emails for ${donationId}`);
          } catch (error) {
            console.error(`[Webhook] Failed to send donation emails for ${donationId}:`, error);
            // Don't throw - we still want to mark the donation as completed
          }
        }
      } catch (error) {
        console.error(`[Webhook] Error processing donation ${donationId}:`, error);
        throw error; // Re-throw to trigger webhook retry
      }
    }

    // Handle order payment
    if (orderId) {
      try {
        const order = await storage.getOrderById(parseInt(orderId));
        
        if (!order) {
          console.error(`[Webhook] Order not found: ${orderId}`);
          return;
        }

        console.log(`[Webhook] Processing order ${orderId}`);
        
        // Extract customer info from payment intent
        const billingDetails = (paymentIntent as any).charges?.data?.[0]?.billing_details;
        const finalCustomerEmail = billingDetails?.email || customerEmail || order?.customerEmail;
        const finalCustomerName = billingDetails?.name || customerName || order?.customerName;
        const finalShippingAddress = billingDetails?.address ? {
          line1: billingDetails.address.line1 || '',
          line2: billingDetails.address.line2 || undefined,
          city: billingDetails.address.city || '',
          state: billingDetails.address.state || undefined,
          postalCode: billingDetails.address.postal_code || undefined,
          country: billingDetails.address.country || 'GH',
        } : order?.shippingAddress;

        // Update order with final customer information
        if (finalCustomerEmail !== order.customerEmail || finalCustomerName !== order.customerName) {
          console.log(`[Webhook] Updating order ${orderId} customer information`);
          await db.update(schema.orders)
            .set({
              customerEmail: finalCustomerEmail,
              customerName: finalCustomerName,
              shippingAddress: finalShippingAddress,
              updatedAt: new Date(),
            })
            .where(eq(schema.orders.id, parseInt(orderId)));
        }

        console.log(`[Webhook] Updating order ${orderId} to completed`);
        await storage.updateOrderStatus(parseInt(orderId), 'completed', paymentIntent.id);
        
        if (finalCustomerEmail) {
          try {
            const orderNumber = `MF-${order.id.toString().padStart(8, '0')}`;
            console.log(`[Webhook] Sending order confirmation for ${orderNumber} to ${finalCustomerEmail}`);
            
            // Send order confirmation to customer
            await emailService.sendOrderConfirmation({
              customerName: finalCustomerName || 'Valued Customer',
              customerEmail: finalCustomerEmail,
              orderNumber,
              items: order.items.map(item => ({
                name: item.productName,
                quantity: item.quantity,
                price: `${order.currency} ${parseFloat(item.price).toFixed(2)}`,
                selectedVariations: item.selectedVariations,
              })),
              totalAmount: `${order.currency} ${parseFloat(order.totalAmount).toFixed(2)}`,
              shippingAddress: {
                street: finalShippingAddress?.line1 || '',
                city: finalShippingAddress?.city || '',
                state: finalShippingAddress?.state || '',
                zipCode: finalShippingAddress?.postalCode || '',
                country: finalShippingAddress?.country || '',
              },
              orderDate: new Date(order.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }),
            });

            // Send admin notification for new order
            const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
            if (adminEmail) {
              console.log(`[Webhook] Sending admin notification for order ${orderNumber}`);
              await emailService.sendAdminNotification({
                type: 'new_order',
                orderNumber,
                customerName: finalCustomerName || 'Valued Customer',
                amount: parseFloat(order.totalAmount).toFixed(2),
                currency: order.currency,
                date: new Date(order.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }),
                adminEmail,
              });
            }
            
            console.log(`[Webhook] Successfully sent order emails for ${orderNumber}`);
          } catch (error) {
            console.error(`[Webhook] Failed to send order emails for ${orderId}:`, error);
            // Don't throw - we still want to mark the order as completed
          }
        }
      } catch (error) {
        console.error(`[Webhook] Error processing order ${orderId}:`, error);
        throw error; // Re-throw to trigger webhook retry
      }
    }
  }

  async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    console.log(`[Webhook] Processing payment_intent.payment_failed: ${paymentIntent.id}`);
    
    const { donationId, orderId } = paymentIntent.metadata;

    if (donationId) {
      try {
        console.log(`[Webhook] Updating donation ${donationId} to failed`);
        await storage.updateDonationStatus(parseInt(donationId), 'failed', paymentIntent.id);
      } catch (error) {
        console.error(`[Webhook] Error updating donation ${donationId} to failed:`, error);
        throw error;
      }
    }

    if (orderId) {
      try {
        console.log(`[Webhook] Updating order ${orderId} to cancelled (payment failed)`);
        await storage.updateOrderStatus(parseInt(orderId), 'cancelled', paymentIntent.id);
      } catch (error) {
        console.error(`[Webhook] Error updating order ${orderId} to cancelled:`, error);
        throw error;
      }
    }
  }

  async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
    console.log(`[Webhook] Processing payment_intent.canceled: ${paymentIntent.id}`);
    
    const { donationId, orderId } = paymentIntent.metadata;

    if (donationId) {
      try {
        console.log(`[Webhook] Updating donation ${donationId} to failed (canceled)`);
        await storage.updateDonationStatus(parseInt(donationId), 'failed', paymentIntent.id);
      } catch (error) {
        console.error(`[Webhook] Error updating donation ${donationId}:`, error);
        throw error;
      }
    }

    if (orderId) {
      try {
        console.log(`[Webhook] Updating order ${orderId} to cancelled`);
        await storage.updateOrderStatus(parseInt(orderId), 'cancelled', paymentIntent.id);
      } catch (error) {
        console.error(`[Webhook] Error updating order ${orderId}:`, error);
        throw error;
      }
    }
  }

  async function handleChargeRefunded(charge: Stripe.Charge) {
    console.log(`[Webhook] Processing charge.refunded: ${charge.id}`);
    
    const paymentIntentId = charge.payment_intent as string;
    
    if (!paymentIntentId) {
      console.log(`[Webhook] No payment intent associated with charge ${charge.id}`);
      return;
    }

    try {
      // Find orders or donations with this payment intent
      const orders = await storage.getAllOrders();
      const donations = await storage.getAllDonations();
      
      const refundedOrder = orders.find(o => o.stripePaymentIntentId === paymentIntentId);
      const refundedDonation = donations.find(d => d.stripePaymentIntentId === paymentIntentId);

      if (refundedOrder) {
        console.log(`[Webhook] Updating order ${refundedOrder.id} to cancelled (refunded)`);
        await storage.updateOrderStatus(refundedOrder.id, 'cancelled', paymentIntentId);
      }

      if (refundedDonation) {
        console.log(`[Webhook] Updating donation ${refundedDonation.id} to failed (refunded)`);
        await storage.updateDonationStatus(refundedDonation.id, 'failed', paymentIntentId);
      }
    } catch (error) {
      console.error(`[Webhook] Error processing refund for charge ${charge.id}:`, error);
      throw error;
    }
  }

  app.use(express.json());
  
  // Health check endpoint for monitoring
  app.get('/api/health', async (req, res) => {
    try {
      // Check database connection
      await db.select().from(schema.products).limit(1);
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: 'connected',
          stripe: stripe ? 'configured' : 'not configured',
          email: emailService ? 'configured' : 'not configured'
        }
      });
    } catch (error) {
      console.error('[Health Check] Error:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Service unavailable'
      });
    }
  });
  
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

      // Validate required fields
      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: 'Invalid donation amount' });
      }

      if (!donorEmail || !donorEmail.includes('@')) {
        return res.status(400).json({ error: 'Valid email address is required' });
      }

      if (!donorName || donorName.trim().length === 0) {
        return res.status(400).json({ error: 'Donor name is required' });
      }

      // Validate frequency
      const validFrequencies = ['one-time', 'monthly', 'quarterly', 'annually'];
      const donationFrequency = frequency || 'one-time';
      if (!validFrequencies.includes(donationFrequency)) {
        return res.status(400).json({ error: 'Invalid donation frequency' });
      }

      // Validate currency
      const donationCurrency = (currency || 'GHS').toUpperCase();
      const validCurrencies = ['GHS', 'USD', 'EUR', 'GBP'];
      if (!validCurrencies.includes(donationCurrency)) {
        return res.status(400).json({ error: 'Invalid currency' });
      }

      const donationAmount = parseFloat(amount);

      const donation = await storage.createDonation({
        donorEmail: donorEmail.trim(),
        donorName: donorName.trim(),
        amount: donationAmount.toFixed(2),
        currency: donationCurrency,
        frequency: donationFrequency,
        message: message?.trim() || null,
        anonymous: anonymous || false,
        status: 'pending',
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(donationAmount * 100),
        currency: donationCurrency.toLowerCase(),
        metadata: {
          donationId: donation.id.toString(),
          donorEmail: donorEmail.trim(),
          donorName: donorName.trim(),
        },
        description: `Donation to Mawu Foundation - ${donationFrequency}`,
      });

      await storage.updateDonationStatus(donation.id, 'processing', paymentIntent.id);

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        donationId: donation.id,
      });
    } catch (error: any) {
      console.error('Donation creation error:', error);
      res.status(500).json({ error: error.message || 'Failed to create donation' });
    }
  });

  app.post('/api/orders/create-payment-intent', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe is not configured' });
      }

      const { items, customerEmail, customerName, shippingAddress, totalAmount, currency } = req.body;

      // Validate required fields
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }

      if (!totalAmount || parseFloat(totalAmount) <= 0) {
        return res.status(400).json({ error: 'Invalid order amount' });
      }

      // Validate order items and their variations
      await storage.validateOrderItems(items);

      // Create order with initial data (customer info will be updated on payment)
      const order = await storage.createOrder({
        customerEmail: customerEmail || 'pending@checkout.com',
        customerName: customerName || 'Pending Customer',
        items,
        totalAmount: totalAmount.toString(),
        currency: currency || 'GHS',
        shippingAddress: shippingAddress || {},
        status: 'pending',
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(totalAmount) * 100),
        currency: currency?.toLowerCase() || 'ghs',
        metadata: {
          orderId: order.id.toString(),
          customerEmail: customerEmail || '',
          customerName: customerName || '',
        },
        description: `Order #MF-${order.id.toString().padStart(8, '0')}`,
      });

      await storage.updateOrderStatus(order.id, 'processing', paymentIntent.id);

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      });
    } catch (error: any) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: error.message || 'Failed to create order' });
    }
  });

  app.put('/api/orders/:id/customer-info', async (req, res) => {
    try {
      const { customerEmail, customerName, shippingAddress } = req.body;
      const orderId = parseInt(req.params.id);

      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Update order with customer information
      const [updatedOrder] = await db.update(schema.orders)
        .set({
          customerEmail,
          customerName,
          shippingAddress,
          updatedAt: new Date(),
        })
        .where(eq(schema.orders.id, orderId))
        .returning();

      res.json({ order: updatedOrder });
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

  app.post('/api/admin/test-email', requireAuth, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email address is required' });
      }

      // Test email service connection first
      const connectionTest = await emailService.testConnection();
      if (!connectionTest) {
        return res.status(500).json({ error: 'Email service connection failed' });
      }

      // Send test email
      await emailService.sendTestEmail(email);
      
      res.json({ 
        message: 'Test email sent successfully',
        recipient: email,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Test email failed:', error);
      res.status(500).json({ 
        error: 'Failed to send test email',
        details: error.message 
      });
    }
  });

  app.put('/api/admin/orders/:id', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status, trackingNumber, estimatedDelivery } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'shipped', 'delivered'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      // Get the current order to check if status is actually changing
      const currentOrder = await storage.getOrderById(orderId);
      if (!currentOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const order = await storage.updateOrderStatus(orderId, status);
      
      // Send status update email if status changed and customer email exists
      if (currentOrder.status !== status && currentOrder.customerEmail && 
          ['processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        try {
          const orderNumber = `MF-${currentOrder.id.toString().padStart(8, '0')}`;
          
          await emailService.sendOrderStatusUpdate({
            customerName: currentOrder.customerName,
            customerEmail: currentOrder.customerEmail,
            orderNumber,
            status,
            trackingNumber: trackingNumber || undefined,
            estimatedDelivery: estimatedDelivery || undefined,
          });
        } catch (error) {
          console.error('Failed to send order status update email:', error);
          // Don't fail the status update if email fails
        }
      }

      res.json({ order });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
