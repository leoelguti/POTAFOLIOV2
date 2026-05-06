import { SITE_CONFIG } from '../../utils/constants';

/**
 * Footer with copyright and social links.
 */
export default function Footer() {
  return (
    <footer>
      <div className="foot-l">
        © {new Date().getFullYear()} {SITE_CONFIG.name} · Construido con Node.js · React · Vite
      </div>
      <div className="foot-r">
        {SITE_CONFIG.github && (
          <a href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        )}
        {SITE_CONFIG.linkedin && (
          <a href={SITE_CONFIG.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        )}
        <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">CV ↗</a>
      </div>
    </footer>
  );
}
