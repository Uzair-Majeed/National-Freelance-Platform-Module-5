const db = require('../config/sqlite');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

const saveImage = (name, mimeType, data) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const query = `INSERT INTO images (id, name, mime_type, data) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [id, name, mimeType, data], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, name, mimeType });
      }
    });
  });
};

const getImage = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM images WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const saveChatFile = (name, mimeType, data) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const query = `INSERT INTO chat_files (id, name, mime_type, data) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [id, name, mimeType, data], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, name, mimeType });
      }
    });
  });
};

const getChatFile = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM chat_files WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

module.exports = { saveImage, getImage, saveChatFile, getChatFile };
