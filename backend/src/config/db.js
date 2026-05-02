const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'freelance_platform',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' || process.env.DB_HOST.includes('supabase.co') 
    ? { rejectUnauthorized: false } 
    : false
});

pool.on('connect', () => {
  console.log('[Database] Connected successfully to Supabase');
});

pool.on('error', (err) => {
  console.error('[Database] Unexpected error on idle client:', err.message);
  // Do NOT exit here, let the server try to recover or stay up for other routes
});

module.exports = pool;
