// src/lib/api/auth.ts
// This is a simple in-memory implementation. Replace with DB logic for production.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const SECRET = process.env.JWT_SECRET || 'alexandria_secret';

const pool = new Pool({
  connectionString: 'postgresql://user:52Bw6OgjAcbW9VRpmLFfwNBagyc6WtT9@dpg-d2u4hv7fte5s73aq7a9g-a.ohio-postgres.render.com/forsyth_hacks_db',
  ssl: { rejectUnauthorized: false },
});

// Ensure users table exists with the required schema
async function ensureTable() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE,
      display_name TEXT,
      is_verified_librarian BOOLEAN DEFAULT FALSE,
      reputation INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now(),
      password_hash TEXT NOT NULL
    );
  `);
}

export async function createLibrarian(email: string, password: string, displayName?: string) {
  await ensureTable();
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    return { error: 'Email already registered.' };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3)',
    [email, passwordHash, displayName || null]
  );
  return { success: true };
}

export async function loginLibrarian(email: string, password: string) {
  await ensureTable();
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    return { error: 'Invalid credentials.' };
  }
  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return { error: 'Invalid credentials.' };
  }
  const token = jwt.sign({
    email: user.email,
    id: user.id,
    display_name: user.display_name,
    is_verified_librarian: user.is_verified_librarian,
    reputation: user.reputation
  }, SECRET, { expiresIn: '2h' });
  return { token };
}
