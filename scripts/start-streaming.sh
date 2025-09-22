#!/bin/bash

echo "🚀 Iniciando LogLine em modo streaming..."

# Configurar variáveis
LOGLINE_PORT=${LOGLINE_PORT:-4123}
STREAMING_MODE=${STREAMING_MODE:-full}

echo "📡 Configuração de Streaming:"
echo "   Porta: $LOGLINE_PORT"
echo "   Modo: $STREAMING_MODE"

# Verificar se LogLine está disponível
if ! command -v logline >/dev/null 2>&1; then
    echo "❌ LogLine não encontrado"
    exit 1
fi

echo "✅ LogLine encontrado: $(logline --version)"

# Iniciar streaming baseado no modo
case "$STREAMING_MODE" in
    "full")
        echo "🎯 Iniciando streaming completo (VoulezVous + Contratos)"
        logline stream --mode full --port $LOGLINE_PORT
        ;;
    "contracts")
        echo "📄 Iniciando streaming apenas de contratos"
        logline stream --mode contracts --port $LOGLINE_PORT
        ;;
    "voulezvous")
        echo "🎥 Iniciando streaming VoulezVous"
        logline stream --mode voulezvous --port $LOGLINE_PORT
        ;;
    *)
        echo "⚡ Iniciando streaming padrão"
        logline stream --port $LOGLINE_PORT
        ;;
esac