# API Configuration Guide

This guide explains how to configure the frontend to connect to the backend API in different environments.

## Overview

The Mawu Foundation frontend uses the `VITE_API_URL` environment variable to determine which backend API to connect to. The application includes intelligent fallback behavior to ensure it works even when the API is unavailable.

## Environment Variable

### `VITE_API_URL`

The base URL for the backend API server.

- **Type**: String (URL)
- **Required**: No
- **Default**: `http://localhost:3001`
- **Example Values**:
  - Development: `http://localhost:3001`
  - Custom Port: `http://localhost:3000`
  - Production: `https://api.mawufoundation.org`
  - Staging: `https://staging-api.mawufoundation.org`

## Configuration by Environment

### Local Development

**Default Configuration (no .env file needed):**
The application will automatically use `http://localhost:3001` if no environment variable is set.

**Custom Configuration:**
1. Copy `.env.example` to `.env`
2. Update the `VITE_API_URL` value:
   ```bash
   VITE_API_URL=http://localhost:3001
   ```
3. Restart the development server

### Production Deployment

#### Vercel

1. Add environment variable via CLI:
   ```bash
   vercel env add VITE_API_URL production
   ```
   When prompted, enter: `https://api.mawufoundation.org`

2. Or add via Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add `VITE_API_URL` with value `https://api.mawufoundation.org`
   - Select "Production" environment
   - Redeploy your application

#### Netlify

1. Via Netlify Dashboard:
   - Go to Site Settings → Environment Variables
   - Add variable:
     - Key: `VITE_API_URL`
     - Value: `https://api.mawufoundation.org`
   - Trigger a new deploy

2. Via `netlify.toml`:
   ```toml
   [build.environment]
     VITE_API_URL = "https://api.mawufoundation.org"
   ```

#### Coolify

1. In your service configuration:
   - Navigate to Environment Variables section
   - Add:
     ```
     VITE_API_URL=https://api.mawufoundation.org
     ```
2. Redeploy the service

## Fallback Behavior

The application is designed to work gracefully even when the API is unavailable:

1. **Automatic Fallback**: If API requests fail, the application falls back to static/cached data
2. **User-Friendly Errors**: Clear error messages are displayed when API issues occur
3. **Retry Logic**: Failed requests are automatically retried with exponential backoff
4. **Offline Support**: The application remains functional with cached data

## Testing API Configuration

### Verify Current Configuration

Run the test script to verify your API configuration:

```bash
npx tsx apps/web/src/lib/test-api-config.ts
```

This will display:
- Current `VITE_API_URL` value
- Fallback behavior verification
- Example API endpoints

### Test Different URLs

1. Update `VITE_API_URL` in your `.env` file
2. Restart the development server:
   ```bash
   npm run dev --workspace @mawu/web
   ```
3. Open the browser console and check for API requests
4. Look for messages like:
   ```
   [API] Fetching from: http://localhost:3001/api/products
   ```

### Verify Fallback

To test the fallback behavior:

1. Set an invalid API URL:
   ```bash
   VITE_API_URL=http://localhost:9999
   ```
2. Start the development server
3. Navigate to the shop page
4. Verify that:
   - Products still display (using fallback data)
   - An error message or banner appears
   - The console shows API error logs

## API Client Implementation

The API client is located at `apps/web/src/lib/api.ts` and includes:

- **Automatic Retry**: Failed requests retry up to 3 times with exponential backoff
- **Error Handling**: Custom `ApiError` class with status codes and error details
- **Credentials**: Includes credentials for session management
- **Type Safety**: Full TypeScript support

### Example Usage

```typescript
import { api } from '@/lib/api';

// Fetch all products
const response = await api.get('/api/products');

// Fetch single product
const product = await api.get(`/api/products/${slug}`);

// Create order
const order = await api.post('/api/orders', orderData);
```

## Troubleshooting

### API Requests Failing

1. **Check the URL**: Verify `VITE_API_URL` is set correctly
2. **Check CORS**: Ensure the backend allows requests from your frontend domain
3. **Check Network**: Use browser DevTools Network tab to inspect requests
4. **Check Console**: Look for error messages in the browser console

### Environment Variable Not Working

1. **Restart Server**: Environment variables require a server restart
2. **Check Prefix**: Vite requires the `VITE_` prefix for client-side variables
3. **Check Build**: Ensure you rebuild after changing environment variables
4. **Check Platform**: Verify the hosting platform has the variable set

### Fallback Not Working

1. **Check Import**: Ensure fallback data is imported correctly
2. **Check Error Handling**: Verify try-catch blocks are in place
3. **Check Console**: Look for error logs that might indicate issues

## Security Considerations

### Production

- Always use HTTPS URLs in production (`https://`)
- Never commit production API URLs to version control
- Use environment variables for all API configuration
- Validate API responses before using them

### Development

- Use `http://localhost` for local development
- Keep development API keys separate from production
- Don't expose sensitive data in error messages

## Related Documentation

- [API Client Implementation](../apps/web/src/lib/api.ts)
- [Shop Backend Integration Spec](.kiro/specs/shop-backend-integration/)
- [Deployment Guide](deployment/)
- [Environment Variables](.env.example)

## Support

If you encounter issues with API configuration:

1. Check this guide for common solutions
2. Review the browser console for error messages
3. Verify environment variables are set correctly
4. Test with the verification script
5. Check the API server is running and accessible
