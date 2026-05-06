import { useEffect, useRef } from 'react';

/**
 * Canvas thumbnail animation for project cards.
 * - Pauses when off-screen (IntersectionObserver) and when tab is hidden.
 * - Respects prefers-reduced-motion (static frame).
 * - Renders blobs + parallax particles + constellation lines.
 * - HiDPI-aware via devicePixelRatio.
 */
export default function ProjectCardCanvas({ hue, seed }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 190;

    const sizeCanvas = () => {
      W = canvas.offsetWidth || 320;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();

    // Stable particle field, derived from seed.
    const particles = Array.from({ length: 18 }, (_, i) => ({
      x: ((Math.sin(i * 543.2 + seed) * 127 + 128) / 256),
      y: ((Math.cos(i * 321.7 + seed) * 127 + 128) / 256),
      phase: i * 0.7 + seed,
    }));

    let mx = 0.5;
    let my = 0.5;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    };
    const onLeave = () => {
      mx = 0.5;
      my = 0.5;
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const renderFrame = (t) => {
      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, `hsla(${hue},85%,8%,1)`);
      g.addColorStop(1, `hsla(${hue + 50},70%,12%,1)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // Subtle vignette
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.9);
      vg.addColorStop(0, 'transparent');
      vg.addColorStop(1, 'rgba(0,0,0,.45)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // Drifting blobs
      const parX = (mx - 0.5) * 22;
      const parY = (my - 0.5) * 14;
      for (let i = 0; i < 3; i++) {
        const x = W * (0.18 + i * 0.32 + Math.sin(t * 0.38 + i * 2.1 + seed) * 0.13) + parX;
        const y = H * (0.5 + Math.cos(t * 0.28 + i * 1.6 + seed) * 0.28) + parY;
        const r = 70 + 32 * Math.sin(t * 0.48 + i + seed);
        const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, `hsla(${hue + i * 36},90%,62%,.22)`);
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Particle positions (current frame)
      const pts = particles.map((p, i) => ({
        x: W * p.x + Math.sin(t * 0.38 + p.phase) * 9 + parX * 0.5,
        y: H * p.y + Math.cos(t * 0.28 + p.phase) * 9 + parY * 0.5,
        sz: 1 + Math.sin(t * 0.7 + i) * 0.6,
        hue: hue + i * 14,
      }));

      // Constellation lines between near particles
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          const maxD = 70;
          if (d2 < maxD * maxD) {
            const a = (1 - Math.sqrt(d2) / maxD) * 0.18;
            ctx.strokeStyle = `hsla(${hue + 30},80%,75%,${a})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,72%,.65)`;
        ctx.fill();
      }
    };

    if (reduced) {
      renderFrame(0);
      return () => {
        canvas.removeEventListener('mousemove', onMove);
        canvas.removeEventListener('mouseleave', onLeave);
      };
    }

    let t = 0;
    let animId = null;
    let visible = true;
    let inView = true;

    const loop = () => {
      t += 0.016;
      renderFrame(t);
      animId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (animId == null && visible && inView) loop();
    };
    const stop = () => {
      if (animId != null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const onVisibility = () => {
      visible = !document.hidden;
      visible ? start() : stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        inView = e.isIntersecting;
        inView ? start() : stop();
      }
    }, { threshold: 0.05 });
    observer.observe(canvas);

    const onResize = () => sizeCanvas();
    window.addEventListener('resize', onResize);

    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [hue, seed]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
