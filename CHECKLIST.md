# Railway Deployment Checklist

## ✅ Pre-Deployment

- [ ] GitHub repository created and code pushed
- [ ] Railway account verified (dan@danvoulez.com)
- [ ] API key available for configuration

## ✅ Railway Configuration

### Project Setup
- [ ] New project created in Railway
- [ ] GitHub repository connected
- [ ] Build settings confirmed (Dockerfile detected)

### Environment Variables
Copy from `.env.railway` file:

**Security (CHANGE THESE!):**
- [ ] `LOGLINE_JWT_SECRET` - Set unique value
- [ ] `LOGLINE_API_KEY` - Set your API key

**Core Configuration:**
- [ ] `LOGLINE_MODE=unified`
- [ ] `NODE_ENV=production`
- [ ] `WEB_PORT=$PORT`

**Performance:**
- [ ] `LOGLINE_MAX_CONCURRENT_FLOWS=100`
- [ ] `LOGLINE_TIMEOUT_SECONDS=30`
- [ ] `LOGLINE_MEMORY_LIMIT=512MB`

**Monitoring:**
- [ ] `LOGLINE_METRICS_ENABLED=true`
- [ ] `LOGLINE_LOG_LEVEL=info`

## ✅ Deployment

- [ ] First deployment triggered
- [ ] Build completed successfully
- [ ] Container started without errors
- [ ] Health check passing

## ✅ Testing

### Basic Health
- [ ] `GET /health` returns 200
- [ ] Web interface loads
- [ ] LogLine engine status shows "Running"

### API Endpoints
- [ ] `GET /api/logline/registry` returns contract list
- [ ] `POST /api/logline/emit` accepts test contracts
- [ ] `POST /api/logline/simulate` runs simulations

### WebSocket
- [ ] WebSocket connection established
- [ ] Real-time updates working

## ✅ Production Ready

### Security
- [ ] JWT secret changed from default
- [ ] API key set to production value
- [ ] CORS origins configured (if needed)

### Performance
- [ ] Memory limits appropriate
- [ ] Concurrent flow limits set
- [ ] Timeout values configured

### Monitoring
- [ ] Health checks enabled
- [ ] Metrics collection active
- [ ] Log level appropriate (info/warn)

## ✅ Documentation

- [ ] Deployment URL documented
- [ ] Environment variables documented
- [ ] API endpoints tested and documented
- [ ] Troubleshooting procedures noted

## 🚀 Go Live

- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate verified
- [ ] Final end-to-end test completed
- [ ] Monitoring alerts configured

---

**Deployment Information:**
- Account: dan@danvoulez.com
- Date: September 22, 2025
- Version: LogLineOS 1.0.0-railway