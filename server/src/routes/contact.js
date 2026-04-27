import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getSupabase } from '../services/supabaseClient.js';
import { sanitizeContactPayload, escapeHtml } from '../utils/sanitize.js';

const router = Router();

// Rate limit: max 5 messages per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages. Please try again later.' },
});

// POST /api/contact
router.post('/', contactLimiter, async (req, res) => {
  try {
    // Sanitize & validate — throws with statusCode on failure
    const { name, email, message } = sanitizeContactPayload(req.body);

    const supabase = getSupabase();
    if (!supabase) {
      // No DB configured — log sanitized output (never raw user input)
      console.log('📬 Contact message (no DB):', {
        name: escapeHtml(name),
        email: escapeHtml(email),
        preview: escapeHtml(message.substring(0, 50)) + '…',
      });
      return res.json({
        success: true,
        message: 'Message received! (DB not configured — logged to console)',
      });
    }

    const { error } = await supabase
      .from('messages')
      .insert({ name, email, message });

    if (error) throw error;

    // Log only non-sensitive identifier — never the full message
    console.log(`📬 New message from ${escapeHtml(name)}`);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    // Return user-facing validation errors
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    // Internal errors — never leak details to client
    console.error('Error saving message:', err.message);
    res.status(500).json({ message: 'Failed to save message. Please try again.' });
  }
});

// GET /api/messages (admin) — requires API key
router.get('/', async (req, res) => {
  // Simple API key guard — prevents unauthenticated access to stored messages
  const apiKey = req.headers['x-admin-key'];
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.json([]);
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});

export default router;
