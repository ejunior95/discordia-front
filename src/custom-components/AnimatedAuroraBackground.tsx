import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2, Vec3 } from 'ogl';

/**
 * AnimatedAuroraBackground
 * ------------------------
 * Raymarched 3D blob rendered with OGL (~8kb gz).
 * - Smooth-union of morphing spheres -> organic close-up form.
 * - Procedural fabric/weave bump perturbs the normals -> textile feel.
 * - Slow camera dolly + rotation gives a "camera flying past the shape" mood.
 * - Two-light setup: blue key (#0F6CA7) + orange rim (#E48318).
 * - Subtle grain + vignette overlays add filmic texture.
 * - Respects prefers-reduced-motion (renders a single frozen frame).
 * - Falls back to a static gradient if WebGL is unavailable.
 */

const COLOR_PRIMARY = new Vec3(0.0588, 0.4235, 0.6549); // #0F6CA7
const COLOR_ACCENT = new Vec3(0.8941, 0.5137, 0.0941); // #E48318
const COLOR_DEEP = new Vec3(0.0314, 0.1098, 0.1882); // deep navy for depth

const VERT = /* glsl */ `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec3  uColorA; // primary blue  (key light / body)
  uniform vec3  uColorB; // accent orange (rim light)
  uniform vec3  uColorC; // deep base     (fog / ambient)

  // ---------- helpers ----------
  mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.0,-s, 0.0,1.0,0.0, s,0.0,c); }
  mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.0,0.0,0.0, 0.0,c,-s, 0.0,s,c); }

  float smin(float a, float b, float k){
    float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0-h);
  }

  float sdSphere(vec3 p, float r){ return length(p) - r; }

  // ---------- scene SDF: morphing blob ----------
  float sdScene(vec3 p){
    vec3 q = rotY(uTime*0.18) * rotX(uTime*0.11) * p;

    float d = sdSphere(q, 1.10);
    d = smin(d, sdSphere(q - vec3( 0.95*sin(uTime*0.30),  0.60*cos(uTime*0.40),  0.10), 0.72), 0.60);
    d = smin(d, sdSphere(q - vec3(-0.85*cos(uTime*0.25),  0.55*sin(uTime*0.35),  0.40), 0.62), 0.55);
    d = smin(d, sdSphere(q - vec3( 0.20, -0.90*sin(uTime*0.22),  0.80*cos(uTime*0.30)), 0.58), 0.55);
    d = smin(d, sdSphere(q - vec3(-0.30*sin(uTime*0.18),  0.10,  -0.85*cos(uTime*0.27)), 0.55), 0.50);
    return d;
  }

  vec3 calcNormal(vec3 p){
    vec2 e = vec2(0.0012, 0.0);
    return normalize(vec3(
      sdScene(p + e.xyy) - sdScene(p - e.xyy),
      sdScene(p + e.yxy) - sdScene(p - e.yxy),
      sdScene(p + e.yyx) - sdScene(p - e.yyx)
    ));
  }

  // ---------- fabric weave: two perpendicular sin patterns ----------
  float fabricBump(vec3 p){
    float F = 55.0;
    float warp = sin(p.x * F) * 0.5 + sin(p.y * F) * 0.5;
    float weft = sin((p.x + p.z) * F * 0.85 + 1.5707) * 0.5
               + sin((p.y - p.z) * F * 0.85)          * 0.5;
    // small irregularity so it doesn't look perfectly mechanical
    float jitter = sin(p.x*9.0 + p.y*7.3 + p.z*5.1) * 0.15;
    return (warp + weft) * 0.5 + jitter;
  }

  vec3 perturbNormal(vec3 n, vec3 p){
    vec2 e = vec2(0.004, 0.0);
    vec3 grad = vec3(
      fabricBump(p + e.xyy) - fabricBump(p - e.xyy),
      fabricBump(p + e.yxy) - fabricBump(p - e.yxy),
      fabricBump(p + e.yyx) - fabricBump(p - e.yyx)
    );
    return normalize(n + grad * 0.55);
  }

  void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

    // ---- camera dolly along Z, "flying past" the shape ----
    float camZ = 2.7 + sin(uTime * 0.10) * 0.55;
    float camY = sin(uTime * 0.07) * 0.15;
    vec3 ro = vec3(0.0, camY, camZ);
    vec3 rd = normalize(vec3(uv, -1.4));

    // ---- raymarch ----
    float t = 0.0;
    bool  hit = false;
    vec3  p = ro;
    for (int i = 0; i < 84; i++) {
      p = ro + rd * t;
      float d = sdScene(p);
      if (d < 0.0015) { hit = true; break; }
      if (t > 7.5) break;
      t += d * 0.92;
    }

    vec3 col = uColorC * 0.35;

    if (hit) {
      vec3 n = calcNormal(p);
      n = perturbNormal(n, p);

      vec3 lKey = normalize(vec3(-0.55,  0.85,  0.55)); // upper-left blue
      vec3 lRim = normalize(vec3( 0.75, -0.20, -0.30)); // back-right orange

      float diff  = max(dot(n,  lKey), 0.0);
      float diffO = max(dot(n,  lRim), 0.0);
      float fres  = pow(1.0 - max(dot(n, -rd), 0.0), 2.2);

      vec3 base = mix(uColorC, uColorA, 0.55 + diff * 0.45);
      base += uColorA * diff  * 0.55;
      base += uColorB * fres  * 0.90;   // bright orange rim
      base += uColorB * diffO * 0.22;   // subtle orange fill from behind

      // micro fabric color variation
      base += vec3(fabricBump(p)) * 0.07;

      col = base;
    }

    // depth fog -> shape emerges from darkness
    float fog = 1.0 - exp(-t * 0.16);
    col = mix(col, uColorC * 0.22, fog * (hit ? 0.55 : 1.0));

    // soft vignette
    float vig = smoothstep(1.45, 0.30, length(uv));
    col *= mix(0.70, 1.05, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function AnimatedAuroraBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        alpha: false,
        antialias: false,
      });
    } catch {
      // WebGL unavailable -> CSS fallback stays visible.
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(
      COLOR_DEEP.x,
      COLOR_DEEP.y,
      COLOR_DEEP.z,
      1,
    );

    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(1, 1) },
        uColorA: { value: COLOR_PRIMARY },
        uColorB: { value: COLOR_ACCENT },
        uColorC: { value: COLOR_DEEP },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      (program.uniforms.uResolution.value as Vec2).set(
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      );
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let raf = 0;
    const start = performance.now();

    const renderFrame = (now: number) => {
      program.uniforms.uTime.value = (now - start) * 0.001;
      renderer.render({ scene: mesh });
      if (!reducedMotion) raf = requestAnimationFrame(renderFrame);
    };

    if (reducedMotion) {
      // Render a single static frame.
      renderFrame(start);
    } else {
      raf = requestAnimationFrame(renderFrame);
    }

    // Pause animation when tab hidden to save battery.
    const onVisibility = () => {
      if (reducedMotion) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(renderFrame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      ro.disconnect();
      if (canvas.parentNode === container) container.removeChild(canvas);
      const ext = gl.getExtension('WEBGL_lose_context');
      ext?.loseContext();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* CSS fallback if WebGL fails or before canvas mounts */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 20% 20%, #0F6CA7 0%, #082640 55%, #050d18 100%), radial-gradient(60% 50% at 80% 80%, #E48318 0%, transparent 60%)',
        }}
      />
      {/* WebGL canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Grain / film noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: '220px 220px',
        }}
      />

      {/* Inner edge vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  );
}
