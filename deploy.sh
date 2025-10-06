#!/bin/bash

echo "Starting custom deployment..."

# Install dependencies
echo "Installing dependencies..."
npm ci --include=dev

# Try to build with different approaches
echo "Attempting build..."

# Method 1: Try with WASM
export ROLLUP_USE_WASM=true
if npm run build --workspace @mawu/web; then
    echo "✅ Build successful with WASM"
else
    echo "❌ WASM build failed, trying alternative..."
    
    # Method 2: Try with esbuild
    if command -v node build-alternative.js; then
        node build-alternative.js
        echo "✅ Build successful with esbuild"
    else
        echo "❌ All build methods failed"
        exit 1
    fi
fi

# Build server
echo "Building server..."
npm run build:server

echo "✅ Deployment preparation complete"