import { useEffect, useRef } from 'react';
import { SITE_CONFIG } from '../../utils/constants';
import { scrambleText } from '../../utils/scrambleText';

/**
 * Safely renders a string that may contain <strong> tags.
 * Rejects any other HTML to prevent XSS.
 */
function SafeDescription({ text }) {
  // Split on <strong>...</strong> and render only those as <strong> elements
  const parts = text.split(/(<strong>.*?<\/strong>)/gi);
  return (
    <p className="hero-desc">
      {parts.map((part, i) => {
        const match = part.match(/^<strong>(.*)<\/strong>$/i);
        if (match) return <strong key={i}>{match[1]}</strong>;
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

/**
 * Hero section with scramble text effect and floating HUD cards.
 */
export default function Hero() {
  const sc1Ref = useRef(null);
  const sc2Ref = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      scrambleText(sc1Ref.current, SITE_CONFIG.firstName, 800);
    }, 300);
    const t2 = setTimeout(() => {
      scrambleText(sc2Ref.current, SITE_CONFIG.lastName, 1100);
    }, 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section id="hero">
      <div className="hero-left">
        <div className="hero-tag">
          <span className="pulse" />
          {SITE_CONFIG.tagline}
        </div>
        <h1 className="hero-name">
          <span className="line-label">{SITE_CONFIG.role}</span>
          <span className="gtext">
            <span className="scramble" ref={sc1Ref}>{SITE_CONFIG.firstName}</span>
            <br />
            <span className="scramble" ref={sc2Ref}>{SITE_CONFIG.lastName}</span>
          </span>
        </h1>
        <SafeDescription text={SITE_CONFIG.description} />
        <div className="hero-ctas">
          <a href="#projects" className="cta-main">See my work →</a>
          <a href="#contact" className="cta-ghost">Get in touch</a>
        </div>
      </div>

      {/* Floating HUD cards */}
      <div className="floater floater-1">
        <span className="dot" style={{ background: 'var(--a4)' }} />
        node server.js<br />
        <em>✓ Running on :3000</em>
      </div>
      <div className="floater floater-2">
        <span className="dot" style={{ background: 'var(--a2)' }} />
        git push origin main<br />
        <em>✓ Deployed to prod</em>
      </div>
      <div className="floater floater-3">
        <span className="dot" style={{ background: 'var(--a3)' }} />
        Lighthouse score<br />
        <em>100 / 100 / 100 / 100</em>
      </div>

      <div className="scroll-ind">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
