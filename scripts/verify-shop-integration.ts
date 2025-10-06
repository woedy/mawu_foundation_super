/**
 * Shop Backend Integration Verification Script
 * 
 * This script performs automated checks to verify the shop backend integration
 * is working correctly. Run this before manual testing.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: CheckResult[] = [];

function check(name: string, condition: boolean, message: string) {
  results.push({ name, passed: condition, message });
  const icon = condition ? '✅' : '❌';
  console.log(`${icon} ${name}: ${message}`);
}

console.log('🔍 Verifying Shop Backend Integration...\n');

// Check 1: Verify hooks exist
console.log('📋 Checking hooks...');
const useProductsPath = join(process.cwd(), 'apps/web/src/hooks/useProducts.ts');
const useProductPath = join(process.cwd(), 'apps/web/src/hooks/useProduct.ts');

check(
  'useProducts hook',
  existsSync(useProductsPath),
  existsSync(useProductsPath) ? 'Hook file exists' : 'Hook file missing'
);

check(
  'useProduct hook',
  existsSync(useProductPath),
  existsSync(useProductPath) ? 'Hook file exists' : 'Hook file missing'
);

// Check 2: Verify skeleton components exist
console.log('\n📋 Checking skeleton components...');
const productGridSkeletonPath = join(process.cwd(), 'apps/web/src/components/skeletons/ProductGridSkeleton.tsx');
const productDetailSkeletonPath = join(process.cwd(), 'apps/web/src/components/skeletons/ProductDetailSkeleton.tsx');

check(
  'ProductGridSkeleton',
  existsSync(productGridSkeletonPath),
  existsSync(productGridSkeletonPath) ? 'Component exists' : 'Component missing'
);

check(
  'ProductDetailSkeleton',
  existsSync(productDetailSkeletonPath),
  existsSync(productDetailSkeletonPath) ? 'Component exists' : 'Component missing'
);

// Check 3: Verify error components exist
console.log('\n📋 Checking error components...');
const errorStatePath = join(process.cwd(), 'apps/web/src/components/ErrorState.tsx');

check(
  'ErrorState component',
  existsSync(errorStatePath),
  existsSync(errorStatePath) ? 'Component exists' : 'Component missing'
);

// Check 4: Verify ProductImage component exists
console.log('\n📋 Checking image components...');
const productImagePath = join(process.cwd(), 'apps/web/src/components/ProductImage.tsx');

check(
  'ProductImage component',
  existsSync(productImagePath),
  existsSync(productImagePath) ? 'Component exists' : 'Component missing'
);

// Check 5: Verify pages are updated
console.log('\n📋 Checking page components...');
const shopPagePath = join(process.cwd(), 'apps/web/src/pages/EnhancedShopPage.tsx');
const productDetailPagePath = join(process.cwd(), 'apps/web/src/pages/ProductDetailPage.tsx');

if (existsSync(shopPagePath)) {
  const shopPageContent = readFileSync(shopPagePath, 'utf-8');
  const usesHook = shopPageContent.includes('useProducts');
  const hasSkeleton = shopPageContent.includes('ProductGridSkeleton');
  const hasError = shopPageContent.includes('ErrorState');
  
  check(
    'EnhancedShopPage uses useProducts',
    usesHook,
    usesHook ? 'Hook is imported and used' : 'Hook not found'
  );
  
  check(
    'EnhancedShopPage has loading skeleton',
    hasSkeleton,
    hasSkeleton ? 'Skeleton component used' : 'Skeleton not found'
  );
  
  check(
    'EnhancedShopPage has error handling',
    hasError,
    hasError ? 'Error component used' : 'Error handling not found'
  );
}

if (existsSync(productDetailPagePath)) {
  const productDetailContent = readFileSync(productDetailPagePath, 'utf-8');
  const usesHook = productDetailContent.includes('useProduct');
  const hasSkeleton = productDetailContent.includes('ProductDetailSkeleton');
  const hasError = productDetailContent.includes('ErrorState') || productDetailContent.includes('error');
  
  check(
    'ProductDetailPage uses useProduct',
    usesHook,
    usesHook ? 'Hook is imported and used' : 'Hook not found'
  );
  
  check(
    'ProductDetailPage has loading skeleton',
    hasSkeleton,
    hasSkeleton ? 'Skeleton component used' : 'Skeleton not found'
  );
  
  check(
    'ProductDetailPage has error handling',
    hasError,
    hasError ? 'Error handling implemented' : 'Error handling not found'
  );
}

// Check 6: Verify validation utilities exist
console.log('\n📋 Checking validation utilities...');
const productValidationPath = join(process.cwd(), 'apps/web/src/utils/productValidation.ts');

check(
  'Product validation utility',
  existsSync(productValidationPath),
  existsSync(productValidationPath) ? 'Validation utility exists' : 'Validation utility missing'
);

// Check 7: Verify monitoring utilities exist
console.log('\n📋 Checking monitoring utilities...');
const monitoringPath = join(process.cwd(), 'apps/web/src/lib/monitoring.ts');

check(
  'Monitoring utility',
  existsSync(monitoringPath),
  existsSync(monitoringPath) ? 'Monitoring utility exists' : 'Monitoring utility missing'
);

// Check 8: Verify environment configuration
console.log('\n📋 Checking environment configuration...');
const envExamplePath = join(process.cwd(), '.env.example');

if (existsSync(envExamplePath)) {
  const envContent = readFileSync(envExamplePath, 'utf-8');
  const hasApiUrl = envContent.includes('VITE_API_URL');
  
  check(
    'VITE_API_URL in .env.example',
    hasApiUrl,
    hasApiUrl ? 'Environment variable documented' : 'Environment variable not documented'
  );
}

// Check 9: Verify cache utilities
console.log('\n📋 Checking cache implementation...');
if (existsSync(useProductsPath)) {
  const useProductsContent = readFileSync(useProductsPath, 'utf-8');
  const hasCache = useProductsContent.includes('localStorage');
  const hasCacheKey = useProductsContent.includes('CACHE_KEY');
  const hasExpiration = useProductsContent.includes('expiresAt');
  
  check(
    'Cache implementation in useProducts',
    hasCache && hasCacheKey && hasExpiration,
    hasCache && hasCacheKey && hasExpiration 
      ? 'Cache with expiration implemented' 
      : 'Cache implementation incomplete'
  );
}

// Check 10: Verify request deduplication
console.log('\n📋 Checking request deduplication...');
if (existsSync(useProductsPath)) {
  const useProductsContent = readFileSync(useProductsPath, 'utf-8');
  const hasDedup = useProductsContent.includes('pendingRequest');
  
  check(
    'Request deduplication in useProducts',
    hasDedup,
    hasDedup ? 'Request deduplication implemented' : 'Request deduplication missing'
  );
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));

const passed = results.filter(r => r.passed).length;
const total = results.length;
const percentage = Math.round((passed / total) * 100);

console.log(`\nTotal Checks: ${total}`);
console.log(`Passed: ${passed} ✅`);
console.log(`Failed: ${total - passed} ❌`);
console.log(`Success Rate: ${percentage}%\n`);

if (percentage === 100) {
  console.log('🎉 All checks passed! Ready for manual testing.');
  console.log('📖 See docs/manual-testing-guide.md for testing instructions.\n');
} else {
  console.log('⚠️  Some checks failed. Please review the issues above.');
  console.log('🔧 Fix the failing checks before proceeding to manual testing.\n');
  process.exit(1);
}

// Next steps
console.log('📋 NEXT STEPS:');
console.log('1. Start the backend server: npm run dev:server');
console.log('2. Start the frontend: npm run dev --workspace @mawu/web');
console.log('3. Follow the manual testing guide: docs/manual-testing-guide.md');
console.log('4. Test all scenarios listed in the guide');
console.log('5. Document any issues found\n');
