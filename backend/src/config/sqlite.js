const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../database/files.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening local SQLite database:', err.message);
  } else {
    console.log('[SQLite] Connected to files.db');
    initialize();
  }
});

function initialize() {
  db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      data BLOB NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating images table:', err.message);
    } else {
      console.log('[SQLite] Images table ready');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS chat_files (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      data BLOB NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating chat_files table:', err.message);
    } else {
      console.log('[SQLite] Chat files section ready');
    }
  });
}

module.exports = db;
