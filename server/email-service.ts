import { createTransport, type Transporter } from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface OrderConfirmationData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
    selectedVariations?: Record<string, string>;
  }>;
  totalAmount: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderDate: string;
}

interface DonationReceiptData {
  donorName: string;
  donorEmail: string;
  amount: string;
  currency: string;
  donationDate: string;
  transactionId: string;
  anonymous: boolean;
  message?: string;
}

interface OrderStatusUpdateData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface AdminNotificationData {
  type: 'new_order' | 'new_donation';
  orderNumber?: string;
  customerName?: string;
  donorName?: string;
  amount: string;
  currency: string;
  date: string;
  adminEmail: string;
}

class EmailService {
  private transporter: Transporter;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 second base delay

  constructor() {
    this.transporter = this.createTransporter();
  }

  private createTransporter(): Transporter {
    const config: EmailConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '', // App-specific password
      },
    };

    return createTransport(config);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async sendEmailWithRetry(
    to: string,
    subject: string,
    html: string,
    text: string,
    retryCount: number = 0
  ): Promise<void> {
    try {
      const mailOptions = {
        from: {
          name: 'Mawu Foundation',
          address: process.env.EMAIL_USER || 'noreply@mawufoundation.org',
        },
        to,
        subject,
        html,
        text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error(`Email send attempt ${retryCount + 1} failed:`, error);
      
      if (retryCount < this.maxRetries) {
        const delayMs = this.retryDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Retrying email send in ${delayMs}ms...`);
        await this.delay(delayMs);
        return this.sendEmailWithRetry(to, subject, html, text, retryCount + 1);
      } else {
        throw new Error(`Failed to send email after ${this.maxRetries + 1} attempts: ${error}`);
      }
    }
  }

  private generateOrderConfirmationTemplate(data: OrderConfirmationData): EmailTemplate {
    const itemsHtml = data.items.map(item => {
      const variationsText = item.selectedVariations 
        ? Object.entries(item.selectedVariations)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')
        : '';
      
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            ${item.name}
            ${variationsText ? `<br><small style="color: #666;">${variationsText}</small>` : ''}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price}</td>
        </tr>
      `;
    }).join('');

    const itemsText = data.items.map(item => {
      const variationsText = item.selectedVariations 
        ? ' (' + Object.entries(item.selectedVariations)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ') + ')'
        : '';
      
      return `${item.name}${variationsText} - Qty: ${item.quantity} - ${item.price}`;
    }).join('\n');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - Mawu Foundation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c5530; margin-bottom: 10px;">Mawu Foundation</h1>
            <h2 style="color: #666; margin-top: 0;">Order Confirmation</h2>
          </div>
          
          <p>Dear ${data.customerName},</p>
          
          <p>Thank you for your order! We're excited to send you these items that support our mission in Ghana's Volta Region and pan-African initiatives.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c5530;">Order Details</h3>
            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p><strong>Order Date:</strong> ${data.orderDate}</p>
          </div>
          
          <h3 style="color: #2c5530;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-bottom: 20px;">
            <p style="font-size: 18px; font-weight: bold; color: #2c5530;">Total: ${data.totalAmount}</p>
          </div>
          
          <h3 style="color: #2c5530;">Shipping Address</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0;">
              ${data.shippingAddress.street}<br>
              ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br>
              ${data.shippingAddress.country}
            </p>
          </div>
          
          <p>We'll send you a shipping confirmation with tracking information once your order is on its way.</p>
          
          <p>Thank you for supporting the Mawu Foundation's work in creating positive change across Africa!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
            <p>Mawu Foundation<br>
            Supporting development in Ghana's Volta Region and pan-African initiatives</p>
          </div>
        </body>
      </html>
    `;

    const text = `
Mawu Foundation - Order Confirmation

Dear ${data.customerName},

Thank you for your order! We're excited to send you these items that support our mission in Ghana's Volta Region and pan-African initiatives.

Order Details:
Order Number: ${data.orderNumber}
Order Date: ${data.orderDate}

Items Ordered:
${itemsText}

Total: ${data.totalAmount}

Shipping Address:
${data.shippingAddress.street}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
${data.shippingAddress.country}

We'll send you a shipping confirmation with tracking information once your order is on its way.

Thank you for supporting the Mawu Foundation's work in creating positive change across Africa!

---
Mawu Foundation
Supporting development in Ghana's Volta Region and pan-African initiatives
    `;

    return {
      subject: `Order Confirmation - ${data.orderNumber}`,
      html,
      text,
    };
  }

  private generateDonationReceiptTemplate(data: DonationReceiptData): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Donation Receipt - Mawu Foundation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c5530; margin-bottom: 10px;">Mawu Foundation</h1>
            <h2 style="color: #666; margin-top: 0;">Donation Receipt</h2>
          </div>
          
          <p>Dear ${data.anonymous ? 'Anonymous Donor' : data.donorName},</p>
          
          <p>Thank you for your generous donation to the Mawu Foundation! Your support directly impacts our development work in Ghana's Volta Region and our pan-African initiatives.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c5530;">Donation Details</h3>
            <p><strong>Amount:</strong> ${data.amount} ${data.currency.toUpperCase()}</p>
            <p><strong>Date:</strong> ${data.donationDate}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            ${data.message ? `<p><strong>Message:</strong> "${data.message}"</p>` : ''}
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2c5530;">
            <p style="margin: 0; font-weight: bold;">Tax Receipt Information</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              This receipt serves as confirmation of your tax-deductible donation to the Mawu Foundation. 
              Please retain this receipt for your tax records. Consult your tax advisor for specific deduction eligibility.
            </p>
          </div>
          
          <h3 style="color: #2c5530;">Your Impact</h3>
          <p>Your donation helps us continue our vital work in:</p>
          <ul style="color: #555;">
            <li>Education programs in Ghana's Volta Region</li>
            <li>Health and wellness initiatives</li>
            <li>Water and sanitation projects</li>
            <li>Economic empowerment programs</li>
            <li>Community development initiatives</li>
          </ul>
          
          <p>We are deeply grateful for your trust in our mission and your commitment to creating positive change across Africa.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
            <p>Mawu Foundation<br>
            Supporting development in Ghana's Volta Region and pan-African initiatives<br>
            <a href="mailto:info@mawufoundation.org" style="color: #2c5530;">info@mawufoundation.org</a></p>
          </div>
        </body>
      </html>
    `;

    const text = `
Mawu Foundation - Donation Receipt

Dear ${data.anonymous ? 'Anonymous Donor' : data.donorName},

Thank you for your generous donation to the Mawu Foundation! Your support directly impacts our development work in Ghana's Volta Region and our pan-African initiatives.

Donation Details:
Amount: ${data.amount} ${data.currency.toUpperCase()}
Date: ${data.donationDate}
Transaction ID: ${data.transactionId}
${data.message ? `Message: "${data.message}"` : ''}

Tax Receipt Information:
This receipt serves as confirmation of your tax-deductible donation to the Mawu Foundation. Please retain this receipt for your tax records. Consult your tax advisor for specific deduction eligibility.

Your Impact:
Your donation helps us continue our vital work in:
- Education programs in Ghana's Volta Region
- Health and wellness initiatives
- Water and sanitation projects
- Economic empowerment programs
- Community development initiatives

We are deeply grateful for your trust in our mission and your commitment to creating positive change across Africa.

---
Mawu Foundation
Supporting development in Ghana's Volta Region and pan-African initiatives
info@mawufoundation.org
    `;

    return {
      subject: `Donation Receipt - ${data.amount} ${data.currency.toUpperCase()}`,
      html,
      text,
    };
  }

  async sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
    try {
      const template = this.generateOrderConfirmationTemplate(data);
      await this.sendEmailWithRetry(
        data.customerEmail,
        template.subject,
        template.html,
        template.text
      );
      console.log(`Order confirmation sent to ${data.customerEmail} for order ${data.orderNumber}`);
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
      throw error;
    }
  }

  async sendDonationReceipt(data: DonationReceiptData): Promise<void> {
    try {
      const template = this.generateDonationReceiptTemplate(data);
      await this.sendEmailWithRetry(
        data.donorEmail,
        template.subject,
        template.html,
        template.text
      );
      console.log(`Donation receipt sent to ${data.donorEmail} for ${data.amount} ${data.currency}`);
    } catch (error) {
      console.error('Failed to send donation receipt:', error);
      throw error;
    }
  }

  private generateOrderStatusUpdateTemplate(data: OrderStatusUpdateData): EmailTemplate {
    const statusMessages = {
      processing: 'Your order is being prepared for shipment.',
      shipped: 'Your order has been shipped and is on its way to you!',
      delivered: 'Your order has been delivered. Thank you for your support!',
      cancelled: 'Your order has been cancelled. If you have any questions, please contact us.',
    };

    const statusMessage = statusMessages[data.status as keyof typeof statusMessages] || 
      `Your order status has been updated to: ${data.status}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Update - Mawu Foundation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c5530; margin-bottom: 10px;">Mawu Foundation</h1>
            <h2 style="color: #666; margin-top: 0;">Order Status Update</h2>
          </div>
          
          <p>Dear ${data.customerName},</p>
          
          <p>We have an update on your order <strong>${data.orderNumber}</strong>.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c5530;">Status: ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}</h3>
            <p style="margin-bottom: 0;">${statusMessage}</p>
          </div>
          
          ${data.trackingNumber ? `
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2c5530;">
              <p style="margin: 0; font-weight: bold;">Tracking Information</p>
              <p style="margin: 5px 0 0 0;">Tracking Number: <strong>${data.trackingNumber}</strong></p>
              ${data.estimatedDelivery ? `<p style="margin: 5px 0 0 0;">Estimated Delivery: <strong>${data.estimatedDelivery}</strong></p>` : ''}
            </div>
          ` : ''}
          
          <p>Thank you for supporting the Mawu Foundation's mission to create positive change across Africa!</p>
          
          <p>If you have any questions about your order, please don't hesitate to contact us.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
            <p>Mawu Foundation<br>
            Supporting development in Ghana's Volta Region and pan-African initiatives<br>
            <a href="mailto:info@mawufoundation.org" style="color: #2c5530;">info@mawufoundation.org</a></p>
          </div>
        </body>
      </html>
    `;

    const text = `
Mawu Foundation - Order Status Update

Dear ${data.customerName},

We have an update on your order ${data.orderNumber}.

Status: ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}
${statusMessage}

${data.trackingNumber ? `
Tracking Information:
Tracking Number: ${data.trackingNumber}
${data.estimatedDelivery ? `Estimated Delivery: ${data.estimatedDelivery}` : ''}
` : ''}

Thank you for supporting the Mawu Foundation's mission to create positive change across Africa!

If you have any questions about your order, please don't hesitate to contact us.

---
Mawu Foundation
Supporting development in Ghana's Volta Region and pan-African initiatives
info@mawufoundation.org
    `;

    return {
      subject: `Order Update - ${data.orderNumber} (${data.status.charAt(0).toUpperCase() + data.status.slice(1)})`,
      html,
      text,
    };
  }

  private generateAdminNotificationTemplate(data: AdminNotificationData): EmailTemplate {
    if (data.type === 'new_order') {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Order Notification - Mawu Foundation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c5530; margin-bottom: 10px;">Mawu Foundation</h1>
              <h2 style="color: #666; margin-top: 0;">New Order Received</h2>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2c5530;">Order Details</h3>
              <p><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p><strong>Customer:</strong> ${data.customerName}</p>
              <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
              <p><strong>Date:</strong> ${data.date}</p>
            </div>
            
            <p>A new order has been placed on the Mawu Foundation website. Please review and process the order in the admin dashboard.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://mawufoundation.org'}/admin/orders" 
                 style="background-color: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Order in Admin Dashboard
              </a>
            </div>
          </body>
        </html>
      `;

      const text = `
Mawu Foundation - New Order Received

Order Details:
Order Number: ${data.orderNumber}
Customer: ${data.customerName}
Amount: ${data.amount} ${data.currency}
Date: ${data.date}

A new order has been placed on the Mawu Foundation website. Please review and process the order in the admin dashboard.

View Order: ${process.env.FRONTEND_URL || 'https://mawufoundation.org'}/admin/orders
      `;

      return {
        subject: `New Order: ${data.orderNumber} - ${data.amount} ${data.currency}`,
        html,
        text,
      };
    } else {
      // new_donation
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Donation Notification - Mawu Foundation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c5530; margin-bottom: 10px;">Mawu Foundation</h1>
              <h2 style="color: #666; margin-top: 0;">New Donation Received</h2>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2c5530;">
              <h3 style="margin-top: 0; color: #2c5530;">Donation Details</h3>
              <p><strong>Donor:</strong> ${data.donorName}</p>
              <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
              <p><strong>Date:</strong> ${data.date}</p>
            </div>
            
            <p>A new donation has been received! This generous contribution will help support our development work in Ghana's Volta Region and pan-African initiatives.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://mawufoundation.org'}/admin/donations" 
                 style="background-color: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Donation in Admin Dashboard
              </a>
            </div>
          </body>
        </html>
      `;

      const text = `
Mawu Foundation - New Donation Received

Donation Details:
Donor: ${data.donorName}
Amount: ${data.amount} ${data.currency}
Date: ${data.date}

A new donation has been received! This generous contribution will help support our development work in Ghana's Volta Region and pan-African initiatives.

View Donation: ${process.env.FRONTEND_URL || 'https://mawufoundation.org'}/admin/donations
      `;

      return {
        subject: `New Donation: ${data.amount} ${data.currency} from ${data.donorName}`,
        html,
        text,
      };
    }
  }

  async sendOrderStatusUpdate(data: OrderStatusUpdateData): Promise<void> {
    try {
      const template = this.generateOrderStatusUpdateTemplate(data);
      await this.sendEmailWithRetry(
        data.customerEmail,
        template.subject,
        template.html,
        template.text
      );
      console.log(`Order status update sent to ${data.customerEmail} for order ${data.orderNumber}`);
    } catch (error) {
      console.error('Failed to send order status update:', error);
      throw error;
    }
  }

  async sendAdminNotification(data: AdminNotificationData): Promise<void> {
    try {
      const template = this.generateAdminNotificationTemplate(data);
      await this.sendEmailWithRetry(
        data.adminEmail,
        template.subject,
        template.html,
        template.text
      );
      console.log(`Admin notification sent to ${data.adminEmail} for ${data.type}`);
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }

  async sendTestEmail(recipientEmail: string): Promise<void> {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Email Service Test - Mawu Foundation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c5530; margin-bottom: 10px;">Mawu Foundation</h1>
              <h2 style="color: #666; margin-top: 0;">Email Service Test</h2>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2c5530;">
              <p style="margin: 0; font-weight: bold;">✅ Email Service Working!</p>
              <p style="margin: 5px 0 0 0;">This test email confirms that the Mawu Foundation email service is properly configured and functioning.</p>
            </div>
            
            <p>Test Details:</p>
            <ul>
              <li><strong>Service:</strong> Gmail SMTP</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>Status:</strong> Successfully delivered</li>
            </ul>
            
            <p>All email notifications for orders, donations, and admin alerts should now work correctly.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
              <p>Mawu Foundation Email Service<br>
              Supporting development in Ghana's Volta Region and pan-African initiatives</p>
            </div>
          </body>
        </html>
      `;

      const text = `
Mawu Foundation - Email Service Test

✅ Email Service Working!

This test email confirms that the Mawu Foundation email service is properly configured and functioning.

Test Details:
- Service: Gmail SMTP
- Time: ${new Date().toLocaleString()}
- Status: Successfully delivered

All email notifications for orders, donations, and admin alerts should now work correctly.

---
Mawu Foundation Email Service
Supporting development in Ghana's Volta Region and pan-African initiatives
      `;

      await this.sendEmailWithRetry(
        recipientEmail,
        'Email Service Test - Mawu Foundation',
        html,
        text
      );
      console.log(`Test email sent successfully to ${recipientEmail}`);
    } catch (error) {
      console.error('Failed to send test email:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export types for use in other modules
export type { OrderConfirmationData, DonationReceiptData, OrderStatusUpdateData, AdminNotificationData };