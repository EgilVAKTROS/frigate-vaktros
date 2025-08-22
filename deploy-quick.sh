#!/bin/bash

# Quick Frigate Deployment Script
# This script restarts Frigate with existing frontend build

set -e

echo "⚡ Quick Frigate Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
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

print_status "Restarting Frigate services..."

# Restart the services
if docker compose -f docker-compose.prod.yml restart; then
    print_success "Frigate restarted successfully!"
    
    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 5
    
    # Check if services are running
    if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_success "Frigate is running!"
        echo ""
        echo "🌐 Access Frigate at: http://localhost:5001"
        echo "📡 MQTT Broker available at: localhost:1883"
        echo "📺 RTSP streams available at: rtsp://localhost:8554"
    else
        print_error "Services failed to start properly"
        print_status "Check logs with: docker compose -f docker-compose.prod.yml logs"
        exit 1
    fi
else
    print_error "Restart failed"
    exit 1
fi

print_success "Quick deployment completed!"
