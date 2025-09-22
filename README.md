# LogLineOS Railway

🚀 **LogLineOS deployment optimized for Railway.app**

Deploy the complete LogLineOS ecosystem to Railway with one-click deployment.

## Features

- ⚡ **Unified LogLine Engine** - Full LogLineOS runtime
- 🌐 **Web Interface** - Beautiful management dashboard  
- 📡 **Real-time Streaming** - WebSocket support for live updates
- 🔌 **REST API** - Complete API for contract management
- 🐳 **Docker Optimized** - Efficient containerization
- 📊 **Health Monitoring** - Built-in health checks and metrics

## Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

## Manual Deployment

1. **Clone this repository**
2. **Push to your GitHub**
3. **Connect to Railway** (account: dan@danvoulez.com)
4. **Set environment variables** (see DEPLOYMENT.md)
5. **Deploy!**

## Environment Variables

```bash
LOGLINE_MODE=unified
LOGLINE_JWT_SECRET=your-secret-key
LOGLINE_API_KEY=your-api-key
NODE_ENV=production
```

## Endpoints

After deployment, your service will be available at:

- **Web Interface**: `https://your-app.railway.app/`
- **Health Check**: `https://your-app.railway.app/health`
- **API Base**: `https://your-app.railway.app/api/logline/`

## API Examples

```bash
# Health check
curl https://your-app.railway.app/health

# List contracts
curl https://your-app.railway.app/api/logline/registry

# Emit contract
curl -X POST https://your-app.railway.app/api/logline/emit \
  -H "Content-Type: application/json" \
  -d '{"contract": "test", "data": {"message": "Hello!"}}'
```

## Development

```bash
# Install dependencies
npm install

# Run locally
npm start

# With LogLine binary
./start.sh
```

## Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [API Documentation](docs/API.md) - API reference (coming soon)
- [Configuration](docs/CONFIG.md) - Configuration options (coming soon)

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Client    │────│   Node.js API    │────│  LogLine Engine │
│   (Browser)     │    │   (Express.js)   │    │   (Binary)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                       ┌────────┴────────┐
                       │   WebSocket     │
                       │   Streaming     │
                       └─────────────────┘
```

## Support

- Railway Account: `dan@danvoulez.com`
- Version: 1.0.0
- Last Updated: September 22, 2025

---

Made with ❤️ for the LogLineOS ecosystem