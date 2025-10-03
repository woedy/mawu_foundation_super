# Design Document

## Overview

The Mawu Foundation platform will be transformed from a static demo into a fully functional e-commerce and donation platform. The architecture leverages the existing React + Vite frontend with Express.js backend, PostgreSQL database, and Stripe payment processing. The system will support complete product management, order processing, donation handling, and administrative oversight while maintaining the current design aesthetic and user experience.

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Frontend (React + Vite)"
        A[Shop Pages] --> B[Product Detail Pages]
        C[Donation Pages] --> D[Checkout Flow]
        E[Admin Dashboard] --> F[Management Interface]
        G[Cart Context] --> H[State Management]
    end
    
    subgraph "Backend (Express.js)"
        I[API Routes] --> J[Authentication Middleware]
        K[Payment Processing] --> L[Email Service]
        M[Database Layer] --> N[Stripe Integration]
    end
    
    subgraph "External Services"
        O[Stripe API] --> P[Payment Processing]
        Q[Gmail SMTP] --> R[Email Notifications]
        S[PostgreSQL] --> T[Data Storage]
    end
    
    A --> I
    C --> I
    E --> I
    K --> O
    L --> Q
    M --> S
```

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe API with webhooks
- **Email**: Gmail SMTP via Nodemailer
- **Deployment**: Coolify with nixpacks on Ubuntu server
- **State Management**: React Context API for cart and user state

## Components and Interfaces

### Frontend Components

#### E-commerce Components
- **ProductGrid**: Display products with filtering and search
- **ProductCard**: Individual product preview with quick actions
- **ProductDetail**: Comprehensive product page with variations
- **VariationSelector**: Color, size, and option selection interface
- **CartProvider**: Global cart state management
- **CartSidebar**: Slide-out cart with item management
- **CheckoutForm**: Multi-step checkout with Stripe integration

#### Donation Components
- **DonationForm**: Amount selection and donor information
- **DonationCheckout**: Stripe payment integration for donations
- **DonationSuccess**: Confirmation and receipt display

#### Admin Components
- **AdminDashboard**: Overview of orders, products, and donations
- **ProductManager**: CRUD operations for products and variations
- **OrderManager**: Order status tracking and fulfillment
- **DonationManager**: Donation tracking and reporting

#### Navigation Components
- **ScrollToTop**: Automatic page top navigation on route changes
- **ProgramDetailPages**: Individual pages for each program instead of accordion

### Backend API Endpoints

#### Public Endpoints
```typescript
GET /api/products - List all products
GET /api/products/:slug - Get product details
POST /api/orders/create-payment-intent - Create order payment
POST /api/donations/create-payment-intent - Create donation payment
POST /api/webhooks/stripe - Handle Stripe webhooks
```

#### Admin Endpoints
```typescript
POST /api/admin/login - Admin authentication
POST /api/admin/logout - Admin logout
GET /api/admin/me - Get admin profile
GET /api/admin/orders - List all orders
GET /api/admin/donations - List all donations
POST /api/admin/products - Create product
PUT /api/admin/products/:id - Update product
DELETE /api/admin/products/:id - Delete product
PUT /api/admin/orders/:id - Update order status
```

## Data Models

### Enhanced Product Model
```typescript
interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: decimal;
  currency: string;
  tags: string[];
  impactStatement?: string;
  description: string;
  images: string[];
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  inventory: number;
  variations?: ProductVariation[];
  createdAt: timestamp;
  updatedAt: timestamp;
}

interface ProductVariation {
  type: 'color' | 'size' | 'style';
  name: string;
  options: VariationOption[];
}

