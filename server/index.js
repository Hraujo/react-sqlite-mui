// server/index.js
import express from 'express';
import db from './db.js';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:5174'
}));
app.use(express.json());

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
    INSERT INTO users (name, email, department_id) 
    VALUES (?, ?, ?)
  `).run(req.body.name, req.body.email, req.body.department_id);
  res.json({ id: result.lastInsertRowid });
});

app.put('/users/:id', (req, res) => {
  db.prepare(`
    UPDATE users 
    SET name = ?, email = ?, department_id = ?
    WHERE id = ?
  `).run(req.body.name, req.body.email, req.body.department_id, req.params.id);
  res.sendStatus(200);
});

app.delete('/users/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});