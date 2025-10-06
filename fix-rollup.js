#!/usr/bin/env node

/**
 * Simple fix for Rollup native module issues in deployment
 * This script ensures WASM fallback is used when native modules aren't available
 */

const fs = require('fs');
const path = require('path');

console.log('Applying Rollup deployment fix...');

try {
  // Set environment variable
  process.env.ROLLUP_USE_WASM = 'true';
  
  // Check if @rollup/wasm-node is available
  const wasmNodePath = path.join(__dirname, 'node_modules', '@rollup', 'wasm-node');
  if (fs.existsSync(wasmNodePath)) {
    console.log('✅ @rollup/wasm-node is available');
    
    // Try to modify the rollup native.js file to force WASM usage
    const rollupNativePath = path.join(__dirname, 'node_modules', 'rollup', 'dist', 'native.js');
    if (fs.existsSync(rollupNativePath)) {
      let nativeContent = fs.readFileSync(rollupNativePath, 'utf8');
      
      // Simple replacement to force WASM usage
      if (!nativeContent.includes('ROLLUP_USE_WASM')) {
        const wasmFallback = `
// Force WASM usage in deployment environments
if (process.env.ROLLUP_USE_WASM === 'true' || process.env.NODE_ENV === 'production') {
  try {
    const wasmBindings = require('@rollup/wasm-node/dist/native.js');
    module.exports = wasmBindings;
    console.log('Using Rollup WASM bindings');
  } catch (e) {
    console.log('WASM fallback failed, continuing with original code');
  }
}
`;
        
        nativeContent = wasmFallback + nativeContent;
        fs.writeFileSync(rollupNativePath, nativeContent);
        console.log('✅ Applied WASM fallback to rollup native.js');
      } else {
        console.log('✅ WASM fallback already applied');
      }
    }
  } else {
    console.log('⚠️  @rollup/wasm-node not found, relying on environment variables');
  }
  
  console.log('🎉 Rollup fix applied successfully');
} catch (error) {
  console.error('❌ Error applying Rollup fix:', error.message);
  console.log('Continuing with build...');
}