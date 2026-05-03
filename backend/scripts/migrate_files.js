require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'workspace-files';

// Connect to SQLite
const dbPath = path.resolve(__dirname, '../../database/files.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening local SQLite database:', err.message);
    process.exit(1);
  }
  console.log('[SQLite] Connected to files.db for migration');
});

async function uploadToSupabase(table, row) {
  try {
    const buffer = Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data);
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(row.id, buffer, {
        contentType: row.mime_type,
        upsert: true
      });

    if (error) {
      console.error(`[Error] Failed to upload ${table} file ${row.id}:`, error.message);
      return false;
    }
    
    console.log(`[Success] Uploaded ${table} file: ${row.name} (${row.id})`);
    return true;
  } catch (err) {
    console.error(`[Error] Exception uploading ${table} file ${row.id}:`, err);
    return false;
  }
}

async function migrateTable(tableName) {
  return new Promise((resolve) => {
    db.all(`SELECT * FROM ${tableName}`, async (err, rows) => {
      if (err) {
        if (err.message.includes('no such table')) {
          console.log(`Table ${tableName} does not exist. Skipping.`);
          return resolve();
        }
        console.error(`Error querying ${tableName}:`, err.message);
        return resolve();
      }

      console.log(`Found ${rows.length} files in ${tableName}. Migrating...`);
      let successCount = 0;

      for (const row of rows) {
        const success = await uploadToSupabase(tableName, row);
        if (success) successCount++;
      }

      console.log(`Finished migrating ${tableName}. Successfully uploaded ${successCount}/${rows.length} files.`);
      resolve();
    });
  });
}

async function runMigration() {
  console.log('--- Starting File Migration ---');
  await migrateTable('images');
  await migrateTable('chat_files');
  console.log('--- File Migration Complete ---');
  db.close();
}

runMigration();
