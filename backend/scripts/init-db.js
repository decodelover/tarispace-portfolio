require('dotenv').config();
const { ensureDefaults } = require('../src/bootstrap');
const pool = require('../src/db');

async function main() {
    try {
        await ensureDefaults();
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Database initialization failed:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

main();
