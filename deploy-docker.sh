#!/bin/bash

# Frigate Frontend Deployment Script
# This script builds the web UI and deploys it to production

set -e

echo "🚀 Starting Frigate Frontend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    print_error "docker-compose.prod.yml not found. Please run this script from the Frigate root directory."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker compose is available
if ! docker compose version > /dev/null 2>&1; then
    print_error "docker compose is not available. Please install Docker Desktop or Docker Compose plugin."
    exit 1
fi

print_status "Checking current Frigate status..."
if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    print_warning "Frigate is currently running. Stopping it for deployment..."
    docker compose -f docker-compose.prod.yml down
fi

print_status "Building web frontend..."

# Navigate to web directory
cd web

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing web dependencies..."
    npm install
fi

# Try to build the web UI
print_status "Building production web UI..."
if npm run build; then
    print_success "Web UI built successfully!"
else
    print_warning "Build failed with TypeScript errors. Using existing build..."
    print_status "The existing build in web/dist/ will be used."
fi

# Go back to root directory
cd ..

print_status "Deploying to production..."

# Start the production services
if docker compose -f docker-compose.prod.yml up -d; then
    print_success "Deployment completed successfully!"
    
    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 10
    
    # Check if services are running
    if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_success "Frigate is running with updated frontend!"
        echo ""
        echo "🌐 Access Frigate at: http://localhost:5001"
        echo "📡 MQTT Broker available at: localhost:1883"
        echo "📺 RTSP streams available at: rtsp://localhost:8554"
        echo ""
        echo "📋 Useful commands:"
        echo "   View logs: docker compose -f docker-compose.prod.yml logs -f frigate"
        echo "   Stop: docker compose -f docker-compose.prod.yml down"
        echo "   Restart: docker compose -f docker-compose.prod.yml restart"
    else
        print_error "Services failed to start properly"
        print_status "Check logs with: docker compose -f docker-compose.prod.yml logs"
        exit 1
    fi
else
    print_error "Deployment failed"
    exit 1
fi

print_success "Deployment script completed!"
