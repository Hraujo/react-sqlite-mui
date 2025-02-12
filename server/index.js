
import express from 'express';
import db from './db.js';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());



// Authors CRUD
app.get('/authors', (req, res) => {
  const authors = db.prepare('SELECT * FROM authors').all();
  res.json(authors);
});

app.post('/authors', (req, res) => {
  const result = db.prepare('INSERT INTO authors (name) VALUES (?)').run(req.body.name);
  res.json({ id: result.lastInsertRowid });
});

app.put('/authors/:id', (req, res) => {
  db.prepare('UPDATE authors SET name = ? WHERE id = ?').run(req.body.name, req.params.id);
  res.sendStatus(200);
});

app.delete('/authors/:id', (req, res) => {
  db.prepare('DELETE FROM authors WHERE id = ?').run(req.params.id);
  res.sendStatus(200);
});// server/index.js



// Posts CRUD
app.get('/posts', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts').all();
  res.json(posts);
});

app.post('/posts', (req, res) => {
  try {
    const { title, content, author_id } = req.body;
    if (!title || !content || !author_id) {
      return res.status(400).json({ error: 'Missing required fields: title, content, or author_id' });
    }
    const result = db.prepare(`
      INSERT INTO posts (title, content, author_id) 
      VALUES (?, ?, ?)
    `).run(title, content, author_id);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error inserting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/posts/:id', (req, res) => {
  const { title, content, author_id } = req.body;
  if (!title || !content || !author_id) {
    return res.status(400).json({ error: 'Missing required fields: title, content, or author_id' });
  }
  db.prepare('UPDATE posts SET title = ?, content = ?, author_id = ? WHERE id = ?').run(title, content, author_id, req.params.id);
  res.json({ id: req.params.id });
});

app.delete('/posts/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.sendStatus(200);
});// s

// Departments CRUD
app.get('/departments', (req, res) => {
  const departments = db.prepare('SELECT * FROM departments').all();
  res.json(departments);
});

app.post('/departments', (req, res) => {
  const result = db.prepare('INSERT INTO departments (name) VALUES (?)').run(req.body.name);
  res.json({ id: result.lastInsertRowid });
});

app.put('/departments/:id', (req, res) => {
  db.prepare('UPDATE departments SET name = ? WHERE id = ?').run(req.body.name, req.params.id);
  res.sendStatus(200);
});

app.delete('/departments/:id', (req, res) => {
  db.prepare('DELETE FROM departments WHERE id = ?').run(req.params.id);
  res.sendStatus(200);
});

// Users CRUD
app.get('/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

app.post('/users', (req, res) => {
  const result = db.prepare(`
    INSERT INTO users (name, email, department_id, password) 
    VALUES (?, ?, ?, ?)
  `).run(req.body.name, req.body.email, req.body.department_id, req.body.password);
  res.json({ id: result.lastInsertRowid });
});

app.put('/users/:id', (req, res) => {
  db.prepare(`
    UPDATE users 
    SET name = ?, email = ?, department_id = ?, password = ?
    WHERE id = ?
  `).run(req.body.name, req.body.email, req.body.department_id, req.body.password, req.params.id);
  res.sendStatus(200);
});

app.delete('/users/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});