import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import projectsRouter from './routes/projects.js';
import contactRouter from './routes/contact.js';
import experienceRouter from './routes/experience.js';
import skillsRouter from './routes/skills.js';
import { startKeepAlive } from './services/supabaseClient.js';

const app = express();
const PORT = process.env.PORT || 3001;

/* ─── Security headers ───────────────────────────────────────────── */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.CLIENT_URL || 'http://localhost:5173'],
      frameSrc: ["'none'"],   // server doesn't need to embed iframes
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // allow loading cross-origin fonts/images
}));

/* ─── CORS — whitelist only allowed origins ──────────────────────── */
const ALLOWED_ORIGINS = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    // Allow server-to-server (no origin) and whitelisted origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 86400, // preflight cache 24h
}));

/* ─── Body parsing — limit payload size ──────────────────────────── */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

/* ─── Disable X-Powered-By (redundant with helmet, but explicit) ── */
app.disable('x-powered-by');

/* ─── Health check ───────────────────────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ─── Routes ─────────────────────────────────────────────────────── */
app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/skills', skillsRouter);

/* ─── 404 ────────────────────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* ─── Global error handler — never leak stack traces ─────────────── */
app.use((err, req, res, _next) => {
  // CORS rejection
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Projects: http://localhost:${PORT}/api/projects`);
  console.log(`   Contact: http://localhost:${PORT}/api/contact`);
  console.log('');

  // Start Supabase keep-alive (prevents free-tier auto-pause)
  startKeepAlive();
});
