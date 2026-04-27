import { useRef, useEffect } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SITE_CONFIG } from '../../utils/constants';

/**
 * About section with bio text and interactive tilt code card.
 */
export default function About() {
  const sectionRef = useScrollReveal();
  const tiltRef = useRef(null);

  useEffect(() => {
    const card = tiltRef.current;
    if (!card) return;
    const wrap = card.parentElement;

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale(1.02)`;
      card.style.setProperty('--tx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--ty', ((e.clientY - r.top) / r.height * 100) + '%');
    };
    const onLeave = () => {
      card.style.transform = '';
    };

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    return () => {
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="sec" id="about" ref={sectionRef}>
      <div className="about-g">
        <div>
          <div className="eyebrow">About Me</div>
          <div className="sh rev">Engineer by craft,<br />builder by obsession.</div>
          <p className="ap rev">
            I'm a <strong>full-stack software engineer</strong> with 4+ years turning complex ideas into
            elegant, production-ready products. My stack of choice — <strong>Node.js, React & modern CSS</strong> — lets me move fast without cutting corners.
          </p>
          <p className="ap rev">
            I care deeply about <strong>developer experience, clean architecture</strong>, and shipping
            software that's a joy to use. Whether it's a real-time dashboard, a headless API, or a
            pixel-perfect UI, I treat every layer with equal respect.
          </p>
        </div>
        <div className="tilt-wrap rev">
          <div className="tilt-card" ref={tiltRef}>
            <div className="code-top">
              <div className="cdot" style={{ background: '#ff5f57' }} />
              <div className="cdot" style={{ background: '#febc2e' }} />
              <div className="cdot" style={{ background: '#28c840' }} />
              <span className="ct">developer.config.ts</span>
            </div>
            <div className="code-body">
              <div className="cl"><span className="ln">1</span><span className="kw">const</span> <span className="fn">dev</span> <span className="pn">= {'{'}</span></div>
              <div className="cl"><span className="ln">2</span><span className="prop">  name</span><span className="pn">:</span> <span className="str">"{SITE_CONFIG.name}"</span><span className="pn">,</span></div>
              <div className="cl"><span className="ln">3</span><span className="prop">  role</span><span className="pn">:</span> <span className="str">"Full-Stack Engineer"</span><span className="pn">,</span></div>
              <div className="cl"><span className="ln">4</span><span className="prop">  stack</span><span className="pn">: [</span><span className="str">"Node"</span><span className="pn">,</span><span className="str">"React"</span><span className="pn">,</span><span className="str">"Vite"</span><span className="pn">],</span></div>
              <div className="cl"><span className="ln">5</span><span className="prop">  yoe</span><span className="pn">:</span> <span className="nu">4</span><span className="pn">,</span></div>
              <div className="cl"><span className="ln">6</span><span className="prop">  open</span><span className="pn">:</span> <span className="kw">true</span><span className="pn">,</span></div>
              <div className="cl"><span className="ln">7</span><span className="prop">  coffee</span><span className="pn">:</span> <span className="str">"always"</span></div>
              <div className="cl"><span className="ln">8</span><span className="pn">{'}'};</span></div>
              <div className="cl"><span className="ln">9</span><span className="cm">{'// currently: building cool things ✨'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
