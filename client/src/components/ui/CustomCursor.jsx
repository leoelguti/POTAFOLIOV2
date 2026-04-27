import { useEffect, useRef } from 'react';

/**
 * Custom cursor with ring follower and trail canvas.
 * Ported from original portfolio.
 */
export default function CustomCursor() {
  const curRef = useRef(null);
  const ringRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
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
      trail.push({ x: mx, y: my, a: 1 });
      if (trail.length > 28) trail.shift();
    };
    document.addEventListener('mousemove', onMouseMove);

    // Hover effects for interactive elements
    const addHoverEffects = () => {
      const interactives = document.querySelectorAll('a, button, .pcard, .stag, .ftab');
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

      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });

      return () => {
        interactives.forEach((el) => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
      };
    };

    // Delay to let DOM render
    const hoverTimer = setTimeout(addHoverEffects, 500);
    // Also re-bind on mutations
    const mutObs = new MutationObserver(() => {
      addHoverEffects();
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

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
      clearTimeout(hoverTimer);
      mutObs.disconnect();
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div ref={curRef} id="cur" />
      <div ref={ringRef} id="cur-ring" />
      <canvas ref={trailRef} id="cur-trail" />
    </>
  );
}
