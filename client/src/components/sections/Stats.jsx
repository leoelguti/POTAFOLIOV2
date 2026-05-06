import { useEffect, useRef } from 'react';
import { STATS } from '../../utils/constants';

function animateCount(el, target, suffix = '') {
  let start = null;
  const duration = 1800;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target) + (p >= 1 ? suffix : '');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function Stats() {
  const countRefs = useRef([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            const stat = STATS[idx];
            if (reduced) {
              entry.target.textContent = stat.value + stat.suffix;
            } else {
              animateCount(entry.target, stat.value, stat.suffix);
            }
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    countRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats-band">
      <div className="stats-grid">
        {STATS.map((stat, i) => (
          <div className="stat-item rev in" key={stat.label} style={{ transitionDelay: `${i * 0.08}s` }}>
            <div
              className="stat-val"
              data-idx={i}
              ref={(el) => (countRefs.current[i] = el)}
              aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
            >
              0
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
