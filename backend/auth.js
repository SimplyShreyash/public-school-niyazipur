/**
 * Admin Authentication & Security Layer
 * Protects the admin dashboard using JWT & bcryptjs password hashing.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'public-school-niyazipur-super-secure-jwt-secret-key-2026';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@publicschoolniyazipur.in').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@2026';

// Pre-compute admin hash
let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
if (!adminPasswordHash) {
  adminPasswordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
}

/**
 * Verify admin credentials and generate JWT token
 */
async function loginAdmin(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  if (email.toLowerCase().trim() !== ADMIN_EMAIL) {
    return { success: false, error: 'Invalid admin credentials.' };
  }

  const isMatch = await bcrypt.compare(password, adminPasswordHash);
  if (!isMatch) {
    return { success: false, error: 'Invalid admin credentials.' };
  }

  // Generate 7-day token
  const token = jwt.sign(
    {
      role: 'admin',
      email: ADMIN_EMAIL
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    token,
    user: {
      email: ADMIN_EMAIL,
      role: 'admin'
    }
  };
}

/**
 * Express middleware to verify admin JWT token
 */
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. Missing or malformed Bearer token.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient privileges.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session. Please log in again.'
    });
  }
}

module.exports = {
  loginAdmin,
  requireAdminAuth,
  ADMIN_EMAIL
};
