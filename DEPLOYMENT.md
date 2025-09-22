# LogLineOS - Railway Deployment Guide

## 🚀 Deployment Information

- **Railway Account:** dan@danvoulez.com
- **Project Name:** LogLineOS Railway
- **Repository:** This current directory structure

## 📋 Prerequisites

1. **Railway Account**: Logged in as `dan@danvoulez.com`
2. **API Key**: Available for Railway CLI (if needed)
3. **GitHub Repository**: Code pushed to a GitHub repository

## 🔧 Required Environment Variables

Configure these variables in Railway Dashboard:

### Core LogLineOS Settings
```bash
# Modo de operação
LOGLINE_MODE=unified

# Portas (Railway automatically assigns PORT)
LOGLINE_PORT=4123
API_PORT=8000
WEB_PORT=$PORT

# Diretórios
LOGLINE_DATA_DIR=/app/data
LOGLINE_CONTRACTS_DIR=/app/data/contracts
LOGLINE_LOGS_DIR=/app/logs
```

### Security & Authentication
```bash
# JWT Configuration
LOGLINE_JWT_SECRET=your-super-secret-jwt-key-change-this
LOGLINE_API_KEY=your-api-key-change-this

# CORS Configuration
LOGLINE_CORS_ORIGINS=*
```

### Performance & Limits
```bash
# Resource Limits
LOGLINE_MAX_CONCURRENT_FLOWS=100
LOGLINE_TIMEOUT_SECONDS=30
LOGLINE_RETRY_ATTEMPTS=3
LOGLINE_MEMORY_LIMIT=512MB
```

### Monitoring & Logging
```bash
# Health & Monitoring
LOGLINE_HEALTH_CHECK_INTERVAL=30
LOGLINE_METRICS_ENABLED=true
LOGLINE_DEBUG=false
LOGLINE_LOG_LEVEL=info
```

### Railway Specific
```bash
# Railway Environment
RAILWAY_ENVIRONMENT=production
NODE_ENV=production

# Auto-assigned by Railway
# PORT=<assigned-by-railway>
# RAILWAY_PUBLIC_DOMAIN=<auto-assigned>
# RAILWAY_PRIVATE_DOMAIN=<auto-assigned>
```

## 🚢 Deployment Steps

### Step 1: Prepare Repository
```bash
# 1. Initialize git repository (if not done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial LogLineOS Railway deployment"

# 4. Add remote and push
git remote add origin https://github.com/yourusername/loglineos-railway.git
git push -u origin main
```

### Step 2: Deploy to Railway

#### Option A: Using Railway Dashboard
1. **Login to Railway**: https://railway.app
   - Email: `dan@danvoulez.com`

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Build**:
   - Railway will automatically detect the Dockerfile
   - Build Command: `Automatic (Docker)`
   - Start Command: `./start.sh`

4. **Set Environment Variables**:
   Copy and paste the environment variables listed above in the Railway dashboard

#### Option B: Using Railway CLI
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up
```

### Step 3: Configure Custom Domain (Optional)
1. In Railway dashboard, go to your service
2. Click "Settings" → "Domains"
3. Add your custom domain if needed

## 🔍 Verification Steps

After deployment, verify these endpoints:

### Health Check
```bash
curl https://your-railway-domain.railway.app/health
```
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-09-22T...",
  "service": "LogLineOS Railway",
  "version": "1.0.0",
  "ports": {
    "web": 3000,
    "logline": 4123
  }
}
```

### LogLine API Tests
```bash
# List contracts
curl https://your-railway-domain.railway.app/api/logline/registry

# Emit test contract
curl -X POST https://your-railway-domain.railway.app/api/logline/emit \
  -H "Content-Type: application/json" \
  -d '{"contract": "test", "data": {"message": "Hello LogLine!"}}'

# Simulate contract
curl -X POST https://your-railway-domain.railway.app/api/logline/simulate \
  -H "Content-Type: application/json" \
  -d '{"contract": "test", "data": {"test": true}}'
```

### Web Interface
Visit: `https://your-railway-domain.railway.app`

## 🔧 Troubleshooting

### Common Issues

#### 1. Container Fails to Start
- **Check Logs**: Railway Dashboard → Deployments → View Logs
- **Verify Environment Variables**: Ensure all required vars are set
- **Port Configuration**: Make sure `WEB_PORT=$PORT` is set

#### 2. LogLine Binary Not Found
The system will automatically:
1. Try to download the correct binary
2. Fall back to a functional wrapper
3. Log the process in startup logs

#### 3. Health Check Fails
- **Check Port Binding**: Ensure server binds to `0.0.0.0:$PORT`
- **Verify Routes**: Confirm `/health` endpoint is accessible
- **Environment**: Check if all environment variables are loaded

#### 4. API Endpoints Not Working
- **LogLine Service**: Check if LogLine service is running
- **Permissions**: Verify script execution permissions
- **Logs**: Check both web server and LogLine logs

### Debug Commands
```bash
# Check Railway logs
railway logs

# Check specific service logs
railway logs --service <service-name>

# Connect to container (if needed)
railway shell
```

## 📊 Monitoring & Maintenance

### Available Endpoints for Monitoring
- **Health Check**: `/health`
- **Metrics**: Built into LogLine service
- **Logs**: Streamed to Railway dashboard

### Performance Monitoring
- Railway provides built-in metrics
- Custom LogLine metrics available through the API
- WebSocket streaming for real-time monitoring

### Scaling
Railway auto-scales based on usage, but you can configure:
- **Memory Limits**: Adjust `LOGLINE_MEMORY_LIMIT`
- **Concurrent Flows**: Adjust `LOGLINE_MAX_CONCURRENT_FLOWS`
- **Replicas**: Configure in Railway dashboard

## 🔄 Updates & Maintenance

### Updating the Service
1. **Push changes** to your GitHub repository
2. **Railway auto-deploys** from the main branch
3. **Monitor deployment** in Railway dashboard

### Rolling Back
1. Go to Railway Dashboard → Deployments
2. Select previous successful deployment
3. Click "Redeploy"

## 🛡️ Security Best Practices

1. **Change Default Secrets**:
   - Update `LOGLINE_JWT_SECRET`
   - Update `LOGLINE_API_KEY`

2. **CORS Configuration**:
   - Set specific origins instead of `*` for production
   - Example: `LOGLINE_CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com`

3. **Environment Variables**:
   - Never commit secrets to repository
   - Use Railway's environment variable system

4. **Monitoring**:
   - Enable `LOGLINE_METRICS_ENABLED=true`
   - Set appropriate `LOGLINE_LOG_LEVEL`

## 📞 Support

- **Railway Documentation**: https://docs.railway.app
- **Railway Community**: https://discord.gg/railway
- **LogLineOS Issues**: Contact through your usual channels

---

**Account Information**:
- Railway Account: `dan@danvoulez.com`
- Deployment Date: September 22, 2025
- Version: LogLineOS 1.0.0-railway