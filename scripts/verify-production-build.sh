#!/bin/bash

# Production Build Verification Script
# Tests the production build locally before deployment

set -e

echo "🔍 Mawu Foundation - Production Build Verification"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success message
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error message
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print warning message
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if .env file exists
if [ ! -f .env ]; then
    error ".env file not found"
    echo "Please create a .env file with required variables"
    exit 1
fi

success ".env file found"
echo ""

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"
success "Node.js is installed"
echo ""

# Check npm version
echo "📦 Checking npm version..."
NPM_VERSION=$(npm -v)
echo "npm version: $NPM_VERSION"
success "npm is installed"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
success "Dependencies installed"
echo ""

# Build frontend
echo "🔨 Building frontend..."
npm run build --workspace @mawu/web
if [ -d "apps/web/dist" ]; then
    success "Frontend build successful"
    echo "Build output: apps/web/dist"
else
    error "Frontend build failed - dist directory not found"
    exit 1
fi
echo ""

# Build backend
echo "🔨 Building backend..."
npm run build:server
if [ -d "dist/server" ]; then
    success "Backend build successful"
    echo "Build output: dist/server"
else
    error "Backend build failed - dist/server directory not found"
    exit 1
fi
echo ""

# Check TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
if [ -f "dist/server/index.js" ]; then
    success "Server entry point compiled"
else
    error "Server entry point not found"
    exit 1
fi
echo ""

# Verify environment variables
echo "🔍 Verifying critical environment variables..."

check_var() {
    if [ -z "${!1}" ]; then
        warning "$1 is not set"
        return 1
    else
        success "$1 is set"
        return 0
    fi
}

all_vars_set=true

check_var "DATABASE_URL" || all_vars_set=false
check_var "STRIPE_SECRET_KEY" || all_vars_set=false
check_var "VITE_STRIPE_PUBLIC_KEY" || all_vars_set=false
check_var "EMAIL_USER" || all_vars_set=false
check_var "EMAIL_PASS" || all_vars_set=false
check_var "SESSION_SECRET" || all_vars_set=false
check_var "ADMIN_EMAIL" || all_vars_set=false
check_var "ADMIN_PASSWORD" || all_vars_set=false

echo ""

if [ "$all_vars_set" = false ]; then
    warning "Some environment variables are missing"
    echo "The build will work, but the application may not function correctly"
else
    success "All critical environment variables are set"
fi

echo ""

# Check build sizes
echo "📊 Build Statistics:"
echo ""

if command -v du &> /dev/null; then
    FRONTEND_SIZE=$(du -sh apps/web/dist 2>/dev/null | cut -f1)
    BACKEND_SIZE=$(du -sh dist/server 2>/dev/null | cut -f1)
    
    echo "Frontend build size: $FRONTEND_SIZE"
    echo "Backend build size: $BACKEND_SIZE"
else
    warning "du command not available, skipping size check"
fi

echo ""

# Summary
echo "=================================================="
echo "📋 Verification Summary"
echo "=================================================="
echo ""
success "Production build completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Test the build locally:"
echo "     NODE_ENV=production npm run start:production"
echo ""
echo "  2. Verify the application works:"
echo "     - Open http://localhost:3000 in your browser"
echo "     - Test critical user flows"
echo "     - Check API endpoints"
echo ""
echo "  3. Deploy to Coolify:"
echo "     - Push changes to your repository"
echo "     - Coolify will automatically build and deploy"
echo ""
echo "  4. Monitor the deployment:"
echo "     - Check Coolify logs"
echo "     - Verify health check: /api/health"
echo "     - Test production functionality"
echo ""
