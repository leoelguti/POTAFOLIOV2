// Static data fallbacks — used when API is not available.
// TODO: replace placeholder URLs/companies with real data before deploy.

export const SITE_CONFIG = {
  name: 'Leonardo Gutierrez',
  firstName: 'Leonardo',
  lastName: 'Gutierrez.',
  role: 'Full-stack engineer',
  tagline: 'Disponible para nuevos proyectos',
  description: 'Construyo <strong>aplicaciones web rápidas y escalables</strong> con Node.js, React y Tailwind CSS. Desde la arquitectura hasta el deploy — obsesivo con cada capa.',
  email: 'leonardoagutierrezg@gmail.com',
  // TODO: confirm real handles
  github: 'https://github.com/leoelguti',
  linkedin: 'https://www.linkedin.com/in/leonardo-gutierrez/',
  twitter: '', // empty = hidden in UI
  logoInitials: 'LG',
  logoText: 'leonardo.dev',
};

// Single source of truth for tech stack — used by Skills + Marquee.
export const TECH_STACK = [
  { name: 'Node.js', color: '#68a063' },
  { name: 'React', color: '#61dafb' },
  { name: 'Tailwind', color: '#38bdf8' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Next.js', color: '#fff' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Docker', color: '#0db7ed' },
  { name: 'Redis', color: '#ff4438' },
  { name: 'GraphQL', color: '#e535ab' },
  { name: 'REST APIs', color: '#00ff87' },
  { name: 'AWS', color: '#ff9900' },
  { name: 'Prisma', color: '#5a67d8' },
  { name: 'Vite', color: '#646cff' },
  { name: 'Express', color: '#aaa' },
  { name: 'GitHub Actions', color: '#2088ff' },
  { name: 'Vercel', color: '#fff' },
];

// Backwards-compat aliases (kept until callers migrate).
export const SKILLS = TECH_STACK;
export const MARQUEE_TECHS = TECH_STACK.map((t) => t.name);

export const PROJECTS = [
  {
    id: 'kaja',
    icon: '🛒',
    hue: 260,
    title: 'Kaja POS',
    description: 'Sistema punto de venta web — gestión de inventario, ventas y reportes en tiempo real.',
    tags: ['React', 'Node.js', 'Vercel'],
    category: 'fullstack',
    url: 'https://kajapos.vercel.app/',
    repo: '',
    isLive: true,
  },
  {
    id: 'sgae',
    icon: '🎓',
    hue: 190,
    title: 'SGAE Togo',
    description: 'Sistema de gestión académica — administración de estudiantes, cursos y calificaciones.',
    tags: ['React', 'Node.js', 'Vercel'],
    category: 'fullstack',
    url: 'https://sgae-togo.vercel.app/home',
    repo: '',
    isLive: true,
  },
  {
    id: 'bingo',
    icon: '🎰',
    hue: 310,
    title: 'Bingo Game · Pro Max',
    description: 'Bingo multijugador con dos vistas: animador (sorteo en vivo) y jugadores (cartones interactivos).',
    tags: ['React', 'WebSockets', 'Vercel'],
    category: 'fullstack',
    url: 'https://bingo-gamevcsb.vercel.app/',
    altUrl: 'https://bingo-gamevcsb.vercel.app/player.html',
    altLabel: 'Vista jugador',
    repo: '',
    isLive: true,
  },
];

// TODO: replace with real companies once available.
export const EXPERIENCE = [
  {
    yearRange: '2024–Presente',
    title: 'Ingeniero Full-Stack',
    company: 'Freelance / Proyectos propios',
    description: 'Desarrollo de plataformas SaaS y APIs end-to-end. Arquitectura de servicios Node.js y frontends React optimizados.',
  },
  {
    yearRange: '2023–2024',
    title: 'Desarrollador Full-Stack',
    company: 'Proyectos cliente',
    description: 'Entrega de funcionalidades end-to-end. Reducción de tiempos de respuesta de API mediante caching y optimización de consultas.',
  },
  {
    yearRange: '2022–2023',
    title: 'Desarrollador Frontend',
    company: 'Proyectos web',
    description: 'Sitios y dashboards con React, Tailwind CSS y TypeScript. Foco en performance y experiencia de usuario.',
  },
];

// Stats coherent with experience claim (1+ year shown to user).
export const STATS = [
  { value: 1, label: 'Años de experiencia', suffix: '+' },
  { value: 3, label: 'Proyectos desplegados', suffix: '+' },
  { value: 3, label: 'Clientes felices', suffix: '+' },
  { value: 99, label: 'Tiempo de actividad', suffix: '%' },
];

export const FILTER_CATEGORIES = ['All', 'fullstack', 'backend', 'frontend'];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
