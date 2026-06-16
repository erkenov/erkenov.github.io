"use client";

/**
 * BigBangSphere — scroll-scrubbed 3D particle sphere that detonates (Big Bang)
 * and reassembles back into a sphere as you scroll. Ported from the verified
 * standalone (projects/big-bang) into a fixed full-bleed React background.
 *
 * "Use only the particle technology" (Shamil 2026-06-16): always a sphere,
 * no brain/lightbulb morph — just the cloud + the Big-Bang explosion pulses.
 * No bot, no dragon — this is the particle effect alone.
 *
 * Uses the installed `three` (no CDN). Vanilla THREE in a useEffect so the
 * proven logic ports verbatim; renders into a fixed canvas behind page content.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 4200;
// Erken Systems palette (greens) + a couple of cool accents.
const PALETTE = ["#7ea687", "#b8d4be", "#7ea687", "#ffffff", "#8052ff", "#c9b6ff"];

function sphereForm(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    a[i * 3] = Math.cos(th) * r;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = Math.sin(th) * r;
  }
  return a;
}

export function BigBangSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Single sphere "home" for every particle. Expansion is driven globally
    // by scroll (see E below): starts EXPANDED at the top, then breathes
    // assemble↔expand as you scroll (Shamil 2026-06-16).
    const sphere = sphereForm(COUNT);
    const CYCLES = 2; // assemble↔expand breaths across the full page scroll

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const dirs = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const col = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      let x = Math.random() * 2 - 1,
        y = Math.random() * 2 - 1,
        z = Math.random() * 2 - 1;
      const L = Math.hypot(x, y, z) || 1;
      x /= L;
      y /= L;
      z /= L;
      dirs[i * 3] = x;
      dirs[i * 3 + 1] = y;
      dirs[i * 3 + 2] = z;
      col.set(PALETTE[(Math.random() * PALETTE.length) | 0]);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
      sizes[i] = 0.6 + Math.random() * 1.4;
      positions[i * 3] = sphere[i * 3];
      positions[i * 3 + 1] = sphere[i * 3 + 1];
      positions[i * 3 + 2] = sphere[i * 3 + 2];
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3.4);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { uSize: { value: 24.0 * renderer.getPixelRatio() } },
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aSize; varying vec3 vColor; uniform float uSize;
        void main(){
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uSize / (-mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vColor;
        void main(){
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor, a);
        }`,
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    let p = 0,
      target = 0;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const EXPLODE = 2.6;
    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      p += (target - p) * 0.08;

      // Expansion E: 1 = fully expanded (Big-Bang scatter), 0 = tight sphere.
      // cos(0)=1 → starts EXPANDED at the top, then breathes in/out as you
      // scroll, CYCLES full breaths across the page.
      const E = (1 + Math.cos(p * Math.PI * 2 * CYCLES)) / 2;

      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const o = i * 3;
        let x = sphere[o];
        let y = sphere[o + 1];
        let z = sphere[o + 2];
        const ex = E * EXPLODE;
        x += dirs[o] * ex;
        y += dirs[o + 1] * ex;
        z += dirs[o + 2] * ex;
        const s = Math.sin(t * 1.3 + i * 0.7) * 0.006;
        pos[o] = x + s;
        pos[o + 1] = y + s;
        pos[o + 2] = z;
      }
      geo.attributes.position.needsUpdate = true;

      pts.rotation.y = Math.sin(t * 0.25) * 0.18 + p * 0.4;
      pts.rotation.x = Math.sin(t * 0.18) * 0.06;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-0 h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
}

export default BigBangSphere;
