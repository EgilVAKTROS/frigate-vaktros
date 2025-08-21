# Frigate NVR Setup Guide

This guide will help you run Frigate, an NVR with real-time object detection for IP cameras.

## Quick Start

1. **Run the setup script:**

   ```bash
   ./run-frigate.sh
   ```

2. **Access Frigate:**
   - Web Interface: http://localhost:5000
   - RTSP Streams: rtsp://localhost:8554
   - MQTT Broker: localhost:1883

## Manual Setup

If you prefer to run manually:

1. **Start the services:**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Check status:**

   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```

3. **View logs:**
   ```bash
   docker compose -f docker-compose.prod.yml logs -f frigate
   ```

## Configuration

### Adding Your Cameras

Edit `config/config.yml` and replace the example camera with your actual camera:

```yaml
cameras:
  your_camera:
    ffmpeg:
      inputs:
        - path: rtsp://username:password@camera_ip:554/stream1
          roles:
            - detect
            - record
    detect:
      height: 720
      width: 1280
      fps: 5
```

### Hardware Acceleration

For better performance, enable hardware acceleration:

**Intel (VAAPI):**

```yaml
ffmpeg:
  hwaccel_args: preset-vaapi
```

**NVIDIA:**

```yaml
ffmpeg:
  hwaccel_args: preset-nvidia-h264
```

And uncomment the GPU sections in `docker-compose.prod.yml`.

### Object Detection

For AI accelerators like Google Coral or better performance:

1. **Google Coral USB:**

   - Uncomment the USB device lines in `docker-compose.prod.yml`
   - Update detector configuration in `config/config.yml`

2. **CPU Only (default):**
   - Works out of the box but slower

## Directory Structure

```
frigate/
├── config/
│   └── config.yml           # Main configuration
├── storage/                 # Video recordings and database
├── mqtt/
│   ├── config/
│   │   └── mosquitto.conf   # MQTT broker config
│   ├── data/                # MQTT persistence
│   └── log/                 # MQTT logs
├── docker-compose.prod.yml  # Production Docker setup
└── run-frigate.sh          # Startup script
```

## Common Commands

```bash
# Start Frigate
./run-frigate.sh

# Stop Frigate
docker compose -f docker-compose.prod.yml down

# Restart Frigate
docker compose -f docker-compose.prod.yml restart

# View logs
docker compose -f docker-compose.prod.yml logs -f frigate

# Update to latest version
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

1. **Check Docker is running:**

   ```bash
   docker info
   ```

2. **Check container status:**

   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```

3. **Check logs for errors:**

   ```bash
   docker compose -f docker-compose.prod.yml logs frigate
   ```

4. **Restart services:**
   ```bash
   docker compose -f docker-compose.prod.yml restart
   ```

## Performance Tips

1. **Use hardware acceleration** for better performance
2. **Lower detection FPS** for CPU-only setups (fps: 3-5)
3. **Use substreams** for detection and main streams for recording
4. **Adjust detection zones** to focus on important areas
5. **Consider AI accelerators** like Google Coral for production use

## Home Assistant Integration

Frigate integrates well with Home Assistant:

1. Install the [Frigate Integration](https://github.com/blakeblackshear/frigate-hass-integration)
2. Configure MQTT in Home Assistant to connect to `localhost:1883`
3. Frigate will automatically create entities for cameras and detected objects

## Security Considerations

- Change default MQTT passwords in production
- Use secure camera credentials
- Consider running behind a reverse proxy for external access
- Regularly update Frigate and dependencies

For more detailed configuration options, visit: https://docs.frigate.video
