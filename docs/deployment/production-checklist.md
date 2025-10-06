# Production Deployment Checklist

Use this checklist to ensure all aspects of production deployment are properly configured.

## Pre-Deployment

### Code Preparation
- [ ] All demo references removed from codebase
- [ ] Production build tested locally
- [ ] All tests passing
- [ ] No console.log statements in production code
- [ ] Error handling implemented for all critical paths
- [ ] Environment variables documented

### Database
- [ ] Production database created
- [ ] Database connection string obtained
- [ ] Database schema reviewed
- [ ] Backup strategy in place
- [ ] Database access restricted to application only

### Stripe Configuration
- [ ] Stripe account in production mode
- [ ] Production API keys obtained
- [ ] Webhook endpoint created in Stripe dashboard
- [ ] Webhook secret obtained
- [ ] Test payment completed in test mode
- [ ] Payment flow verified end-to-end

### Email Configuration
- [ ] Gmail account configured for SMTP
- [ ] 2-Factor Authentication enabled
- [ ] App-specific password generated
- [ ] Email templates reviewed
- [ ] Test emails sent successfully
- [ ] Email delivery monitored

### Security
- [ ] Strong SESSION_SECRET generated
- [ ] Strong ADMIN_PASSWORD set
- [ ] All secrets stored securely (not in code)
- [ ] HTTPS configured (handled by Coolify)
- [ ] CORS configured for production domain
- [ ] Session cookies configured for production

## Deployment Configuration

### Environment Variables
- [ ] NODE_ENV=production
- [ ] DATABASE_URL configured
- [ ] STRIPE_SECRET_KEY (live mode)
- [ ] VITE_STRIPE_PUBLIC_KEY (live mode)
- [ ] STRIPE_WEBHOOK_SECRET (live mode)
- [ ] EMAIL_USER configured
- [ ] EMAIL_PASS configured
- [ ] ADMIN_EMAIL set
- [ ] ADMIN_PASSWORD set
- [ ] ADMIN_NAME set
- [ ] SESSION_SECRET generated
- [ ] VITE_API_URL set to production domain
- [ ] FRONTEND_URL set to production domain
- [ ] PORT configured (if needed)

### Coolify Setup
- [ ] Application created in Coolify
- [ ] Git repository connected
- [ ] Build pack set to nixpacks
- [ ] Environment variables configured
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Build settings verified

### Build Configuration
- [ ] nixpacks.toml reviewed
- [ ] package.json scripts verified
- [ ] tsconfig.server.json configured
- [ ] Build process tested
- [ ] Production dependencies installed

## Post-Deployment Verification

### Application Health
- [ ] Application deployed successfully
- [ ] No build errors in logs
- [ ] Server started successfully
- [ ] Database connection established
- [ ] Admin user seeded

### Frontend Verification
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Navigation works properly
- [ ] Images load correctly
- [ ] Responsive design works
- [ ] No console errors
- [ ] ScrollToTop functionality works

### Shop Functionality
- [ ] Shop page displays products
- [ ] Product detail pages load
- [ ] Product variations selectable
- [ ] Add to cart works
- [ ] Cart persists across navigation
- [ ] Cart updates work (quantity, remove)
- [ ] Checkout form displays
- [ ] Stripe Elements loads
- [ ] Payment processing works
- [ ] Order confirmation displays
- [ ] Order confirmation email received

### Donation Functionality
- [ ] Donation page loads
- [ ] Donation amounts selectable
- [ ] Custom amount entry works
- [ ] Stripe payment processes
- [ ] Donation confirmation displays
- [ ] Donation receipt email received
- [ ] Only Stripe shown as active payment method

### Admin Functionality
- [ ] Admin login page accessible
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Product management works
- [ ] Order management works
- [ ] Donation tracking works
- [ ] Admin can create products
- [ ] Admin can edit products
- [ ] Admin can update order status

### Email System
- [ ] Order confirmation emails sending
- [ ] Donation receipt emails sending
- [ ] Email templates render correctly
- [ ] Email branding correct
- [ ] Links in emails work
- [ ] Email delivery reliable

### Stripe Integration
- [ ] Payments process successfully
- [ ] Webhooks received
- [ ] Webhook signature verified
- [ ] Order status updates from webhooks
- [ ] Donation status updates from webhooks
- [ ] Failed payments handled gracefully
- [ ] Stripe dashboard shows transactions

### Program Pages
- [ ] Individual program pages accessible
- [ ] Program content displays correctly
- [ ] Navigation to programs works
- [ ] No accordion functionality on main page

## Performance & Optimization

### Frontend Performance
- [ ] Page load times acceptable (<3s)
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading where appropriate
- [ ] Bundle size optimized

### Backend Performance
- [ ] API response times acceptable (<500ms)
- [ ] Database queries optimized
- [ ] Connection pooling configured
- [ ] No memory leaks
- [ ] Error handling doesn't impact performance

## Security Verification

### Application Security
- [ ] No sensitive data in client-side code
- [ ] API endpoints properly secured
- [ ] Admin routes protected
- [ ] Session management secure
- [ ] CSRF protection in place
- [ ] Input validation implemented
- [ ] SQL injection prevention (via ORM)

### Payment Security
- [ ] PCI compliance via Stripe
- [ ] No card data stored locally
- [ ] Webhook signatures verified
- [ ] Secure payment flow

## Monitoring & Maintenance

### Logging
- [ ] Application logs accessible
- [ ] Error logging configured
- [ ] Payment logs monitored
- [ ] Email delivery logs checked

### Monitoring Setup
- [ ] Uptime monitoring configured
- [ ] Error tracking setup
- [ ] Performance monitoring active
- [ ] Database monitoring enabled

### Backup & Recovery
- [ ] Database backup scheduled
- [ ] Backup restoration tested
- [ ] Environment variables backed up
- [ ] Recovery procedure documented

## Documentation

### Technical Documentation
- [ ] Deployment guide complete
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Database schema documented

### User Documentation
- [ ] Admin user guide available
- [ ] Troubleshooting guide created
- [ ] FAQ updated
- [ ] Contact information current

## Final Sign-Off

### Stakeholder Approval
- [ ] Technical team approval
- [ ] Foundation team review
- [ ] User acceptance testing complete
- [ ] Go-live approval obtained

### Launch Preparation
- [ ] Launch date scheduled
- [ ] Rollback plan prepared
- [ ] Support team briefed
- [ ] Communication plan ready

## Post-Launch

### Immediate (First 24 Hours)
- [ ] Monitor application logs
- [ ] Check error rates
- [ ] Verify payment processing
- [ ] Monitor email delivery
- [ ] Check webhook delivery
- [ ] Respond to any issues

### Short-Term (First Week)
- [ ] Review performance metrics
- [ ] Analyze user behavior
- [ ] Check conversion rates
- [ ] Review donation patterns
- [ ] Address any bugs
- [ ] Gather user feedback

### Ongoing
- [ ] Regular security updates
- [ ] Performance optimization
- [ ] Feature enhancements
- [ ] Content updates
- [ ] Regular backups verified

## Emergency Contacts

Document key contacts for:
- [ ] Hosting/Coolify support
- [ ] Database administrator
- [ ] Stripe support
- [ ] Email service support
- [ ] Development team
- [ ] Foundation stakeholders

## Notes

Use this section to document any deployment-specific notes, issues encountered, or special configurations:

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: _______________
**Notes**: 
