const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
let SQL = null;

async function initDatabase() {
  SQL = await initSqlJs();
  
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/anime_platform.db');
  const dbDir = path.dirname(dbPath);
  
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA foreign_keys = ON');
  
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

function setDb(database) {
  db = database;
}

function prepare(sql) {
  const database = getDb();
  const stmt = database.prepare(sql);
  return {
    get: (...params) => stmt.get(...params),
    all: (...params) => stmt.all(...params),
    run: (...params) => {
      stmt.run(...params);
      return {
        lastInsertRowid: database.getLastInsertRowid(),
        changes: stmt.getChanges()
      };
    }
  };
}

function exec(sql) {
  const database = getDb();
  return database.exec(sql);
}

async function saveDatabase() {
  if (!db || !SQL) return;
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/anime_platform.db');
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

module.exports = {
  initDatabase,
  getDb,
  setDb,
  prepare,
  exec,
  saveDatabase
};
