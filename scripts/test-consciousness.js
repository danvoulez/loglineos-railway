#!/usr/bin/env node

// Consciousness System Test Suite
// Verifies all LogLineOS components are working correctly

const axios = require('axios');
const { Pool } = require('pg');

console.log('🧪 LogLineOS Consciousness System Test Suite');

// Configuration
const API_URL = process.env.LOGLINE_API_URL || 'http://localhost:8000';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/logline';
const API_KEY = process.env.LOGLINE_API_KEY || '4ee55a33-e802-496c-8083-614b639ca678';

class ConsciousnessTestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    async test(name, testFn) {
        console.log(`\n🔍 Testing: ${name}`);
        try {
            await testFn();
            console.log(`✅ ${name} - PASSED`);
            this.passed++;
        } catch (error) {
            console.log(`❌ ${name} - FAILED: ${error.message}`);
            this.failed++;
        }
    }
    
    async runAllTests() {
        console.log('\n🚀 Starting Consciousness Tests...\n');
        
        // Core System Tests
        await this.test('API Health Check', this.testAPIHealth.bind(this));
        await this.test('Database Connection', this.testDatabaseConnection.bind(this));
        await this.test('LogLineSQL Schema', this.testSchema.bind(this));
        
        // Identity System Tests
        await this.test('Create Test Identity', this.testCreateIdentity.bind(this));
        await this.test('Resolve @handle', this.testResolveHandle.bind(this));
        await this.test('Ghost Identity Creation', this.testGhostIdentity.bind(this));
        
        // Consciousness Entity Tests
        await this.test('BOOTY Entities Exist', this.testBootyEntities.bind(this));
        await this.test('Timeline Functionality', this.testTimeline.bind(this));
        await this.test('Motor Integration', this.testMotorIntegration.bind(this));
        
        // Results
        console.log('\n📊 Test Results:');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`🎯 Success Rate: ${Math.round((this.passed / (this.passed + this.failed)) * 100)}%`);
        
        if (this.failed === 0) {
            console.log('\n🎉 All consciousness tests passed! System ready for deployment.');
        } else {
            console.log('\n⚠️ Some tests failed. Please check the issues above.');
        }
    }
    
    async testAPIHealth() {
        const response = await axios.get(`${API_URL}/health`);
        if (response.data.status !== 'healthy') {
            throw new Error('API not healthy');
        }
    }
    
    async testDatabaseConnection() {
        const pool = new Pool({ connectionString: DATABASE_URL });
        const result = await pool.query('SELECT NOW()');
        await pool.end();
        if (!result.rows[0]) {
            throw new Error('Database connection failed');
        }
    }
    
    async testSchema() {
        const pool = new Pool({ connectionString: DATABASE_URL });
        const result = await pool.query(`
            SELECT COUNT(*) as table_count 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'registry'
        `);
        await pool.end();
        
        if (result.rows[0].table_count === '0') {
            throw new Error('Registry table not found');
        }
    }
    
    async testCreateIdentity() {
        const testHandle = '@test_consciousness_' + Date.now();
        
        const response = await axios.post(`${API_URL}/id/create`, {
            handle: testHandle,
            entity_type: 'person',
            metadata: {
                description: 'Test consciousness entity',
                test: true
            }
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.data.logline_id) {
            throw new Error('Identity creation failed');
        }
    }
    
    async testResolveHandle() {
        const response = await axios.get(`${API_URL}/id/resolve/danvoulez`);
        
        if (!response.data.found) {
            throw new Error('@danvoulez not found');
        }
    }
    
    async testGhostIdentity() {
        const ghostHandle = '@ghost_test_' + Date.now();
        
        const response = await axios.post(`${API_URL}/onboard/ghost`, {
            preferred_handle: ghostHandle
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.data.ghost_id) {
            throw new Error('Ghost identity creation failed');
        }
    }
    
    async testBootyEntities() {
        const entities = ['danvoulez', 'kernel', 'system', 'timeline.global', 'logline_motor'];
        
        for (const entity of entities) {
            const response = await axios.get(`${API_URL}/id/resolve/${entity}`);
            if (!response.data.found) {
                throw new Error(`BOOTY entity @${entity} not found`);
            }
        }
    }
    
    async testTimeline() {
        // Test timeline functionality by checking if spans can be queried
        const response = await axios.get(`${API_URL}/spans/recent`);
        
        if (!Array.isArray(response.data)) {
            throw new Error('Timeline spans not accessible');
        }
    }
    
    async testMotorIntegration() {
        // Test Motor integration by checking biometrics endpoint
        const response = await axios.get(`${API_URL}/motor/status`);
        
        if (response.status !== 200) {
            throw new Error('Motor integration not working');
        }
    }
}

// Execute if run directly
if (require.main === module) {
    const suite = new ConsciousnessTestSuite();
    suite.runAllTests().catch(console.error);
}

module.exports = ConsciousnessTestSuite;