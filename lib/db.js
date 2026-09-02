import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'professors.db');
const db = new Database(dbPath);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS professors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT,
    photoUrl TEXT,
    linkedinUrl TEXT,
    whatsappNumber TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
