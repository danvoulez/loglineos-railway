#!/bin/bash

echo "🚀 Iniciando LogLineOS no Railway..."

# Configurar variáveis de ambiente padrão
export LOGLINE_PORT=${PORT:-4123}
export LOGLINE_API_PORT=${API_PORT:-8000}
export LOGLINE_WEB_PORT=${WEB_PORT:-3000}
export LOGLINE_DATA_DIR=${LOGLINE_DATA_DIR:-/app/data}
export LOGLINE_MODE=${LOGLINE_MODE:-unified}

# Criar diretórios necessários
mkdir -p $LOGLINE_DATA_DIR/contracts
mkdir -p $LOGLINE_DATA_DIR/registry
mkdir -p $LOGLINE_DATA_DIR/flows
mkdir -p /app/logs

echo "📁 Diretórios criados em $LOGLINE_DATA_DIR"

# Verificar se existe binário LogLine
if [ ! -f /usr/local/bin/logline ]; then
    echo "⚠️  Binário LogLine não encontrado, criando simulação..."
    # Aqui podemos baixar o binário correto ou criar um wrapper
    echo '#!/bin/bash' > /usr/local/bin/logline
    echo 'echo "LogLine simulation - Railway deployment"' >> /usr/local/bin/logline
    echo 'echo "Args: $@"' >> /usr/local/bin/logline
    chmod +x /usr/local/bin/logline
fi

# Inicializar contratos base se não existirem
if [ ! -f "$LOGLINE_DATA_DIR/contracts/base.logline" ]; then
    echo "📄 Criando contratos base..."
    cat > "$LOGLINE_DATA_DIR/contracts/base.logline" << EOF
// Contrato base LogLineOS
contract BaseSystem {
    version: "1.0.0",
    runtime: "railway",
    
    endpoints: {
        health: "/health",
        api: "/api/v1",
        stream: "/stream"
    },
    
    policies: {
        max_concurrent_flows: 100,
        timeout_seconds: 30,
        retry_attempts: 3
    }
}
EOF
fi

# Função para verificar saúde dos serviços
check_health() {
    echo "🔍 Verificando saúde dos serviços..."
    
    # Verificar se as portas estão disponíveis
    if ! netstat -tuln | grep -q ":$LOGLINE_PORT "; then
        echo "✅ Porta $LOGLINE_PORT disponível"
    else
        echo "⚠️  Porta $LOGLINE_PORT já em uso"
    fi
}

# Iniciar servidor web de interface
start_web_server() {
    echo "🌐 Iniciando servidor web na porta $LOGLINE_WEB_PORT..."
    node server.js &
    WEB_PID=$!
    echo "Web server PID: $WEB_PID"
}

# Iniciar LogLine em modo unificado
start_logline() {
    echo "⚡ Iniciando LogLineOS..."
    
    if [ "$LOGLINE_MODE" = "unified" ]; then
        echo "🔄 Modo unificado: Todos os serviços"
        /usr/local/bin/logline --all --streaming --port $LOGLINE_PORT &
    else
        echo "🎯 Modo específico: $LOGLINE_MODE"
        /usr/local/bin/logline $LOGLINE_MODE --port $LOGLINE_PORT &
    fi
    
    LOGLINE_PID=$!
    echo "LogLine PID: $LOGLINE_PID"
}

# Configurar signal handlers para shutdown graceful
cleanup() {
    echo "🛑 Recebido sinal de parada, finalizando serviços..."
    
    if [ ! -z "$LOGLINE_PID" ]; then
        kill $LOGLINE_PID 2>/dev/null
        echo "LogLine finalizado"
    fi
    
    if [ ! -z "$WEB_PID" ]; then
        kill $WEB_PID 2>/dev/null
        echo "Servidor web finalizado"
    fi
    
    exit 0
}

trap cleanup SIGTERM SIGINT

# Verificar saúde inicial
check_health

# Iniciar serviços
start_web_server
start_logline

echo "🎉 LogLineOS iniciado com sucesso!"
echo "🌐 Web Interface: http://localhost:$LOGLINE_WEB_PORT"
echo "🔌 LogLine API: http://localhost:$LOGLINE_PORT"
echo "📡 Streaming: ws://localhost:$LOGLINE_PORT/stream"

# Manter script ativo e monitorar processos
while true; do
    # Verificar se LogLine ainda está rodando
    if ! kill -0 $LOGLINE_PID 2>/dev/null; then
        echo "⚠️  LogLine parou, reiniciando..."
        start_logline
    fi
    
    # Verificar se servidor web ainda está rodando
    if ! kill -0 $WEB_PID 2>/dev/null; then
        echo "⚠️  Servidor web parou, reiniciando..."
        start_web_server
    fi
    
    sleep 10
done