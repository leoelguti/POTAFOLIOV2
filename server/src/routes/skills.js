import { Router } from 'express';
import { getSupabase } from '../services/supabaseClient.js';

const router = Router();

const FALLBACK = [
  { name: 'Node.js', color: '#68a063' }, { name: 'React', color: '#61dafb' },
  { name: 'Tailwind', color: '#38bdf8' }, { name: 'TypeScript', color: '#3178c6' },
  { name: 'Next.js', color: '#fff' }, { name: 'PostgreSQL', color: '#336791' },
  { name: 'Docker', color: '#0db7ed' }, { name: 'Redis', color: '#ff4438' },
  { name: 'GraphQL', color: '#e535ab' }, { name: 'REST APIs', color: '#00ff87' },
  { name: 'AWS', color: '#ff9900' }, { name: 'Prisma', color: '#5a67d8' },
  { name: 'Vite', color: '#646cff' }, { name: 'Express', color: '#aaa' },
];

router.get('/', async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) return res.json(FALLBACK);

  try {
    const { data, error } = await supabase.from('skills').select('*').order('sort_order');
    if (error) throw error;
    res.json(data);
  } catch {
    res.json(FALLBACK);
  }
});

export default router;
