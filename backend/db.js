/**
 * Database Module - Public School Niyazipur
 * Uses Node.js native DatabaseSync (SQLite) with zero native build dependencies.
 * Also includes PostgreSQL / Supabase migration schema.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

// Path to persistent SQLite database
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'submissions.sqlite');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New',
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
`);

// Auto-migrate if older table had restrictive CHECK constraint
try {
  const tableMeta = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name='submissions'`).get();
  if (tableMeta && tableMeta.sql && tableMeta.sql.includes("CHECK(status IN ('New', 'In Review', 'Resolved'))")) {
    db.exec(`
      ALTER TABLE submissions RENAME TO submissions_old;
      CREATE TABLE submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'New',
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      INSERT INTO submissions (id, full_name, email, phone, subject, message, status, ip_address, user_agent, created_at, updated_at)
        SELECT id, full_name, email, phone, subject, message, status, ip_address, user_agent, created_at, updated_at FROM submissions_old;
      DROP TABLE submissions_old;
      CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
    `);
  }
} catch (migErr) {
  // Migration not needed or already done
}

/**
 * Insert a new form submission
 */
function createSubmission({ fullName, email, phone, subject, message, ip, userAgent }) {
  const stmt = db.prepare(`
    INSERT INTO submissions (full_name, email, phone, subject, message, ip_address, user_agent, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const result = stmt.run(
    fullName,
    email,
    phone || null,
    subject || 'Website Inquiry',
    message,
    ip || null,
    userAgent || null
  );

  return getSubmissionById(result.lastInsertRowid);
}

/**
 * Retrieve submission by ID
 */
function getSubmissionById(id) {
  const stmt = db.prepare(`SELECT * FROM submissions WHERE id = ?`);
  return stmt.get(Number(id));
}

const VALID_STATUSES = ['Pending', 'Contacted', 'Resolved', 'New', 'In Review'];

/**
 * List submissions with search, filter, and sorting
 */
function getSubmissions({ search = '', status = '', sort = 'desc', limit = 100, offset = 0 } = {}) {
  let query = `SELECT * FROM submissions WHERE 1=1`;
  const params = [];

  if (status && VALID_STATUSES.includes(status)) {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (search && search.trim()) {
    query += ` AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)`;
    const wildcard = `%${search.trim()}%`;
    params.push(wildcard, wildcard, wildcard, wildcard);
  }

  const sortDirection = sort.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  query += ` ORDER BY created_at ${sortDirection} LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const stmt = db.prepare(query);
  const rows = stmt.all(...params);

  // Get total count
  let countQuery = `SELECT COUNT(*) as total FROM submissions WHERE 1=1`;
  const countParams = [];
  if (status && VALID_STATUSES.includes(status)) {
    countQuery += ` AND status = ?`;
    countParams.push(status);
  }
  if (search && search.trim()) {
    countQuery += ` AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)`;
    const wildcard = `%${search.trim()}%`;
    countParams.push(wildcard, wildcard, wildcard, wildcard);
  }

  const countStmt = db.prepare(countQuery);
  const countResult = countStmt.get(...countParams);

  return {
    submissions: rows,
    total: countResult ? countResult.total : 0,
    limit,
    offset
  };
}

/**
 * Update submission status
 */
function updateSubmissionStatus(id, newStatus) {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new Error(`Invalid status value. Must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  const stmt = db.prepare(`
    UPDATE submissions 
    SET status = ?, updated_at = datetime('now')
    WHERE id = ?
  `);

  const result = stmt.run(newStatus, Number(id));
  if (result.changes === 0) return null;
  return getSubmissionById(id);
}

/**
 * Delete a submission record
 */
function deleteSubmission(id) {
  const stmt = db.prepare(`DELETE FROM submissions WHERE id = ?`);
  const result = stmt.run(Number(id));
  return result.changes > 0;
}

/**
 * Summary metrics for dashboard
 */
function getSubmissionStats() {
  const total = db.prepare(`SELECT COUNT(*) as c FROM submissions`).get().c;
  const newCount = db.prepare(`SELECT COUNT(*) as c FROM submissions WHERE status IN ('New', 'Pending')`).get().c;
  const inReview = db.prepare(`SELECT COUNT(*) as c FROM submissions WHERE status IN ('In Review', 'Contacted')`).get().c;
  const resolved = db.prepare(`SELECT COUNT(*) as c FROM submissions WHERE status = 'Resolved'`).get().c;

  return {
    total,
    new: newCount,
    inReview,
    resolved
  };
}

module.exports = {
  db,
  createSubmission,
  getSubmissionById,
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  getSubmissionStats
};
