import dotenv from 'dotenv';
import { emailService } from './email-service';

dotenv.config();

/**
 * Comprehensive test script for email notification system
 * Tests all email types: order confirmations, donation receipts, status updates, and admin notifications
 */

async function testEmailNotifications() {
  console.log('🧪 Starting Email Notification System Tests\n');
  console.log('=' .repeat(60));

  // Test 1: Email Service Connection
  console.log('\n📧 Test 1: Email Service Connection');
  console.log('-'.repeat(60));
  try {
    const isConnected = await emailService.testConnection();
    if (isConnected) {
      console.log('✅ Email service connection successful');
      console.log(`   Using: ${process.env.EMAIL_USER}`);
    } else {
      console.log('❌ Email service connection failed');
      return;
    }
  } catch (error: any) {
    console.error('❌ Connection test failed:', error.message);
    return;
  }

  // Test 2: Order Confirmation Email
  console.log('\n📦 Test 2: Order Confirmation Email');
  console.log('-'.repeat(60));
  try {
    await emailService.sendOrderConfirmation({
      customerName: 'John Doe',
      customerEmail: process.env.TEST_EMAIL || process.env.EMAIL_USER || '',
      orderNumber: 'MF-00000001',
      items: [
        {
          name: 'Mawu Foundation T-Shirt',
          quantity: 2,
          price: 'GHS 150.00',
          selectedVariations: {
            color: 'Green',
            size: 'Large',
          },
        },
        {
          name: 'Volta Region Tote Bag',
          quantity: 1,
          price: 'GHS 75.00',
        },
      ],
      totalAmount: 'GHS 375.00',
      shippingAddress: {
        street: '123 Main Street',
        city: 'Accra',
        state: 'Greater Accra',
        zipCode: '00233',
        country: 'Ghana',
      },
      orderDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
    console.log('✅ Order confirmation email sent successfully');
  } catch (error: any) {
    console.error('❌ Order confirmation failed:', error.message);
  }

  // Test 3: Donation Receipt Email
  console.log('\n💝 Test 3: Donation Receipt Email');
  console.log('-'.repeat(60));
  try {
    await emailService.sendDonationReceipt({
      donorName: 'Jane Smith',
      donorEmail: process.env.TEST_EMAIL || process.env.EMAIL_USER || '',
      amount: '500.00',
      currency: 'USD',
      donationDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      transactionId: 'pi_test_1234567890',
      anonymous: false,
      message: 'Keep up the great work supporting education in Ghana!',
    });
    console.log('✅ Donation receipt email sent successfully');
  } catch (error: any) {
    console.error('❌ Donation receipt failed:', error.message);
  }

  // Test 4: Order Status Update Email (Shipped)
  console.log('\n📮 Test 4: Order Status Update Email (Shipped)');
  console.log('-'.repeat(60));
  try {
    await emailService.sendOrderStatusUpdate({
      customerName: 'John Doe',
      customerEmail: process.env.TEST_EMAIL || process.env.EMAIL_USER || '',
      orderNumber: 'MF-00000001',
      status: 'shipped',
      trackingNumber: 'TRK123456789',
      estimatedDelivery: 'March 15, 2025',
    });
    console.log('✅ Order status update email sent successfully');
  } catch (error: any) {
    console.error('❌ Order status update failed:', error.message);
  }

  // Test 5: Admin Notification - New Order
  console.log('\n🔔 Test 5: Admin Notification - New Order');
  console.log('-'.repeat(60));
  try {
    await emailService.sendAdminNotification({
      type: 'new_order',
      orderNumber: 'MF-00000001',
      customerName: 'John Doe',
      amount: '375.00',
      currency: 'GHS',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '',
    });
    console.log('✅ Admin order notification email sent successfully');
  } catch (error: any) {
    console.error('❌ Admin order notification failed:', error.message);
  }

  // Test 6: Admin Notification - New Donation
  console.log('\n🔔 Test 6: Admin Notification - New Donation');
  console.log('-'.repeat(60));
  try {
    await emailService.sendAdminNotification({
      type: 'new_donation',
      donorName: 'Jane Smith',
      amount: '500.00',
      currency: 'USD',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '',
    });
    console.log('✅ Admin donation notification email sent successfully');
  } catch (error: any) {
    console.error('❌ Admin donation notification failed:', error.message);
  }

  // Test 7: Test Email (Simple verification)
  console.log('\n✉️  Test 7: Simple Test Email');
  console.log('-'.repeat(60));
  try {
    await emailService.sendTestEmail(
      process.env.TEST_EMAIL || process.env.EMAIL_USER || ''
    );
    console.log('✅ Test email sent successfully');
  } catch (error: any) {
    console.error('❌ Test email failed:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ Email Notification System Tests Complete!');
  console.log('='.repeat(60));
  console.log('\n📝 Notes:');
  console.log('   - Check your inbox for all test emails');
  console.log('   - Verify email formatting and content');
  console.log('   - Check spam folder if emails are missing');
  console.log('   - Ensure Gmail SMTP is properly configured');
  console.log('\n💡 Configuration:');
  console.log(`   - Email User: ${process.env.EMAIL_USER}`);
  console.log(`   - Test Email: ${process.env.TEST_EMAIL || process.env.EMAIL_USER}`);
  console.log(`   - Admin Email: ${process.env.ADMIN_EMAIL || process.env.EMAIL_USER}`);
  console.log('\n');
}

// Run tests
testEmailNotifications()
  .then(() => {
    console.log('🎉 All tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  });
