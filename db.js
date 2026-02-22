const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'cpc.db');
const fs = require('fs');

// ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(DB_PATH, err => {
  if (err) return console.error('Failed to open DB', err);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    title TEXT,
    content TEXT,
    image TEXT,
    updated_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    image TEXT,
    category TEXT,
    created_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY,
    name TEXT,
    subject TEXT,
    email TEXT,
    phone TEXT,
    qualification TEXT,
    experience TEXT,
    photo TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS toppers (
    id INTEGER PRIMARY KEY,
    name TEXT,
    class TEXT,
    rank TEXT,
    percentage TEXT,
    photo TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT,
    class TEXT,
    roll INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY,
    student_id INTEGER,
    class TEXT,
    date TEXT,
    present INTEGER,
    teacher TEXT,
    created_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    created_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password_hash TEXT
  )`);

  // optional minimal seed: gallery example
  db.get('SELECT COUNT(*) as cnt FROM gallery', (err, row) => {
    if (!err && row && row.cnt === 0) {
      db.run('INSERT INTO gallery(title,description,image,category,created_at) VALUES(?,?,?,?,datetime("now"))',
        ['Annual Function 2025', 'Highlights from our annual function', 'cpcimg.png', 'events']);
    }
  });
});

module.exports = db;
