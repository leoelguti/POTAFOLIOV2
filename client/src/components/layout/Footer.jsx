import { SITE_CONFIG } from '../../utils/constants';

/**
 * Footer with copyright and social links.
 */
export default function Footer() {
  return (
    <footer>
      <div className="foot-l">
        © {new Date().getFullYear()} {SITE_CONFIG.name} · Built with Node.js · React · Vite
      </div>
      <div className="foot-r">
        <a href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={SITE_CONFIG.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="#contact">Resume ↗</a>
      </div>
    </footer>
  );
}
