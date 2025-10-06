import * as dotenv from 'dotenv';
import { emailService, type OrderConfirmationData, type DonationReceiptData } from './email-service';

// Load environment variables
dotenv.config();

async function testEmailService() {
  console.log('Testing Gmail SMTP Email Service...\n');

  // Test connection first
  console.log('1. Testing email service connection...');
  const isConnected = await emailService.testConnection();
  
  if (!isConnected) {
    console.error('❌ Email service connection failed. Please check your EMAIL_USER and EMAIL_PASS environment variables.');
    process.exit(1);
  }
  
  console.log('✅ Email service connection successful!\n');

  // Test order confirmation email (if test email is provided)
  const testEmail = process.env.TEST_EMAIL;
  
  if (testEmail) {
    console.log('2. Testing order confirmation email...');
    
    const orderData: OrderConfirmationData = {
      customerName: 'Test Customer',
      customerEmail: testEmail,
      orderNumber: 'ORD-TEST-001',
      items: [
        {
          name: 'Mawu Foundation T-Shirt',
          quantity: 2,
          price: '$25.00',
          selectedVariations: {
            color: 'Green',
            size: 'Medium'
          }
        },
        {
          name: 'Foundation Tote Bag',
          quantity: 1,
          price: '$15.00'
        }
      ],
      totalAmount: '$65.00',
      shippingAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'TC',
        zipCode: '12345',
        country: 'United States'
      },
      orderDate: new Date().toLocaleDateString()
    };

    try {
      await emailService.sendOrderConfirmation(orderData);
      console.log('✅ Order confirmation email sent successfully!\n');
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
    }

    console.log('3. Testing donation receipt email...');
    
    const donationData: DonationReceiptData = {
      donorName: 'Test Donor',
      donorEmail: testEmail,
      amount: '100.00',
      currency: 'usd',
      donationDate: new Date().toLocaleDateString(),
      transactionId: 'pi_test_1234567890',
      anonymous: false,
      message: 'Keep up the great work!'
    };

    try {
      await emailService.sendDonationReceipt(donationData);
      console.log('✅ Donation receipt email sent successfully!\n');
    } catch (error) {
      console.error('❌ Failed to send donation receipt email:', error);
    }
  } else {
    console.log('2. Skipping email tests - no TEST_EMAIL environment variable provided');
    console.log('   To test email sending, add TEST_EMAIL=your-email@example.com to your .env file\n');
  }

  console.log('Email service testing completed!');
}

// Run the test
testEmailService().catch(console.error);