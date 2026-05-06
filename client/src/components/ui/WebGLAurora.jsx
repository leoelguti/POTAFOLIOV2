import { useEffect, useRef } from 'react';

/**
 * WebGL Aurora Background — ported from the original portfolio.
 * Full-screen animated shader background with mouse interaction.
 */
export default function WebGLAurora() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const c = canvasRef.current;
    if (!c) return;

    const gl = c.getContext('webgl');
    if (!gl) return;

    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      gl.viewport(0, 0, c.width, c.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const vertSrc = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
    const fragSrc = `
      precision highp float;
      uniform float t;
      uniform vec2 res;
      uniform vec2 mouse;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.;float a=.5;for(int i=0;i<6;i++){v+=a*n(p);p=p*2.1+vec2(1.7,9.2);a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/res;
        vec2 m=mouse/res*2.-1.;
        float time=t*.15;
        vec2 q=uv+vec2(sin(time*.3+uv.y*2.5),cos(time*.2+uv.x*1.8))*.07;
        q+=m*.06;
        float f=fbm(q*2.8+time);
        f=fbm(q*2.2+vec2(f*1.2,f*.9)+time*.5);
        vec3 c1=vec3(.02,.01,.08);
        vec3 c2=vec3(.1,.04,.28);
        vec3 c3=vec3(.0,.22,.48);
        vec3 c4=vec3(.18,.02,.12);
        vec3 col=mix(c1,c2,clamp(f*1.6,0.,1.));
        col=mix(col,c3,clamp((f-.28)*2.4,0.,1.));
        col=mix(col,c4,clamp((f-.62)*2.2,0.,1.));
        col+=vec3(.015,.008,.04)*fbm(uv*9.+time*.8)*.5;
        float vig=1.-smoothstep(.35,1.15,length(uv-.5)*1.6);
        gl_FragColor=vec4(col*vig,1.);
      }`;

    const makeShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, makeShader(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, makeShader(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, 't');
    const uR = gl.getUniformLocation(prog, 'res');
    const uM = gl.getUniformLocation(prog, 'mouse');

    let pmx = window.innerWidth / 2;
    let pmy = window.innerHeight / 2;
    let smx = pmx;
    let smy = pmy;

    const onMouseMove = (e) => {
      pmx = e.clientX;
      pmy = window.innerHeight - e.clientY;
    };
    document.addEventListener('mousemove', onMouseMove);

    const start = performance.now();
    let animId;

    const loop = () => {
      smx += (pmx - smx) * 0.05;
      smy += (pmy - smy) * 0.05;
      gl.uniform1f(uT, (performance.now() - start) / 1000);
      gl.uniform2f(uR, c.width, c.height);
      gl.uniform2f(uM, smx, smy);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="glc" aria-hidden="true" />;
}
