#!/bin/bash

# Production Deployment Script for Mawu Foundation Platform
# This script helps with manual deployment operations

set -e  # Exit on error

echo "🚀 Mawu Foundation - Production Deployment Helper"
echo "=================================================="
echo ""

# Check if we're in production
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to 'production'"
    echo "Current NODE_ENV: ${NODE_ENV:-not set}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Function to check required environment variables
check_env_vars() {
    echo "🔍 Checking required environment variables..."
    
    required_vars=(
        "DATABASE_URL"
        "STRIPE_SECRET_KEY"
        "VITE_STRIPE_PUBLIC_KEY"
        "STRIPE_WEBHOOK_SECRET"
        "EMAIL_USER"
        "EMAIL_PASS"
        "SESSION_SECRET"
        "ADMIN_EMAIL"
        "ADMIN_PASSWORD"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo "❌ Missing required environment variables:"
        printf '   - %s\n' "${missing_vars[@]}"
        echo ""
        echo "Please set these variables before deploying."
        exit 1
    fi
    
    echo "✅ All required environment variables are set"
    echo ""
}

# Function to run database migrations
run_migrations() {
    echo "📊 Running database migrations..."
    npm run db:push
    echo "✅ Database migrations complete"
    echo ""
}

# Function to seed admin user
seed_admin() {
    echo "👤 Seeding admin user..."
    npm run seed:admin:production
    echo "✅ Admin user seeded"
    echo ""
}

# Function to build application
build_app() {
    echo "🔨 Building application..."
    
    echo "  - Building frontend..."
    npm run build --workspace @mawu/web
    
    echo "  - Building backend..."
    npm run build:server
    
    echo "✅ Build complete"
    echo ""
}

# Function to test database connection
test_db_connection() {
    echo "🔌 Testing database connection..."
    
    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
            echo "✅ Database connection successful"
        else
            echo "❌ Database connection failed"
            exit 1
        fi
    else
        echo "⚠️  psql not found, skipping database connection test"
    fi
    echo ""
}

# Main deployment flow
main() {
    echo "Starting deployment process..."
    echo ""
    
    # Check environment variables
    check_env_vars
    
    # Test database connection
    test_db_connection
    
    # Build application
    build_app
    
    # Run migrations
    run_migrations
    
    # Seed admin user
    seed_admin
    
    echo "✅ Deployment preparation complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Start the production server: npm run start:production"
    echo "  2. Verify the application is running"
    echo "  3. Test critical user flows"
    echo "  4. Monitor logs for any errors"
    echo ""
}

# Run main function
main
