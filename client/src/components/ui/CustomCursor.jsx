import { useEffect, useRef, useState } from 'react';

const HOVER_SELECTOR = 'a, button, .pcard, .stag, .ftab';

function isCursorEnabled() {
  if (typeof window === 'undefined') return false;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return fine && !reduced;
}

export default function CustomCursor() {
  const curRef = useRef(null);
  const ringRef = useRef(null);
  const trailRef = useRef(null);
  const [enabled] = useState(isCursorEnabled);

  useEffect(() => {
    if (!enabled) return;
    const cur = curRef.current;
    const ring = ringRef.current;
    const trailCanvas = trailRef.current;
    if (!cur || !ring || !trailCanvas) return;

    const tctx = trailCanvas.getContext('2d');
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    const trail = [];

    const onResize = () => {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top = my + 'px';
      trail.push({ x: mx, y: my });
      if (trail.length > 28) trail.shift();
    };
    document.addEventListener('mousemove', onMouseMove);

    const onEnter = () => {
      cur.style.width = '16px';
      cur.style.height = '16px';
      cur.style.background = 'var(--a2)';
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(0,212,255,.6)';
    };
    const onLeave = () => {
      cur.style.width = '10px';
      cur.style.height = '10px';
      cur.style.background = 'var(--a1)';
      ring.style.width = '38px';
      ring.style.height = '38px';
      ring.style.borderColor = 'rgba(108,99,255,.5)';
    };

    // Event delegation: one pair of listeners on document instead of binding
    // to every interactive element + re-binding on every DOM mutation.
    const onOver = (e) => {
      if (e.target.closest && e.target.closest(HOVER_SELECTOR)) onEnter();
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest(HOVER_SELECTOR)) onLeave();
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    let animId;
    const loop = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      trail.forEach((p, i) => {
        const a = (i / trail.length) * 0.35;
        tctx.beginPath();
        tctx.arc(p.x, p.y, 2.5 * (i / trail.length), 0, Math.PI * 2);
        tctx.fillStyle = `rgba(108,99,255,${a})`;
        tctx.fill();
      });
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('resize', onResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={curRef} id="cur" aria-hidden="true" />
      <div ref={ringRef} id="cur-ring" aria-hidden="true" />
      <canvas ref={trailRef} id="cur-trail" aria-hidden="true" />
    </>
  );
}
