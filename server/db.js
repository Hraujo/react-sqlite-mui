// server/db.js
import BetterSqlite3 from 'better-sqlite3';
const db = new BetterSqlite3('hsoft.db');


db.exec(`
  CREATE TABLE if not exists departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    manager_id INTEGER
  );

  CREATE TABLE if not exists users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    department_id INTEGER,
    password TEXT NOT NULL,
    FOREIGN KEY(department_id) REFERENCES departments(id)
  );
  
  CREATE TABLE if not exists tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT,
	startAt TIMESTAMP,
	endAt TIMESTAMP
  );

  CREATE TABLE if not exists posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  author_id INTEGER,
  created_at date TIMESTAMP DEFAULT (datetime('now','localtime')),
  FOREIGN KEY(author_id) REFERENCES authors(id)
  );

  CREATE TABLE if not exists authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
  );
`);

export default db;
