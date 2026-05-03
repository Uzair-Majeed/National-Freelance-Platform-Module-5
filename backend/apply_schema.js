require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function applySchema() {
  try {
    console.log('--- Applying Legacy Schema (Integers) ---');
    const schemaPath = path.resolve(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);
    console.log('[Success] Schema applied successfully!');
  } catch (err) {
    console.error('[Error] Failed to apply schema:', err.message);
  } finally {
    await pool.end();
  }
}

applySchema();