interface VariationOption {
  value: string;
  label: string;
  priceModifier?: number;
  inventory?: number;
  images?: string[];
}
```

### Order Model with Variations
```typescript
interface Order {
  id: number;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: decimal;
  currency: string;
  stripePaymentIntentId?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: Address;
  createdAt: timestamp;
  updatedAt: timestamp;
}

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: string;
  selectedVariations?: Record<string, string>;
}
```

### Enhanced Donation Model
```typescript
interface Donation {
  id: number;
  donorEmail: string;
  donorName: string;
  amount: decimal;
  currency: string;
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'annually';
  message?: string;
  anonymous: boolean;
  stripePaymentIntentId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: timestamp;
}
```

## Error Handling

### Frontend Error Handling
- **Payment Errors**: Display user-friendly messages for failed payments
- **Network Errors**: Retry mechanisms with exponential backoff
- **Validation Errors**: Real-time form validation with clear feedback
- **Cart Errors**: Graceful handling of inventory changes and product unavailability

### Backend Error Handling
- **Database Errors**: Transaction rollbacks and connection pooling
- **Stripe Errors**: Proper error mapping and user feedback
- **Email Errors**: Retry logic for failed email deliveries
- **Authentication Errors**: Secure session management and timeout handling

### Error Response Format
```typescript
interface ErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}
```

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: Cart flow and checkout process testing
- **E2E Tests**: Complete user journeys from product selection to purchase
- **Accessibility Tests**: WCAG compliance verification

### Backend Testing
- **API Tests**: Endpoint testing with proper authentication
- **Payment Tests**: Stripe integration testing with test keys
- **Database Tests**: Data integrity and transaction testing
- **Email Tests**: SMTP configuration and delivery testing

### Test Environment Setup
- **Test Database**: Separate PostgreSQL instance for testing
- **Mock Services**: Stripe test mode and email service mocking
- **CI/CD Integration**: Automated testing on deployment pipeline

## Email Integration

### Gmail SMTP Configuration
```typescript
interface EmailConfig {
  host: 'smtp.gmail.com';
  port: 587;
  secure: false;
  auth: {
    user: string; // Gmail address
    pass: string; // App-specific password
  };
}
```

### Email Templates
- **Order Confirmation**: Detailed order summary with tracking information
- **Donation Receipt**: Tax-deductible receipt with foundation information
- **Order Status Updates**: Shipping and delivery notifications
- **Admin Notifications**: New order and donation alerts

## Deployment Configuration

### Coolify Deployment Setup
```toml
# nixpacks.toml
[phases.setup]
aptPkgs = ['postgresql-client']

[phases.build]
cmds = [
  'npm install',
  'npm run build --workspace @mawu/web'
]

[phases.deploy]
cmds = [
  'npm run db:push'
]

[start]
cmd = 'npm run dev:server'
```

### Environment Variables
```bash
# Production Environment
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_USER=foundation@mawufoundation.org
EMAIL_PASS=app_specific_password
SESSION_SECRET=secure_random_string
FRONTEND_URL=https://mawufoundation.org
```

### Static File Serving
- **Frontend Build**: Serve React build from `apps/web/dist`
- **Asset Management**: Optimize images and static resources
- **CDN Integration**: Optional CDN setup for improved performance

## Security Considerations

### Payment Security
- **PCI Compliance**: Use Stripe's secure payment processing
- **Webhook Verification**: Validate Stripe webhook signatures
- **Environment Variables**: Secure storage of API keys and secrets

### Data Protection
- **Session Security**: Secure session configuration with proper cookies
- **Input Validation**: Sanitize all user inputs and API parameters
- **SQL Injection Prevention**: Use parameterized queries with Drizzle ORM

### Admin Security
- **Authentication**: Secure admin login with bcrypt password hashing
- **Authorization**: Role-based access control for admin functions
- **Session Management**: Automatic logout and session timeout

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Lazy load admin and checkout components
- **Image Optimization**: Compress and serve appropriate image sizes
- **Caching Strategy**: Browser caching for static assets

### Backend Optimization
- **Database Indexing**: Optimize queries for products and orders
- **Connection Pooling**: Efficient database connection management
- **Response Caching**: Cache product data and reduce database calls

### Monitoring and Analytics
- **Error Tracking**: Log and monitor application errors
- **Performance Metrics**: Track page load times and API response times
- **Business Metrics**: Monitor conversion rates and donation patterns