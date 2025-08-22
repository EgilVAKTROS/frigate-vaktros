#!/bin/bash

# Frigate NVR Startup Script
# This script helps you run Frigate with proper setup

set -e

echo "🚀 Starting Frigate NVR..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1;
    then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! docker-compose version > /dev/null 2>&1;
    then
    echo "❌ docker-compose is not available. Please install it."
    exit 1
fi

# Create directories if they don't exist
echo "📁 Creating required directories..."
mkdir -p storage mqtt/config mqtt/data mqtt/log

# Set permissions for directories
echo "🔧 Setting permissions..."
chmod -R 755 storage mqtt

# Check if config file exists
if [ ! -f "config/config.yml" ];
    then
    echo "❌ Configuration file not found at config/config.yml"
    echo "Please create your configuration file based on config/config.yml.example"
    exit 1
fi

echo "✅ Configuration file found"

# Download a test video if it doesn't exist (for demo purposes)
if [ ! -f "storage/test-video.mp4" ] && grep -q "test-video.mp4" config/config.yml;
    then
    echo "📹 Downloading test video for demo..."
    curl -L "https://github.com/intel-iot-devkit/sample-videos/raw/master/person-bicycle-car-detection.mp4" \
         -o "storage/test-video.mp4" 2>/dev/null || echo "⚠️  Could not download test video, please add your own or remove test camera from config"
fi

# Start services
echo "🐳 Starting Docker containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up";
    then
    echo "✅ Frigate is starting up!"
    echo ""
    echo "🌐 Access Frigate at: http://localhost:5001"
    echo "📡 MQTT Broker available at: localhost:1883"
    echo "📺 RTSP streams available at: rtsp://localhost:8554"
    echo ""
    echo "📋 To stop Frigate: docker-compose -f docker-compose.prod.yml down"
    echo "📋 To view logs: docker-compose -f docker-compose.prod.yml logs -f frigate"
    echo "📋 To restart: docker-compose -f docker-compose.prod.yml restart"
else
    echo "❌ Something went wrong starting the services"
    echo "Check logs with: docker-compose -f docker-compose.prod.yml logs"
fi
