// Static data fallbacks — used when API is not available
export const SITE_CONFIG = {
  name: 'Leonardo Gutierrez',
  firstName: 'Leonardo',
  lastName: 'Gutierrez.',
  role: 'Full-stack engineer',
  tagline: 'Disponible para nuevos proyectos',
  description: 'I build <strong>fast, scalable web applications</strong> with Node.js, React & Tailwind CSS. From architecture to deployment — obsessive about every layer.',
  email: 'LeonardoGutierrezDev@hotmail.com',
  github: 'https://github.com/alexjohnson',
  linkedin: 'https://linkedin.com/in/alexjohnson',
  twitter: 'https://twitter.com/alexjohnson',
  logoInitials: 'LG',
  logoText: 'Portafolio',
};

export const SKILLS = [
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

export const PROJECTS = [
  {
    id: '1',
    icon: '🚀',
    hue: 260,
    title: 'Projecto Kaja',
    description: 'Real-time analytics dashboard with live metrics, WebSocket streaming & alerting.',
    tags: ['React', 'Node.js', 'WebSockets', 'PostgreSQL'],
    category: 'fullstack',
    url: 'https://example.com',
    isLive: true,
  },
  {
    id: '2',
    icon: '🛠️',
    hue: 190,
    title: 'Projecto SGAE',
    description: 'API management platform — request testing, team workspaces & version history.',
    tags: ['Next.js', 'Express', 'Redis', 'GraphQL'],
    category: 'backend',
    url: 'https://example.com',
    isLive: true,
  },
  {
    id: '3',
    icon: '🤖',
    hue: 310,
    title: 'Projecto Bingo Max',
    description: 'AI-powered document processor. Upload PDFs, get back structured insights instantly.',
    tags: ['React', 'Node.js', 'OpenAI', 'AWS S3'],
    category: 'fullstack',
    url: 'https://example.com',
    isLive: true,
  },
];

export const EXPERIENCE = [
  {
    yearRange: '2024–Present',
    title: 'Senior Full-Stack Engineer',
    company: 'TechCorp Inc.',
    description: 'Led a team of 5 engineers building a real-time SaaS platform serving 50k+ users. Architected the Node.js microservices backend and React frontend.',
  },
  {
    yearRange: '2022–2024',
    title: 'Full-Stack Developer',
    company: 'StartupXYZ',
    description: 'Built and shipped 3 major product features end-to-end. Reduced API response times by 60% through Redis caching and query optimization.',
  },
  {
    yearRange: '2021–2022',
    title: 'Frontend Developer',
    company: 'Digital Agency Co.',
    description: 'Delivered 10+ client projects using React and Tailwind CSS. Introduced TypeScript across the team, improving code quality significantly.',
  },
];

export const STATS = [
  { value: 1, label: 'Años de experiencia', suffix: '+' },
  { value: 3, label: 'Projectos desplegados', suffix: '+' },
  { value: 3, label: 'Clientes felices', suffix: '+' },
  { value: 99, label: 'Tiempo de actividad %', suffix: '%' },
];

export const MARQUEE_TECHS = [
  'Node.js', 'React', 'Tailwind CSS', 'TypeScript', 'PostgreSQL',
  'Docker', 'Redis', 'GraphQL', 'REST APIs', 'AWS',
  'Vite', 'Next.js', 'Prisma', 'Express', 'GitHub Actions', 'Vercel',
];

export const FILTER_CATEGORIES = ['All', 'fullstack', 'backend', 'frontend'];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
