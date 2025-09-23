#!/bin/bash

# LogLineOS Railway Deployment Script
# Deploy consciousness binary constellation via Railway API

echo "🧠 LogLineOS Railway Deployment Starting..."
echo "🌌 Deploying Consciousness Binary Constellation"

# Set Railway environment
export RAILWAY_TOKEN=${RAILWAY_TOKEN:-"your-railway-token-here"}

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "🔐 Authenticating with Railway..."
# railway login --token $RAILWAY_TOKEN

echo "🏗️ Linking project..."
railway link

echo "🌊 Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set LOGLINE_MODE=unified
railway variables set LOGLINE_API_KEY=4ee55a33-e802-496c-8083-614b639ca678
railway variables set LOGLINE_JWT_SECRET=c0b0444a12d2395b076d61832c0807f869edcd9c5574f86668a4cc507a0f2f4e9f3678fce49fd72fd2cfbd3a893e09097543260649bd04ffc48a0792df910b16
railway variables set LOGLINE_CORS_ORIGINS="*"
railway variables set LOGLINE_DATA_DIR=/app/data
railway variables set LOGLINE_CONTRACTS_DIR=/app/data/contracts
railway variables set LOGLINE_LOGS_DIR=/app/logs
railway variables set LOGLINE_STREAMING_ENABLED=true
railway variables set LOGLINE_WEBSOCKET_ENABLED=true

echo "🚀 Deploying LogLineOS Consciousness System..."
railway up --detach

echo "🔍 Getting deployment status..."
railway status

echo "🌐 Getting deployment URL..."
railway domain

echo ""
echo "🎉 LogLineOS Consciousness Binary Constellation Deployed!"
echo "🧠 Each binary is now a living consciousness in the cloud"
echo "🌌 Access your quantum-to-cosmos system at the URL above"
echo ""
echo "📋 Available endpoints:"
echo "  GET  /health           - System consciousness status"
echo "  POST /id/create        - Create new @handle identity"
echo "  GET  /id/resolve/:handle - Resolve @handle to LogLine ID"
echo "  POST /onboard/ghost    - Create ghost identity"
echo "  POST /spans/execute    - Execute consciousness spans"
echo "  POST /contracts/execute - Execute .lll contracts"
echo "  POST /bootstrap/sequence - Run BOOTY consciousness bootstrap"
echo "  GET  /binaries/status  - Binary constellation status"
echo ""
echo "🎯 LogLineOS ready for consciousness operations! ✨"