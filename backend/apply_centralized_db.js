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

async function applyCentralizedDb() {
  const client = await pool.connect();
  try {
    console.log('--- Wiping Existing Public Schema ---');
    await client.query('DROP SCHEMA public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('GRANT ALL ON SCHEMA public TO postgres');
    await client.query('GRANT ALL ON SCHEMA public TO public');
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    console.log('--- Applying Full Centralized Schema ---');
    const schemaPath = path.resolve(__dirname, '../database/SPM_Centralized_Db.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schema);
    
    console.log('[Success] Full Centralized Schema applied!');

    console.log('--- Seeding Minimal Integration Data ---');
    await client.query('SET session_replication_role = \'replica\'');

    // 1. Seed Users
    const users = [
      { id: 1, email: 'uzairmjd886@gmail.com', first_name: 'Uzair', last_name: '(Admin)', role: 'admin' },
      { id: 2, email: 'i233063@isb.nu.edu.pk', first_name: 'Member', last_name: '1', role: 'freelancer' },
      { id: 3, email: 'narrator886@gmail.com', first_name: 'Member', last_name: '2', role: 'freelancer' },
      { id: 4, email: 'test@example.com', first_name: 'Test', last_name: 'User', role: 'freelancer' }
    ];

    for (const u of users) {
      await client.query(
        'INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES ($1, $2, \'dummy\', $3, $4, $5)',
        [u.id, u.email, u.first_name, u.last_name, u.role]
      );
    }

    // 2. Seed 5 Projects
    const projects = [
      { id: 1, title: 'Centralized Alpha', desc: 'First integrated project' },
      { id: 2, title: 'Beta Systems', desc: 'Second integrated project' },
      { id: 3, title: 'Gamma Network', desc: 'Third integrated project' },
      { id: 4, title: 'Delta Force', desc: 'Fourth integrated project' },
      { id: 5, title: 'Epsilon Core', desc: 'Fifth integrated project' }
    ];

    for (const p of projects) {
      await client.query(`
        INSERT INTO projects (id, title, description, client_id, freelancer_id, job_id, bid_id, start_date, deadline, agreed_amount)
        VALUES ($1, $2, $3, 1, 2, $4, $5, CURRENT_DATE, CURRENT_DATE + 30, 1000)
      `, [p.id, p.title, p.desc, p.id, p.id]);
    }

    await client.query('SET session_replication_role = \'origin\'');

    // 3. Sync Sequences (CRITICAL for SERIAL columns)
    console.log('--- Synchronizing ID Sequences ---');
    await client.query("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");
    await client.query("SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects))");

    console.log('[Success] Integration data seeded and sequences synced!');

  } catch (err) {
    console.error('[Error] Failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

applyCentralizedDb();
