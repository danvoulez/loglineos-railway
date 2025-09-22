#!/bin/bash

echo "⚡ Iniciando LogLine Engine..."

# Configurações
LOGLINE_PORT=${LOGLINE_PORT:-4123}
LOGLINE_MODE=${LOGLINE_MODE:-unified}
LOGLINE_DATA_DIR=${LOGLINE_DATA_DIR:-/app/data}

echo "🎛️  Configurações:"
echo "   Porta: $LOGLINE_PORT"
echo "   Modo: $LOGLINE_MODE"
echo "   Dados: $LOGLINE_DATA_DIR"

# Verificar se LogLine está disponível
if ! command -v logline >/dev/null 2>&1; then
    echo "❌ LogLine não encontrado"
    exit 1
fi

echo "✅ LogLine encontrado: $(logline --version)"

# Criar diretórios necessários
mkdir -p "$LOGLINE_DATA_DIR"/{contracts,registry,flows,logs}

# Configurar argumentos baseado no modo
ARGS=""

case "$LOGLINE_MODE" in
    "unified")
        ARGS="--all --streaming --port $LOGLINE_PORT"
        echo "🔄 Modo unificado: Todos os serviços"
        ;;
    "api")
        ARGS="--api --port $LOGLINE_PORT"
        echo "🔌 Modo API apenas"
        ;;
    "streaming")
        ARGS="--streaming --port $LOGLINE_PORT"
        echo "📡 Modo streaming apenas"
        ;;
    "contracts")
        ARGS="--contracts --port $LOGLINE_PORT"
        echo "📄 Modo contratos apenas"
        ;;
    *)
        ARGS="--port $LOGLINE_PORT"
        echo "⚙️  Modo padrão"
        ;;
esac

# Adicionar configurações extras se disponíveis
if [ -n "$LOGLINE_CONFIG_FILE" ] && [ -f "$LOGLINE_CONFIG_FILE" ]; then
    ARGS="$ARGS --config $LOGLINE_CONFIG_FILE"
fi

if [ "$LOGLINE_DEBUG" = "true" ]; then
    ARGS="$ARGS --debug"
fi

if [ -n "$LOGLINE_LOG_LEVEL" ]; then
    ARGS="$ARGS --log-level $LOGLINE_LOG_LEVEL"
fi

echo "🚀 Iniciando: logline $ARGS"

# Iniciar LogLine
exec logline $ARGS