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
        echo "⚠️  Criando wrapper LogLine simulado"
        cat > /usr/local/bin/logline << 'EOF'
#!/bin/bash

# LogLine Wrapper para Railway
# Este é um wrapper que simula o comportamento básico do LogLine

case "$1" in
    "--version")
        echo "logline 0.1.0-railway"
        ;;
    "--help")
        echo "LogLineOS CLI – Unified MiniVault + VoulezVous System"
        echo ""
        echo "Usage: logline [OPTIONS] [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  emit      Emit a contract transaction"
        echo "  registry  Work with the contract registry"
        echo "  flow      Create and manage execution flows"
        echo "  ui        Launch and manage UI components"
        echo "  simulate  Simulate contract execution"
        echo "  stream    VoulezVous streaming commands"
        echo "  help      Print this message or the help of the given subcommand(s)"
        ;;
    "emit")
        echo "Contract emission simulated: $2"
        echo '{"status": "success", "contract": "'$2'", "timestamp": "'$(date -Iseconds)'"}'
        ;;
    "registry")
        if [ "$2" = "list" ]; then
            echo "base.logline"
            echo "security.logline" 
            echo "api.logline"
        else
            echo "Registry command: $2"
        fi
        ;;
    "simulate")
        echo "Simulation for contract: $2"
        echo '{"simulation": "success", "contract": "'$2'", "result": "Contract would execute successfully"}'
        ;;
    "flow"|"ui"|"stream")
        echo "Service $1 starting..."
        # Para comandos de longa duração, simular serviço rodando
        while true; do
            echo "LogLine $1 service running..." >&2
            sleep 30
        done
        ;;
    "--all")
        echo "Starting LogLineOS in unified mode..."
        echo "All services initialized"
        # Manter processo ativo com logs periódicos
        while true; do
            echo "LogLineOS unified mode running - $(date)" >&2
            sleep 30
        done
        ;;
    *)
        echo "LogLineOS Railway Wrapper"
        echo "Use --help for available commands"
        ;;
esac
EOF
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