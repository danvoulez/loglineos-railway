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

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 LogLineOS Consciousness System running on port ${PORT}`);
    console.log(`🌌 Quantum-to-Cosmos operations enabled`);
    console.log(`🚀 Access at: http://localhost:${PORT}`);
});

// WebSocket server for real-time consciousness updates
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