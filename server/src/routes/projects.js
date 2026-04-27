import { Router } from 'express';
import { getSupabase } from '../services/supabaseClient.js';

const router = Router();

// Fallback data when Supabase is not configured
const FALLBACK_PROJECTS = [
  { id: '1', icon: '🚀', hue: 260, title: 'Project Alpha', description: 'Real-time analytics dashboard with live metrics, WebSocket streaming & alerting.', tags: ['React', 'Node.js', 'WebSockets', 'PostgreSQL'], category: 'fullstack', url: 'https://example.com', is_live: true, sort_order: 0 },
  { id: '2', icon: '🛠️', hue: 190, title: 'Project Beta', description: 'API management platform — request testing, team workspaces & version history.', tags: ['Next.js', 'Express', 'Redis', 'GraphQL'], category: 'backend', url: 'https://example.com', is_live: true, sort_order: 1 },
  { id: '3', icon: '🤖', hue: 310, title: 'Project Gamma', description: 'AI-powered document processor. Upload PDFs, get back structured insights instantly.', tags: ['React', 'Node.js', 'OpenAI', 'AWS S3'], category: 'fullstack', url: 'https://example.com', is_live: true, sort_order: 2 },
];

// GET /api/projects
router.get('/', async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    return res.json(FALLBACK_PROJECTS);
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.json(FALLBACK_PROJECTS);
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    const project = FALLBACK_PROJECTS.find((p) => p.id === req.params.id);
    return project ? res.json(project) : res.status(404).json({ message: 'Not found' });
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: 'Project not found' });
  }
});

export default router;
