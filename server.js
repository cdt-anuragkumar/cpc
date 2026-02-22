const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sections
app.get('/api/sections/:name', (req, res) => {
  const name = req.params.name;
  db.get('SELECT * FROM sections WHERE name = ?', [name], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || null);
  });
});

app.post('/api/sections/:name', (req, res) => {
  const name = req.params.name;
  const { title, content, image } = req.body;
  db.run(
    `INSERT INTO sections(name, title, content, image, updated_at)
     VALUES(?,?,?,?,datetime('now'))
     ON CONFLICT(name) DO UPDATE SET title=excluded.title, content=excluded.content, image=excluded.image, updated_at=datetime('now')`,
    [name, title || '', content || '', image || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Gallery
app.get('/api/gallery', (req, res) => {
  db.all('SELECT * FROM gallery ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/gallery', (req, res) => {
  const { title, description, image, category } = req.body;
  db.run(
    'INSERT INTO gallery(title, description, image, category, created_at) VALUES(?,?,?,?,datetime("now"))',
    [title || '', description || '', image || '', category || 'all'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Teachers
app.get('/api/teachers', (req, res) => {
  db.all('SELECT * FROM teachers ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/teachers', (req, res) => {
  const { name, subject, email, phone, qualification, experience, photo } = req.body;
  db.run(
    'INSERT INTO teachers(name, subject, email, phone, qualification, experience, photo) VALUES(?,?,?,?,?,?,?)',
    [name || '', subject || '', email || '', phone || '', qualification || '', experience || '', photo || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Toppers
app.get('/api/toppers', (req, res) => {
  db.all('SELECT * FROM toppers ORDER BY class, rank', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/toppers', (req, res) => {
  const { name, class_name, rank, percentage, photo } = req.body;
  db.run(
    'INSERT INTO toppers(name, class, rank, percentage, photo) VALUES(?,?,?,?,?)',
    [name || '', class_name || '', rank || '', percentage || '', photo || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Students
app.get('/api/students', (req, res) => {
  const cls = req.query.class;
  if (!cls) return res.status(400).json({ error: 'class query param required' });
  db.all('SELECT * FROM students WHERE class = ? ORDER BY roll', [cls], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/students', (req, res) => {
  const { name, class_name, roll } = req.body;
  db.run('INSERT INTO students(name, class, roll) VALUES(?,?,?)', [name || '', class_name || '', roll || 0], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// Attendance
app.post('/api/attendance/mark', (req, res) => {
  const { class_name, date, teacher, records } = req.body; // records: [{ student_id, present }]
  if (!class_name || !date || !Array.isArray(records)) return res.status(400).json({ error: 'invalid payload' });
  const stmt = db.prepare('INSERT INTO attendance(student_id, class, date, present, teacher, created_at) VALUES(?,?,?,?,?,datetime("now"))');
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    for (const r of records) {
      stmt.run([r.student_id || null, class_name, date, r.present ? 1 : 0, teacher || '']);
    }
    db.run('COMMIT', err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

app.get('/api/attendance', (req, res) => {
  const cls = req.query.class;
  const date = req.query.date;
  if (!cls || !date) return res.status(400).json({ error: 'class and date query params required' });
  db.all(
    `SELECT a.*, s.name as student_name, s.roll
     FROM attendance a
     LEFT JOIN students s ON s.id = a.student_id
     WHERE a.class = ? AND a.date = ? ORDER BY s.roll`,
    [cls, date],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Contact messages
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  db.run('INSERT INTO contacts(name,email,phone,message,created_at) VALUES(?,?,?,?,datetime("now"))', [name||'', email||'', phone||'', message||''], function(err){
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// Get all contacts
app.get('/api/contacts', (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Delete a contact
app.delete('/api/contacts/:id', (req, res) => {
  db.run('DELETE FROM contacts WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Update a student
app.put('/api/students/:id', (req, res) => {
  const { name, class_name, roll } = req.body;
  db.run('UPDATE students SET name=?, class=?, roll=? WHERE id=?', [name||'', class_name||'', roll||0, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Delete a teacher
app.delete('/api/teachers/:id', (req, res) => {
  db.run('DELETE FROM teachers WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Update a teacher
app.put('/api/teachers/:id', (req, res) => {
  const { name, subject, email, phone, qualification, experience, photo } = req.body;
  db.run('UPDATE teachers SET name=?, subject=?, email=?, phone=?, qualification=?, experience=?, photo=? WHERE id=?',
    [name||'', subject||'', email||'', phone||'', qualification||'', experience||'', photo||'', req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Delete a gallery item
app.delete('/api/gallery/:id', (req, res) => {
  db.run('DELETE FROM gallery WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Delete a topper
app.delete('/api/toppers/:id', (req, res) => {
  db.run('DELETE FROM toppers WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Update a topper
app.put('/api/toppers/:id', (req, res) => {
  const { name, class_name, rank, percentage, photo } = req.body;
  db.run('UPDATE toppers SET name=?, class=?, rank=?, percentage=?, photo=? WHERE id=?',
    [name||'', class_name||'', rank||'', percentage||'', photo||'', req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Serve static files
app.use(express.static(__dirname));

// Admin: create admin (one-time)
app.post('/api/admin/setup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO admins(username,password_hash) VALUES(?,?)', [username, hash], function(err){
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  db.get('SELECT * FROM admins WHERE username = ?', [username], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CPC backend listening on http://localhost:${PORT}`);
});
