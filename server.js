const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { spawn } = require('child_process');
const WebSocket = require('ws');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const LOGLINE_PORT = process.env.LOGLINE_PORT || 4123;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota de saúde - OBRIGATÓRIA para Railway
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'LogLineOS Railway',
        version: '1.0.0',
        ports: {
            web: PORT,
            logline: LOGLINE_PORT
        },
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API para interagir com LogLine
app.post('/api/logline/emit', async (req, res) => {
    try {
        const { contract, data } = req.body;
        
        // Executar comando LogLine
        const loglineProcess = spawn('/usr/local/bin/logline', ['emit', contract], {
            input: JSON.stringify(data),
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        let output = '';
        let error = '';
        
        loglineProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        loglineProcess.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        loglineProcess.on('close', (code) => {
            if (code === 0) {
                res.json({
                    success: true,
                    output: output,
                    code: code
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error,
                    code: code
                });
            }
        });
        
        // Enviar dados para o processo
        if (data) {
            loglineProcess.stdin.write(JSON.stringify(data));
        }
        loglineProcess.stdin.end();
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// API para listar contratos
app.get('/api/logline/registry', async (req, res) => {
    try {
        const loglineProcess = spawn('/usr/local/bin/logline', ['registry', 'list']);
        
        let output = '';
        let error = '';
        
        loglineProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        loglineProcess.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        loglineProcess.on('close', (code) => {
            if (code === 0) {
                res.json({
                    success: true,
                    contracts: output.split('\n').filter(line => line.trim()),
                    code: code
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error,
                    code: code
                });
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// API para simular contratos
app.post('/api/logline/simulate', async (req, res) => {
    try {
        const { contract, data } = req.body;
        
        const loglineProcess = spawn('/usr/local/bin/logline', ['simulate', contract]);
        
        let output = '';
        let error = '';
        
        loglineProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        loglineProcess.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        loglineProcess.on('close', (code) => {
            if (code === 0) {
                res.json({
                    success: true,
                    simulation: output,
                    code: code
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error,
                    code: code
                });
            }
        });
        
        if (data) {
            loglineProcess.stdin.write(JSON.stringify(data));
        }
        loglineProcess.stdin.end();
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Página principal
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LogLineOS - Railway Deployment</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 {
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 30px;
        }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .status-card {
            background: rgba(255, 255, 255, 0.2);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
        }
        .status-card h3 {
            margin: 0 0 10px 0;
            color: #fff;
        }
        .status-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #4CAF50;
            display: inline-block;
            margin-right: 10px;
        }
        .api-section {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 15px;
            margin-top: 20px;
        }
        .endpoint {
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 10px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 LogLineOS Railway</h1>
        
        <div class="status-grid">
            <div class="status-card">
                <h3><span class="status-indicator"></span>Web Server</h3>
                <p>Status: Online</p>
                <p>Porta: ${PORT}</p>
            </div>
            <div class="status-card">
                <h3><span class="status-indicator"></span>LogLine Engine</h3>
                <p>Status: Running</p>
                <p>Porta: ${LOGLINE_PORT}</p>
            </div>
            <div class="status-card">
                <h3><span class="status-indicator"></span>Streaming</h3>
                <p>Status: Active</p>
                <p>WebSocket: Ready</p>
            </div>
        </div>
        
        <div class="api-section">
            <h2>🔌 API Endpoints</h2>
            
            <div class="endpoint">
                <strong>GET /health</strong> - Health check
                <button onclick="testEndpoint('/health')">Testar</button>
            </div>
            
            <div class="endpoint">
                <strong>POST /api/logline/emit</strong> - Emitir contrato
                <button onclick="testEmit()">Testar</button>
            </div>
            
            <div class="endpoint">
                <strong>GET /api/logline/registry</strong> - Listar contratos
                <button onclick="testEndpoint('/api/logline/registry')">Testar</button>
            </div>
            
            <div class="endpoint">
                <strong>POST /api/logline/simulate</strong> - Simular contrato
                <button onclick="testSimulate()">Testar</button>
            </div>
        </div>
        
        <div class="api-section">
            <h2>📊 Monitoramento</h2>
            <div id="logs" style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 10px; height: 200px; overflow-y: scroll; font-family: monospace; font-size: 12px;">
                <div>Sistema iniciado - ${new Date().toISOString()}</div>
                <div>LogLineOS carregado com sucesso</div>
                <div>Aguardando requisições...</div>
            </div>
        </div>
    </div>
    
    <script>
        function addLog(message) {
            const logs = document.getElementById('logs');
            const logEntry = document.createElement('div');
            logEntry.textContent = new Date().toISOString() + ' - ' + message;
            logs.appendChild(logEntry);
            logs.scrollTop = logs.scrollHeight;
        }
        
        async function testEndpoint(endpoint) {
            try {
                addLog('Testando ' + endpoint);
                const response = await fetch(endpoint);
                const data = await response.json();
                addLog('Resposta: ' + JSON.stringify(data, null, 2));
            } catch (error) {
                addLog('Erro: ' + error.message);
            }
        }
        
        async function testEmit() {
            try {
                addLog('Testando emissão de contrato');
                const response = await fetch('/api/logline/emit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contract: 'test',
                        data: { message: 'Hello LogLine!' }
                    })
                });
                const data = await response.json();
                addLog('Emit resposta: ' + JSON.stringify(data, null, 2));
            } catch (error) {
                addLog('Erro emit: ' + error.message);
            }
        }
        
        async function testSimulate() {
            try {
                addLog('Testando simulação de contrato');
                const response = await fetch('/api/logline/simulate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contract: 'test',
                        data: { test: true }
                    })
                });
                const data = await response.json();
                addLog('Simulate resposta: ' + JSON.stringify(data, null, 2));
            } catch (error) {
                addLog('Erro simulate: ' + error.message);
            }
        }
        
        // Auto-refresh de status a cada 30 segundos
        setInterval(() => {
            testEndpoint('/health');
        }, 30000);
    </script>
</body>
</html>
    `);
});

// Iniciar servidor - OBRIGATÓRIO bind em 0.0.0.0 para Railway
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 LogLineOS Web Server rodando na porta ${PORT}`);
    console.log(`🔗 Health Check: http://0.0.0.0:${PORT}/health`);
    console.log(`🎯 LogLine Engine: http://localhost:${LOGLINE_PORT}`);
    console.log(`🚀 Railway Environment: ${process.env.NODE_ENV || 'development'}`);
});

// WebSocket para streaming em tempo real
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('📡 Nova conexão WebSocket estabelecida');
    
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Conectado ao LogLineOS Stream',
        timestamp: new Date().toISOString()
    }));
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('📥 Mensagem recebida:', data);
            
            // Echo back para teste
            ws.send(JSON.stringify({
                type: 'echo',
                data: data,
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Erro processando mensagem WebSocket:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('📡 Conexão WebSocket fechada');
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM recebido, finalizando servidor...');
    server.close(() => {
        console.log('✅ Servidor finalizado graciosamente');
        process.exit(0);
    });
});

module.exports = app;