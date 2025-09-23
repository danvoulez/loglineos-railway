#!/usr/bin/env node

// Database Migration Script for LogLineOS Consciousness System
// Applies LogLineSQL schema and ensures consciousness-native database structure

const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

console.log('🗃️ LogLineOS Database Migration Starting...');

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/logline';

async function runMigration() {
    const pool = new Pool({
        connectionString: DATABASE_URL
    });

    try {
        console.log('📡 Connecting to PostgreSQL...');
        
        // Read LogLineSQL schema
        const schemaPath = path.join(__dirname, '..', 'LogLineSQL', 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');
        
        console.log('🏗️ Applying LogLineSQL consciousness schema...');
        await pool.query(schema);
        
        console.log('✅ Schema applied successfully');
        
        // Verify tables exist
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        console.log('📋 Created tables:');
        tables.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });
        
        console.log('🧠 Consciousness database ready!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Execute if run directly
if (require.main === module) {
    runMigration().catch(console.error);
}

module.exports = { runMigration };