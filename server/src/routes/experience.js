import { Router } from 'express';
import { getSupabase } from '../services/supabaseClient.js';

const router = Router();

const FALLBACK = [
  { year_range: '2024–Present', title: 'Senior Full-Stack Engineer', company: 'TechCorp Inc.', description: 'Led a team of 5 engineers building a real-time SaaS platform serving 50k+ users.' },
  { year_range: '2022–2024', title: 'Full-Stack Developer', company: 'StartupXYZ', description: 'Built and shipped 3 major product features end-to-end. Reduced API response times by 60%.' },
  { year_range: '2021–2022', title: 'Frontend Developer', company: 'Digital Agency Co.', description: 'Delivered 10+ client projects using React and Tailwind CSS.' },
];

router.get('/', async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) return res.json(FALLBACK);

  try {
    const { data, error } = await supabase.from('experience').select('*').order('sort_order');
    if (error) throw error;
    res.json(data);
  } catch {
    res.json(FALLBACK);
  }
});

export default router;
