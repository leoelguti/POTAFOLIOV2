/**
 * Input sanitization utilities for the portfolio backend.
 * Strips HTML tags, trims whitespace, and normalizes inputs.
 */

/**
 * Strip all HTML tags from a string to prevent stored XSS.
 * @param {string} str
 * @returns {string}
 */
export function stripHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Escape HTML special characters for safe display.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate and normalize an email address.
 * @param {string} email
 * @returns {{ valid: boolean, normalized: string }}
 */
export function validateEmail(email) {
  if (typeof email !== 'string') return { valid: false, normalized: '' };
  const normalized = email.trim().toLowerCase();
  // RFC 5322 simplified — catches 99%+ of real emails
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return { valid: re.test(normalized), normalized };
}

/**
 * Sanitize a contact form payload.
 * Returns the cleaned object or throws with a user-friendly message.
 * @param {{ name: string, email: string, message: string }} body
 * @returns {{ name: string, email: string, message: string }}
 */
export function sanitizeContactPayload(body) {
  const name = stripHtml(body?.name);
  const message = stripHtml(body?.message);
  const { valid, normalized: email } = validateEmail(body?.email);

  if (!name || !email || !message) {
    const err = new Error('All fields are required.');
    err.statusCode = 400;
    throw err;
  }

  if (name.length > 100) {
    const err = new Error('Name must be 100 characters or less.');
    err.statusCode = 400;
    throw err;
  }

  if (email.length > 100) {
    const err = new Error('Email must be 100 characters or less.');
    err.statusCode = 400;
    throw err;
  }

  if (message.length > 2000) {
    const err = new Error('Message must be 2000 characters or less.');
    err.statusCode = 400;
    throw err;
  }

  if (!valid) {
    const err = new Error('Invalid email address.');
    err.statusCode = 400;
    throw err;
  }

  return { name, email, message };
}

/**
 * Validate a URL: must be https:// with a valid hostname.
 * Used to prevent javascript:, data:, or other dangerous protocols in iframes.
 * @param {string} urlStr
 * @returns {boolean}
 */
export function isValidHttpsUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
