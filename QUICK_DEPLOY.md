# Railway 2025 Deployment - Quick Commands

## ✅ Via GitHub (Recomendado)
```bash
# 1. Inicializar repositório
git init
git add .
git commit -m "LogLineOS Railway deployment"

# 2. Conectar GitHub
git remote add origin https://github.com/SEU_USUARIO/loglineos-railway.git
git push -u origin main

# 3. No Railway Dashboard:
# - Login: dan@danvoulez.com
# - New Project → Deploy from GitHub repo
# - Selecionar repositório
# - Copiar variáveis de .env.railway
```

## ⚡ Via CLI (Alternativo)
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Criar projeto
railway init

# 4. Deploy
railway up
```

## 🔧 Variáveis Críticas (Railway Dashboard)
```bash
# SEGURAN﻿ÇA (OBRIGATÓRIAS)
LOGLINE_JWT_SECRET=c0b0444a12d2395b076d61832c0807f869edcd9c5574f86668a4cc507a0f2f4e9f3678fce49fd72fd2cfbd3a893e09097543260649bd04ffc48a0792df910b16
LOGLINE_API_KEY=4ee55a33-e802-496c-8083-614b639ca678

# CONFIGURAÇÃO BÁSICA
NODE_ENV=production
LOGLINE_MODE=unified

# PERFORMANCE
LOGLINE_MAX_CONCURRENT_FLOWS=100
LOGLINE_TIMEOUT_SECONDS=30
```

## 🎯 Endpoints de Teste
```bash
# Health (OBRIGATÓRIO)
curl https://seu-app.railway.app/health

# API Test
curl https://seu-app.railway.app/api/logline/registry

# Interface Web
https://seu-app.railway.app/
```

## ⚠️ Railway 2025 - Pontos Críticos
- ✅ Health check em `/health` (OBRIGATÓRIO)
- ✅ Bind em `0.0.0.0:$PORT` (PORT automático)
- ✅ Dockerfile otimizado
- ✅ GitHub integration configurada
- ✅ Variáveis de ambiente corretas