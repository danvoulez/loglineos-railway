#!/bin/bash

echo "🔧 Configurando LogLineOS..."

# Verificar se estamos no Railway
if [ -n "$RAILWAY_ENVIRONMENT" ]; then
    echo "✅ Detectado ambiente Railway"
    export ENVIRONMENT="railway"
else
    echo "🏠 Ambiente local detectado"
    export ENVIRONMENT="local"
fi

# Configurar URLs baseado no ambiente
if [ "$ENVIRONMENT" = "railway" ]; then
    export PUBLIC_URL="https://$RAILWAY_PUBLIC_DOMAIN"
    export API_URL="$PUBLIC_URL/api"
    export STREAM_URL="wss://$RAILWAY_PUBLIC_DOMAIN/stream"
else
    export PUBLIC_URL="http://localhost:$WEB_PORT"
    export API_URL="http://localhost:$API_PORT"
    export STREAM_URL="ws://localhost:$LOGLINE_PORT/stream"
fi

echo "🌐 URLs configuradas:"
echo "   Public: $PUBLIC_URL"
echo "   API: $API_URL"
echo "   Stream: $STREAM_URL"

# Copiar binário LogLine se disponível
if [ -f "/usr/local/bin/logline" ] && [ ! -f "/usr/local/bin/logline-backup" ]; then
    echo "💾 Fazendo backup do binário LogLine original"
    cp /usr/local/bin/logline /usr/local/bin/logline-backup
fi

# Se não tiver binário, baixar ou criar simulação
if [ ! -f "/usr/local/bin/logline" ]; then
    echo "⬇️  Tentando baixar binário LogLine para Railway..."
    
    # Tentar diferentes fontes do binário
    LOGLINE_DOWNLOAD_URLS=(
        "https://github.com/voulezvous/logline/releases/latest/download/logline-linux-x64"
        "https://releases.loglineos.com/latest/logline-linux-x64"
    )
    
    for url in "${LOGLINE_DOWNLOAD_URLS[@]}"; do
        echo "Tentando: $url"
        if curl -L -o /tmp/logline "$url" 2>/dev/null; then
            chmod +x /tmp/logline
            if /tmp/logline --version 2>/dev/null; then
                echo "✅ Binário válido encontrado"
                mv /tmp/logline /usr/local/bin/logline
                break
            fi
        fi
    done
    
    # Se não conseguir baixar, criar wrapper funcional
    if [ ! -f "/usr/local/bin/logline" ]; then
        echo "⚠️  Copiando wrapper LogLine persistente"
        cp /app/logline-persistent /usr/local/bin/logline
        chmod +x /usr/local/bin/logline
    fi
fi

echo "✅ LogLine configurado: $(logline --version)"

# Verificar dependências
echo "🔍 Verificando dependências..."

# Node.js
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js não encontrado"
fi

# Python
if command -v python3 >/dev/null 2>&1; then
    echo "✅ Python: $(python3 --version)"
else
    echo "❌ Python não encontrado"
fi

# SQLite
if command -v sqlite3 >/dev/null 2>&1; then
    echo "✅ SQLite: $(sqlite3 --version)"
else
    echo "❌ SQLite não encontrado"
fi

echo "🎯 Configuração concluída!"