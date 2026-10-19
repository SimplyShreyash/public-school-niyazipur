/**
 * Production-Ready Backend Server - Public School Niyazipur
 * Full-Stack Pipeline: SQLite Database, REST API, Validation, Email Alerts & Admin Portal
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const {
  createSubmission,
  getSubmissionById,
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  getSubmissionStats
} = require('./backend/db');

const { validateSubmission } = require('./backend/validator');
const { sendSubmissionAlert } = require('./backend/email');
const { loginAdmin, requireAdminAuth } = require('./backend/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// 1. SECURITY & CORS CONFIGURATION
// ============================================================================
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [
      'https://simplyshreyash.github.io',
      'http://localhost:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:3000'
    ];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Also allow any netlify or github.io staging preview URL if configured
    if (origin.endsWith('.github.io') || origin.endsWith('.netlify.app') || origin.endsWith('.loca.lt')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers with strict size limits to prevent DOS
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Request IP extractor helper
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket ? req.socket.remoteAddress : req.ip;
}

// Simple in-memory sliding window rate limiter for submissions
const rateLimitMap = new Map();
function submissionRateLimiter(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxSubmissions = 10; // max 10 submissions per 10 mins

  const userRecord = rateLimitMap.get(ip) || [];
  const recentRequests = userRecord.filter(timestamp => now - timestamp < windowMs);

  if (recentRequests.length >= maxSubmissions) {
    return res.status(429).json({
      success: false,
      error: 'Too many submissions from this IP address. Please wait a few minutes before trying again.'
    });
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  next();
}

// ============================================================================
// 2. STATIC ASSETS & ADMIN DASHBOARD SERVING
// ============================================================================

// Serve admin dashboard at /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve public static frontend
app.use(express.static(path.join(__dirname)));

// ============================================================================
// 3. PUBLIC REST API: FORM SUBMISSION PIPELINE
// ============================================================================

/**
 * POST /api/submit-form
 * Handles incoming website inquiries, validates payload, stores in DB, and dispatches email alert
 */
app.post('/api/submit-form', submissionRateLimiter, async (req, res) => {
  try {
    // 1. Validation & Sanitization
    const validation = validateSubmission(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const { fullName, email, phone, subject, message } = validation.data;
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';

    // 2. Database Insertion (Parameterized query)
    const submission = createSubmission({
      fullName,
      email,
      phone,
      subject,
      message,
      ip,
      userAgent
    });

    // 3. Automated Email Notification Alert (Dispatched asynchronously)
    sendSubmissionAlert(submission).catch(err => {
      console.error('[Background Email Error]:', err.message);
    });

    // 4. Client Response
    return res.status(201).json({
      success: true,
      message: 'Thank you! Your submission has been securely received and recorded.',
      id: submission.id,
      timestamp: submission.created_at
    });
  } catch (error) {
    console.error('[API Submit-Form Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your submission. Please try again later.'
    });
  }
});

// ============================================================================
// 4. PROTECTED ADMIN PORTAL REST API
// ============================================================================

/**
 * POST /api/admin/login
 * Admin authentication endpoint
 */
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginAdmin(email, password);

    if (!result.success) {
      return res.status(401).json({ success: false, error: result.error });
    }

    return res.json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('[Admin Login Error]:', error);
    return res.status(500).json({ success: false, error: 'Authentication service error.' });
  }
});

/**
 * GET /api/admin/stats
 * Dashboard summary statistics
 */
app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
  try {
    const stats = getSubmissionStats();
    return res.json({ success: true, stats });
  } catch (error) {
    console.error('[Admin Stats Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve stats.' });
  }
});

/**
 * GET /api/admin/submissions
 * Query, search, and filter form submissions
 */
app.get('/api/admin/submissions', requireAdminAuth, (req, res) => {
  try {
    const { search, status, sort, limit, offset } = req.query;
    const result = getSubmissions({
      search,
      status,
      sort,
      limit: limit ? Number(limit) : 100,
      offset: offset ? Number(offset) : 0
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[Admin Submissions Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve records.' });
  }
});

/**
 * GET /api/admin/submissions/:id
 * Retrieve a single submission by ID
 */
app.get('/api/admin/submissions/:id', requireAdminAuth, (req, res) => {
  try {
    const sub = getSubmissionById(req.params.id);
    if (!sub) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }
    return res.json({ success: true, submission: sub });
  } catch (error) {
    console.error('[Admin Get Submission Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to load submission.' });
  }
});

/**
 * PATCH /api/admin/submissions/:id
 * Update status (e.g. New -> In Review -> Resolved)
 */
app.patch('/api/admin/submissions/:id', requireAdminAuth, (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'New status is required.' });
    }

    const updated = updateSubmissionStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Submission not found or status invalid.' });
    }

    return res.json({ success: true, submission: updated });
  } catch (error) {
    console.error('[Admin Update Status Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/submissions/:id
 * Delete a submission record
 */
app.delete('/api/admin/submissions/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = deleteSubmission(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }
    return res.json({ success: true, message: 'Submission deleted successfully.' });
  } catch (error) {
    console.error('[Admin Delete Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete record.' });
  }
});

/**
 * GET /api/admin/export
 * Download all submissions as a clean CSV spreadsheet
 */
app.get('/api/admin/export', requireAdminAuth, (req, res) => {
  try {
    const { submissions } = getSubmissions({ limit: 10000, offset: 0, sort: 'desc' });

    let csv = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    csv += 'ID,Full Name,Email Address,Phone Number,Subject,Message / Instructions,Status,Submitted Date (UTC)\r\n';

    submissions.forEach(s => {
      const escape = text => `"${String(text || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
      csv += [
        s.id,
        escape(s.full_name),
        escape(s.email),
        escape(s.phone),
        escape(s.subject),
        escape(s.message),
        escape(s.status),
        escape(s.created_at)
      ].join(',') + '\r\n';
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="public-school-submissions-${Date.now()}.csv"`);
    return res.send(csv);
  } catch (error) {
    console.error('[Admin Export Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to export CSV.' });
  }
});

// ============================================================================
// 5. SERVER INITIALIZATION
// ============================================================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 [Public School Server & API] Active on port ${PORT}`);
  console.log(`🌐 Website Frontend: http://localhost:${PORT}`);
  console.log(`🔐 Admin Dashboard:  http://localhost:${PORT}/admin`);
  console.log(`📬 Form Endpoint:   POST http://localhost:${PORT}/api/submit-form`);
  console.log(`======================================================\n`);
});
