import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../../utils/constants';

/**
 * Sticky navigation bar with progress indicator and glassmorphism.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setProgress(pct);
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div id="progress" style={{ width: `${progress}%` }} />
      <nav id="nav" className={`${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`} aria-label="Navegación principal">
        <a href="#hero" className="logo" aria-label="Inicio">
          <em>{SITE_CONFIG.logoInitials}</em> · {SITE_CONFIG.logoText}
        </a>
        <ul className="nav-links" id="primary-nav">
          <li><a href="#about" onClick={() => setMenuOpen(false)}>Sobre mí</a></li>
          <li><a href="#projects" onClick={() => setMenuOpen(false)}>Proyectos</a></li>
          <li><a href="#experience" onClick={() => setMenuOpen(false)}>Experiencia</a></li>
          <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contacto</a></li>
        </ul>
        <a href="#contact" className="nav-hire">Contratar</a>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          type="button"
        >
          <span /><span /><span />
        </button>
      </nav>
    </>
  );
}
