# API URL Configuration Testing Guide

This guide provides step-by-step instructions for testing the API URL configuration in different scenarios.

## Overview

The frontend uses the `VITE_API_URL` environment variable to configure the backend API endpoint. If not set, it defaults to `http://localhost:3001`.

## Configuration Location

- **Environment file**: `.env` (local development)
- **Example file**: `.env.example` (template)
- **Code location**: `apps/web/src/lib/api.ts`

## Default Behavior

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

- ✅ If `VITE_API_URL` is set → uses the configured value
- ✅ If `VITE_API_URL` is not set → falls back to `http://localhost:3001`
- ✅ If `VITE_API_URL` is empty string → falls back to `http://localhost:3001`

## Test Scenarios

### Scenario 1: Default Configuration (localhost:3001)

**Setup:**
```bash
# In .env file
VITE_API_URL=http://localhost:3001
```

**Steps:**
1. Start the backend server on port 3001
2. Start the frontend: `npm run dev --workspace @mawu/web`
3. Navigate to http://localhost:5173/shop
4. Open browser console

**Expected Results:**
- ✅ Products load from API
- ✅ No errors in console
- ✅ API requests go to `http://localhost:3001`

### Scenario 2: Custom Local Port (localhost:3000)

**Setup:**
```bash
# In .env file
VITE_API_URL=http://localhost:3000
```

**Steps:**
1. Start the backend server on port 3000
2. Restart the frontend: `npm run dev --workspace @mawu/web`
3. Navigate to http://localhost:5173/shop
4. Open browser console and check Network tab

**Expected Results:**
- ✅ Products load from API
- ✅ API requests go to `http://localhost:3000`
- ✅ No CORS errors

### Scenario 3: Fallback Behavior (No VITE_API_URL)

**Setup:**
```bash
# In .env file - comment out or remove VITE_API_URL
# VITE_API_URL=http://localhost:3001
```

**Steps:**
1. Start the backend server on port 3001
2. Restart the frontend: `npm run dev --workspace @mawu/web`
3. Navigate to http://localhost:5173/shop
4. Check browser console

**Expected Results:**
- ✅ Products load from API
- ✅ API requests go to `http://localhost:3001` (fallback)
- ✅ Application works normally

### Scenario 4: Production API URL

**Setup:**
```bash
# In .env file
VITE_API_URL=https://api.mawufoundation.org
```

**Steps:**
1. Update .env with production URL
2. Restart the frontend: `npm run dev --workspace @mawu/web`
3. Navigate to http://localhost:5173/shop
4. Check Network tab in browser console

**Expected Results:**
- ✅ API requests go to `https://api.mawufoundation.org`
- ✅ HTTPS connection is secure
- ✅ Products load from production API

### Scenario 5: API Unavailable (Fallback to Static Data)

**Setup:**
```bash
# In .env file
VITE_API_URL=http://localhost:9999
```

**Steps:**
1. Do NOT start any backend server
2. Restart the frontend: `npm run dev --workspace @mawu/web`
3. Navigate to http://localhost:5173/shop
4. Check browser console for errors

**Expected Results:**
- ✅ Application still loads
- ✅ Static fallback data is displayed
- ✅ User-friendly error message shown
- ✅ Console shows network error (expected)
- ✅ No application crash

## Automated Tests

Run the automated configuration tests:

```bash
npm run test --workspace @mawu/web -- src/test-api-url-config.test.ts --run
```

**Expected Output:**
```
✓ API URL Configuration > should use VITE_API_URL when set
✓ API URL Configuration > should fallback to localhost:3001 when VITE_API_URL is not set
✓ API URL Configuration > should support custom local ports
✓ API URL Configuration > should support production URLs
✓ API URL Configuration > should support HTTPS URLs
✓ API URL Configuration > should handle empty string as not set
✓ API Configuration Documentation > should document the default fallback URL
✓ API Configuration Documentation > should use consistent URL format
```

## Verification Checklist

Use this checklist to verify the configuration is working correctly:

- [ ] `.env` file contains `VITE_API_URL` with correct value
- [ ] `.env.example` documents the `VITE_API_URL` variable
- [ ] README.md includes API configuration documentation
- [ ] Fallback to `http://localhost:3001` works when env var not set
- [ ] Custom local ports work (e.g., 3000, 8080)
- [ ] Production URLs work with HTTPS
- [ ] Application gracefully handles API unavailability
- [ ] No CORS errors with configured API URL
- [ ] Automated tests pass
- [ ] Browser console shows correct API URL being used

## Troubleshooting

### Issue: API requests go to wrong URL

**Solution:**
1. Check `.env` file has correct `VITE_API_URL`
2. Restart the dev server (Vite doesn't hot-reload env vars)
3. Clear browser cache and reload

### Issue: CORS errors

**Solution:**
1. Verify backend CORS configuration allows frontend origin
2. Check backend is running on the configured port
3. Ensure `credentials: 'include'` is set in API client

### Issue: Fallback not working

**Solution:**
1. Verify `api.ts` has correct fallback logic
2. Check that fallback data files exist
3. Look for console errors indicating missing imports

### Issue: Environment variable not recognized

**Solution:**
1. Ensure variable starts with `VITE_` prefix
2. Restart dev server after changing `.env`
3. Check Vite configuration doesn't override env vars

## Production Deployment

When deploying to production, configure the environment variable in your hosting platform:

**Vercel:**
```bash
vercel env add VITE_API_URL production
# Enter: https://api.mawufoundation.org
```

**Netlify:**
```
Site settings → Environment variables → Add variable
Key: VITE_API_URL
Value: https://api.mawufoundation.org
```

**Coolify:**
```
Service → Environment Variables → Add
VITE_API_URL=https://api.mawufoundation.org
```

## Summary

The API URL configuration is:
- ✅ Properly documented in `.env.example` and README
- ✅ Defaults to `http://localhost:3001` when not set
- ✅ Supports custom local and production URLs
- ✅ Gracefully handles API unavailability
- ✅ Tested with automated unit tests
- ✅ Ready for production deployment
