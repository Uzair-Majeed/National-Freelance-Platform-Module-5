require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function seedUsers() {
  try {
    console.log('--- Seeding Mock Users ---');
    
    // Minimal users table if it doesn't exist (centralized schema has it, but just in case)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uuid UUID UNIQUE DEFAULT gen_random_uuid(),
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) DEFAULT 'dummy',
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        role VARCHAR(20) DEFAULT 'freelancer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const users = [
      { id: 1, email: 'uzairmjd886@gmail.com', first_name: 'Uzair', last_name: '(Admin)', role: 'admin' },
      { id: 2, email: 'i233063@isb.nu.edu.pk', first_name: 'Member', last_name: '1', role: 'freelancer' },
      { id: 3, email: 'narrator886@gmail.com', first_name: 'Member', last_name: '2', role: 'freelancer' }
    ];

    for (const u of users) {
      await pool.query(
        'INSERT INTO users (id, email, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email',
        [u.id, u.email, u.first_name, u.last_name, u.role]
      );
    }

    console.log('[Success] Mock users seeded!');
  } catch (err) {
    console.error('[Error] Failed to seed users:', err.message);
  } finally {
    await pool.end();
  }
}

seedUsers();
