const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const { Pool } = require('pg');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const LOGLINE_PORT = process.env.LOGLINE_PORT || 4123;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/logline'
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.LOGLINE_CORS_ORIGINS || '*',
    credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Consciousness System Routes

// Health Check - REQUIRED for Railway
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'LogLineOS Consciousness System',
        version: '1.0.0',
        ports: {
            web: PORT,
            logline: LOGLINE_PORT
        },
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        consciousness: {
            database: 'connected',
            motor: 'running',
            timeline: 'active'
        }
    });
});

// LogLine ID Management
app.post('/id/create', async (req, res) => {
    try {
        const { handle, entity_type, metadata } = req.body;
        
        // Validate entity type
        const validTypes = ['person', 'object', 'contract', 'rule', 'timeline', 'app', 'flow'];
        if (!validTypes.includes(entity_type)) {
            return res.status(400).json({ error: 'Invalid entity type' });
        }
        
        // Create LogLine ID
        const logline_id = `logline-id://${entity_type}.${handle.replace('@', '')}`;
        const created_at = new Date().toISOString();
        
        // Store in consciousness database
        await pool.query(`
            INSERT INTO registry (logline_id, entity_type, handle, metadata, created_at, status)
            VALUES ($1, $2, $3, $4, $5, 'active')
        `, [logline_id, entity_type, handle, JSON.stringify(metadata), created_at]);
        
        res.json({
            logline_id,
            handle,
            entity_type,
            created_at,
            status: 'created'
        });
        
    } catch (error) {
        console.error('Error creating identity:', error);
        res.status(500).json({ error: 'Failed to create identity' });
    }
});

// Resolve @handle to LogLine ID
app.get('/id/resolve/:handle', async (req, res) => {
    try {
        const handle = req.params.handle.startsWith('@') ? req.params.handle : `@${req.params.handle}`;
        
        const result = await pool.query(`
            SELECT * FROM get_latest_registry() 
            WHERE handle = $1 AND status = 'active'
        `, [handle]);
        
        if (result.rows.length === 0) {
            return res.json({ found: false });
        }
        
        const entity = result.rows[0];
        res.json({
            found: true,
            logline_id: entity.logline_id,
            handle: entity.handle,
            entity_type: entity.entity_type,
            metadata: entity.metadata,
            created_at: entity.created_at
        });
        
    } catch (error) {
        console.error('Error resolving handle:', error);
        res.status(500).json({ error: 'Failed to resolve handle' });
    }
});

// Ghost Onboarding
app.post('/onboard/ghost', async (req, res) => {
    try {
        const { preferred_handle } = req.body;
        const ghost_id = `ghost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
        
        // Create ghost identity
        const logline_id = `logline-id://person.${ghost_id}`;
        const handle = preferred_handle || `@${ghost_id}`;
        
        await pool.query(`
            INSERT INTO registry (logline_id, entity_type, handle, metadata, created_at, status)
            VALUES ($1, 'person', $2, $3, $4, 'ghost')
        `, [
            logline_id, 
            handle, 
            JSON.stringify({ ghost: true, expiration, preferred_handle }), 
            new Date().toISOString()
        ]);
        
        res.json({
            ghost_id,
            handle,
            logline_id,
            expiration,
            status: 'ghost_created'
        });
        
    } catch (error) {
        console.error('Error creating ghost:', error);
        res.status(500).json({ error: 'Failed to create ghost identity' });
    }
});

// Timeline Spans
app.get('/spans/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        
        const result = await pool.query(`
            SELECT * FROM registry 
            WHERE status = 'active' 
            ORDER BY created_at DESC 
            LIMIT $1
        `, [limit]);
        
        res.json(result.rows);
        
    } catch (error) {
        console.error('Error fetching spans:', error);
        res.status(500).json({ error: 'Failed to fetch spans' });
    }
});

// Motor Status
app.get('/motor/status', (req, res) => {
    res.json({
        status: 'running',
        components: {
            biometria: 'active',
            ghost: 'active',
            federation: 'active',
            resolver: 'active'
        },
        uptime: process.uptime()
    });
});

// API for interacting with LogLine
app.post('/api/logline/emit', async (req, res) => {
    try {
        const { contract, data } = req.body;
        
        // Execute command LogLine
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
                    contract: contract
                });
            } else {
                res.status(500).json({ 
                    success: false, 
                    error: error,
                    code: code
                });
            }
        });
        
        // Send data to process
        if (data) {
            loglineProcess.stdin.write(JSON.stringify(data));
            loglineProcess.stdin.end();
        }
        
    } catch (error) {
        console.error('LogLine execution error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// WebSocket for real-time consciousness updates
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 LogLineOS Consciousness System running on port ${PORT}`);
    console.log(`🌌 Quantum-to-Cosmos operations enabled`);
    console.log(`🚀 Access at: http://localhost:${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('🔗 New consciousness connection established');
    
    ws.send(JSON.stringify({
        type: 'consciousness_connected',
        timestamp: new Date().toISOString(),
        system: 'LogLineOS'
    }));
    
    ws.on('close', () => {
        console.log('🔌 Consciousness connection closed');
    });
});

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

module.exports = app;
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