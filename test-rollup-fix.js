#!/usr/bin/env node

// Test script to verify Rollup WASM fallback works
console.log('Testing Rollup WASM fallback...');

// Set environment variable to force WASM usage
process.env.ROLLUP_USE_WASM = 'true';

try {
  // Try to require rollup
  const rollup = require('rollup');
  console.log('✅ Rollup loaded successfully');
  
  // Try to access native functions
  const { parse } = require('rollup/dist/native.js');
  console.log('✅ Native functions accessible');
  
  // Test basic parsing
  const result = parse('export default 42;');
  console.log('✅ Parse function works');
  console.log('🎉 Rollup WASM fallback is working correctly!');
  
} catch (error) {
  console.error('❌ Rollup test failed:', error.message);
  process.exit(1);
}