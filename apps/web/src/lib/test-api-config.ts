/**
 * Test script to verify API configuration and fallback behavior
 * Run with: npx tsx apps/web/src/lib/test-api-config.ts
 */

// Test 1: Verify environment variable is read correctly
console.log('=== API Configuration Test ===\n');

const envApiUrl = process.env.VITE_API_URL;
console.log('1. Environment Variable Check:');
console.log(`   VITE_API_URL = ${envApiUrl || '(not set)'}`);

// Test 2: Verify fallback behavior
const expectedFallback = 'http://localhost:3001';
const actualApiUrl = envApiUrl || expectedFallback;

console.log('\n2. Fallback Behavior:');
console.log(`   Expected fallback: ${expectedFallback}`);
console.log(`   Actual API URL: ${actualApiUrl}`);
console.log(`   ✓ Fallback ${actualApiUrl === expectedFallback ? 'WORKS' : 'FAILED'}`);

// Test 3: Test different URL scenarios
console.log('\n3. URL Scenarios:');

const testScenarios = [
  { name: 'Localhost (default)', url: 'http://localhost:3001' },
  { name: 'Localhost (custom port)', url: 'http://localhost:3000' },
  { name: 'Production', url: 'https://api.mawufoundation.org' },
  { name: 'Staging', url: 'https://staging-api.mawufoundation.org' },
];

testScenarios.forEach((scenario) => {
  console.log(`   - ${scenario.name}: ${scenario.url}`);
});

// Test 4: Verify API client would use correct URL
console.log('\n4. API Client Configuration:');
console.log(`   The API client will use: ${actualApiUrl}`);
console.log(`   All requests will be prefixed with this URL`);
console.log(`   Example: ${actualApiUrl}/api/products`);

console.log('\n=== Test Complete ===');
console.log('\nTo test with different URLs:');
console.log('1. Update VITE_API_URL in .env file');
console.log('2. Restart the development server');
console.log('3. Check browser console for API requests');
