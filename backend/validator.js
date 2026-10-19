/**
 * Input Validation & Sanitization Layer
 * Protects against XSS, injection, and invalid payloads.
 */

// Basic HTML entity escaping to neutralize XSS payloads
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // strip invisible control characters
}

// RFC 5322 standard email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// E.164 and common international/local phone regex
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,25}$/;

/**
 * Validate incoming form submission
 */
function validateSubmission(body) {
  const errors = [];

  // Flexible field extraction supporting various form naming conventions
  const fullName = typeof body.name === 'string' ? body.name.trim() 
    : (typeof body.fullName === 'string' ? body.fullName.trim() 
    : (typeof body.student_name === 'string' ? body.student_name.trim() : ''));

  let email = typeof body.email === 'string' ? body.email.trim() 
    : (typeof body.parent_email === 'string' ? body.parent_email.trim() : '');

  const phone = typeof body.phone === 'string' ? body.phone.trim() 
    : (typeof body.parent_phone === 'string' ? body.parent_phone.trim() : '');

  const subject = typeof body.subject === 'string' ? body.subject.trim() 
    : (typeof body.grade_applying === 'string' ? `Admission: ${body.grade_applying}` : 'Website Inquiry');

  let message = typeof body.message === 'string' ? body.message.trim() 
    : (typeof body.instructions === 'string' ? body.instructions.trim() : '');

  // If no explicit message, compose from grade & village
  if (!message && (body.grade_applying || body.student_location)) {
    message = `Admission Inquiry for Grade: ${body.grade_applying || 'Not specified'}. Village/Area: ${body.student_location || 'Not specified'}.`;
  }

  // 1. Validate Name
  if (!fullName) {
    errors.push({ field: 'name', message: 'Full name is required.' });
  } else if (fullName.length < 2 || fullName.length > 100) {
    errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters.' });
  }

  // 2. Validate Contact (Must provide either valid Email or valid Phone)
  if (!email && !phone) {
    errors.push({ field: 'contact', message: 'Please provide either an email address or mobile phone number.' });
  }

  if (email && (!EMAIL_REGEX.test(email) || email.length > 254)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address.' });
  }

  if (phone && !PHONE_REGEX.test(phone)) {
    errors.push({ field: 'phone', message: 'Please provide a valid phone number.' });
  }

  // If email was omitted, provide a clean reference email
  if (!email) {
    const cleanPhone = phone.replace(/\D/g, '') || Date.now();
    email = `lead.${cleanPhone}@publicschoolniyazipur.in`;
  }

  // 3. Validate Message / Instructions
  if (!message) {
    errors.push({ field: 'message', message: 'Message or instructions are required.' });
  } else if (message.length < 3 || message.length > 5000) {
    errors.push({ field: 'message', message: 'Message must be between 3 and 5,000 characters.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      fullName: sanitizeText(fullName),
      email: email.toLowerCase(),
      phone: sanitizeText(phone),
      subject: sanitizeText(subject),
      message: sanitizeText(message)
    }
  };
}

module.exports = {
  sanitizeText,
  validateSubmission
};
