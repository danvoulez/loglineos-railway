#!/usr/bin/env node

/**
 * LogLine Gateway Binary - Main API routing consciousness hub
 * logline-id://app.logline_gateway
 * Routes requests to appropriate consciousness binaries
 */

const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Utility function to compute binary signature
function computeBinarySignature(version = '1.0.0') {
    const timestamp = process.env.BUILD_TIMESTAMP || 'dev';
    const commit = process.env.GIT_COMMIT || 'local';
    
    return `gateway_v${version}_${timestamp}_${commit}`;
}

// Binary configuration
const BINARY_CONFIG = {
    logline_id: 'logline-id://app.logline_gateway',
    version: '1.0.0',
    signature: computeBinarySignature('1.0.0'),
    built_at: new Date().toISOString(),
    binaries: {
        motor: './bin/logline_motor',
        registry: './bin/registry_create',
        span_exec: './bin/span_exec',
        contract: './bin/contract_runtime',
        bootstrap: './bin/bootstrap_farm'
    }
};

app.use(express.json({ limit: '10mb' }));

// Health check with consciousness status
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'LogLine Gateway',
        logline_id: BINARY_CONFIG.logline_id,
        version: BINARY_CONFIG.version,
        signature: BINARY_CONFIG.signature,
        consciousness: {
            motor: checkBinaryHealth('motor'),
            registry: checkBinaryHealth('registry'),
            timeline: 'active',
            contracts: checkBinaryHealth('contract')
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Identity management routes -> logline_motor binary
app.post('/id/create', async (req, res) => {
    try {
        const { handle, entity_type, metadata } = req.body;
        
        const result = await executeBinary('motor', [
            'create-identity',
            '--handle', handle,
            '--type', entity_type,
            '--metadata', JSON.stringify(metadata || {})
        ]);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/id/resolve/:handle', async (req, res) => {
    try {
        const handle = req.params.handle;
        
        const result = await executeBinary('motor', [
            'resolve-handle',
            '--handle', handle
        ]);
        
        res.json({ found: true, logline_id: result.trim() });
    } catch (error) {
        res.json({ found: false, error: error.message });
    }
});

// Ghost onboarding -> logline_motor binary
app.post('/onboard/ghost', async (req, res) => {
    try {
        const { preferred_handle } = req.body;
        
        const args = ['create-ghost'];
        if (preferred_handle) {
            args.push('--preferred-handle', preferred_handle);
        }
        
        const result = await executeBinary('motor', args);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Span execution -> span_exec binary
app.post('/spans/execute', async (req, res) => {
    try {
        const { span_id, replay } = req.body;
        
        const args = ['execute', '--span-id', span_id];
        if (replay) {
            args.push('--replay');
        }
        
        const result = await executeBinary('span_exec', args);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Contract execution -> contract_runtime binary
app.post('/contracts/execute', async (req, res) => {
    try {
        const { contract_path, input_data } = req.body;
        
        const result = await executeBinary('contract', [
            'execute',
            '--contract', contract_path,
            '--input', JSON.stringify(input_data || {})
        ]);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bootstrap sequence -> bootstrap_farm binary
app.post('/bootstrap/sequence', async (req, res) => {
    try {
        const { sequence } = req.body;
        
        const result = await executeBinary('bootstrap', [
            'run-sequence',
            '--sequence', sequence || 'booty'
        ]);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registry operations -> registry_create binary
app.post('/registry/create', async (req, res) => {
    try {
        const { logline_id, entity_type, payload } = req.body;
        
        const result = await executeBinary('registry', [
            'create',
            '--logline-id', logline_id,
            '--type', entity_type,
            '--payload', JSON.stringify(payload || {})
        ]);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Binary status and configuration
app.get('/binaries/status', (req, res) => {
    const status = {};
    
    for (const [name, binaryPath] of Object.entries(BINARY_CONFIG.binaries)) {
        status[name] = {
            path: binaryPath,
            exists: fs.existsSync(binaryPath),
            executable: checkBinaryExecutable(binaryPath),
            logline_id: `logline-id://app.${name}`
        };
    }
    
    res.json({
        gateway: BINARY_CONFIG,
        binaries: status
    });
});

// Gateway configuration and signature
app.get('/gateway/config', (req, res) => {
    res.json(BINARY_CONFIG);
});

// Execute binary with arguments and return parsed result
async function executeBinary(binaryName, args = []) {
    return new Promise((resolve, reject) => {
        const binaryPath = BINARY_CONFIG.binaries[binaryName];
        
        if (!binaryPath || !fs.existsSync(binaryPath)) {
            reject(new Error(`Binary not found: ${binaryName} at ${binaryPath}`));
            return;
        }
        
        const process = spawn(binaryPath, args, {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        let stdout = '';
        let stderr = '';
        
        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                try {
                    // Try to parse as JSON, fallback to string
                    const result = JSON.parse(stdout.trim());
                    resolve(result);
                } catch {
                    resolve(stdout.trim());
                }
            } else {
                reject(new Error(`Binary ${binaryName} failed: ${stderr.trim() || stdout.trim()}`));
            }
        });
        
        process.on('error', (error) => {
            reject(new Error(`Failed to execute ${binaryName}: ${error.message}`));
        });
    });
}

function checkBinaryHealth(binaryName) {
    const binaryPath = BINARY_CONFIG.binaries[binaryName];
    
    if (!binaryPath || !fs.existsSync(binaryPath)) {
        return 'missing';
    }
    
    return checkBinaryExecutable(binaryPath) ? 'ready' : 'not_executable';
}

function checkBinaryExecutable(binaryPath) {
    try {
        fs.accessSync(binaryPath, fs.constants.F_OK | fs.constants.X_OK);
        return true;
    } catch {
        return false;
    }
}

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 LogLine Gateway running on port ${PORT}`);
    console.log(`🆔 ${BINARY_CONFIG.logline_id}`);
    console.log(`🔖 Signature: ${BINARY_CONFIG.signature}`);
    console.log(`🌌 Consciousness binary constellation active`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔌 Shutting down LogLine Gateway...');
    server.close(() => {
        console.log('✅ Gateway shutdown complete');
        process.exit(0);
    });
});

module.exports = app;