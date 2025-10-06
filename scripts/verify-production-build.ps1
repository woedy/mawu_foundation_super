# Production Build Verification Script (PowerShell)
# Tests the production build locally before deployment

$ErrorActionPreference = "Stop"

Write-Host "🔍 Mawu Foundation - Production Build Verification" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Message {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning-Message {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Error-Message ".env file not found"
    Write-Host "Please create a .env file with required variables"
    exit 1
}

Write-Success ".env file found"
Write-Host ""

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

# Check Node.js version
Write-Host "📦 Checking Node.js version..."
$nodeVersion = node -v
Write-Host "Node.js version: $nodeVersion"
Write-Success "Node.js is installed"
Write-Host ""

# Check npm version
Write-Host "📦 Checking npm version..."
$npmVersion = npm -v
Write-Host "npm version: $npmVersion"
Write-Success "npm is installed"
Write-Host ""

# Install dependencies
Write-Host "📥 Installing dependencies..."
npm install
Write-Success "Dependencies installed"
Write-Host ""

# Build frontend
Write-Host "🔨 Building frontend..."
npm run build --workspace @mawu/web
if (Test-Path "apps\web\dist") {
    Write-Success "Frontend build successful"
    Write-Host "Build output: apps\web\dist"
} else {
    Write-Error-Message "Frontend build failed - dist directory not found"
    exit 1
}
Write-Host ""

# Build backend
Write-Host "🔨 Building backend..."
npm run build:server
if (Test-Path "dist\server") {
    Write-Success "Backend build successful"
    Write-Host "Build output: dist\server"
} else {
    Write-Error-Message "Backend build failed - dist\server directory not found"
    exit 1
}
Write-Host ""

# Check TypeScript compilation
Write-Host "🔍 Checking TypeScript compilation..."
if (Test-Path "dist\server\index.js") {
    Write-Success "Server entry point compiled"
} else {
    Write-Error-Message "Server entry point not found"
    exit 1
}
Write-Host ""

# Verify environment variables
Write-Host "🔍 Verifying critical environment variables..."

function Test-EnvVar {
    param($VarName)
    $value = [Environment]::GetEnvironmentVariable($VarName, "Process")
    if ([string]::IsNullOrEmpty($value)) {
        Write-Warning-Message "$VarName is not set"
        return $false
    } else {
        Write-Success "$VarName is set"
        return $true
    }
}

$allVarsSet = $true

$allVarsSet = (Test-EnvVar "DATABASE_URL") -and $allVarsSet
$allVarsSet = (Test-EnvVar "STRIPE_SECRET_KEY") -and $allVarsSet
$allVarsSet = (Test-EnvVar "VITE_STRIPE_PUBLIC_KEY") -and $allVarsSet
$allVarsSet = (Test-EnvVar "EMAIL_USER") -and $allVarsSet
$allVarsSet = (Test-EnvVar "EMAIL_PASS") -and $allVarsSet
$allVarsSet = (Test-EnvVar "SESSION_SECRET") -and $allVarsSet
$allVarsSet = (Test-EnvVar "ADMIN_EMAIL") -and $allVarsSet
$allVarsSet = (Test-EnvVar "ADMIN_PASSWORD") -and $allVarsSet

Write-Host ""

if (-not $allVarsSet) {
    Write-Warning-Message "Some environment variables are missing"
    Write-Host "The build will work, but the application may not function correctly"
} else {
    Write-Success "All critical environment variables are set"
}

Write-Host ""

# Check build sizes
Write-Host "📊 Build Statistics:"
Write-Host ""

if (Test-Path "apps\web\dist") {
    $frontendSize = (Get-ChildItem -Path "apps\web\dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host ("Frontend build size: {0:N2} MB" -f $frontendSize)
}

if (Test-Path "dist\server") {
    $backendSize = (Get-ChildItem -Path "dist\server" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host ("Backend build size: {0:N2} MB" -f $backendSize)
}

Write-Host ""

# Summary
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "📋 Verification Summary" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Success "Production build completed successfully!"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Test the build locally:"
Write-Host "     `$env:NODE_ENV='production'; npm run start:production"
Write-Host ""
Write-Host "  2. Verify the application works:"
Write-Host "     - Open http://localhost:3000 in your browser"
Write-Host "     - Test critical user flows"
Write-Host "     - Check API endpoints"
Write-Host ""
Write-Host "  3. Deploy to Coolify:"
Write-Host "     - Push changes to your repository"
Write-Host "     - Coolify will automatically build and deploy"
Write-Host ""
Write-Host "  4. Monitor the deployment:"
Write-Host "     - Check Coolify logs"
Write-Host "     - Verify health check: /api/health"
Write-Host "     - Test production functionality"
Write-Host ""
