import { useEffect, useRef, useCallback } from 'react';

/**
 * Canvas thumbnail animation for project cards.
 * Renders animated gradient blobs and particles.
 */
export default function ProjectCardCanvas({ hue, seed }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = (canvas.width = canvas.offsetWidth || 320);
    const H = (canvas.height = 190);
    let t = 0;
    let animId;

    const anim = () => {
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, `hsla(${hue},80%,7%,1)`);
      g.addColorStop(1, `hsla(${hue + 45},65%,11%,1)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < 3; i++) {
        const x = W * (0.18 + i * 0.32 + Math.sin(t * 0.38 + i * 2.1 + seed) * 0.13);
        const y = H * (0.5 + Math.cos(t * 0.28 + i * 1.6 + seed) * 0.28);
        const r = 55 + 28 * Math.sin(t * 0.48 + i + seed);
        const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, `hsla(${hue + i * 32},90%,62%,.16)`);
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < 14; i++) {
        const px = W * ((Math.sin(i * 543.2 + seed) * 127 + 128) / 256);
        const py = H * ((Math.cos(i * 321.7 + seed) * 127 + 128) / 256);
        const sz = 0.8 + Math.sin(t * 0.7 + i) * 0.5;
        ctx.beginPath();
        ctx.arc(px + Math.sin(t * 0.38 + i) * 7, py + Math.cos(t * 0.28 + i) * 7, sz, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue + i * 18},90%,72%,.55)`;
        ctx.fill();
      }

      t += 0.016;
      animId = requestAnimationFrame(anim);
    };
    anim();

    return () => cancelAnimationFrame(animId);
  }, [hue, seed]);

  useEffect(() => {
    const cleanup = draw();
    return cleanup;
  }, [draw]);

  return <canvas ref={canvasRef} />;
}
