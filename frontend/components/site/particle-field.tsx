"use client";

import { useCallback, useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  cyan: boolean;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

// Kepadatan dijaga rendah dan fase tumbukan antarpartikel dihilangkan
// (O(n²), mahal) supaya tetap ringan di mesin sederhana
const DENSITY = 0.00009;
const DUST_DENSITY = 0.00004;
const MOUSE_RADIUS = 160;
const RETURN_SPEED = 0.08;
const DAMPING = 0.9;
const REPULSION = 1.2;

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Lapisan partikel interaktif untuk latar seksi apa pun: titik-titik putih/cyan
 * yang menghindar dari kursor lalu memantul kembali ke tempatnya, di
 * atas debu yang berkelap-kelip. Animasi hanya berjalan saat seksi
 * terlihat, dan dilewati saat prefers-reduced-motion.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const dust = useRef<DustParticle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const frameId = useRef(0);
  const visible = useRef(false);

  const init = useCallback((width: number, height: number) => {
    const count = Math.floor(width * height * DENSITY);
    particles.current = Array.from({ length: count }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x,
        y,
        originX: x,
        originY: y,
        vx: 0,
        vy: 0,
        size: rand(1, 2.4),
        cyan: Math.random() > 0.85,
      };
    });
    const dustCount = Math.floor(width * height * DUST_DENSITY);
    dust.current = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: rand(0.5, 1.4),
      alpha: rand(0.08, 0.3),
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const wrapper = canvas?.parentElement?.parentElement; // elemen seksi pembungkus
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cssWidth = 0;
    let cssHeight = 0;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      cssWidth = rect.width;
      cssHeight = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(cssWidth, cssHeight);
    };

    const animate = (time: number) => {
      frameId.current = requestAnimationFrame(animate);
      if (!visible.current) return;
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Debu latar berkelap-kelip
      for (const d of dust.current) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = cssWidth;
        if (d.x > cssWidth) d.x = 0;
        if (d.y < 0) d.y = cssHeight;
        if (d.y > cssHeight) d.y = 0;
        const twinkle = Math.sin(time * 0.002 + d.phase) * 0.5 + 0.5;
        ctx.globalAlpha = d.alpha * (0.3 + 0.7 * twinkle);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Partikel utama: tolakan kursor + pegas kembali ke asal
      const m = mouse.current;
      for (const p of particles.current) {
        if (m.active) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_RADIUS && dist > 0.01) {
            const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * REPULSION;
            p.vx -= (dx / dist) * force * 5;
            p.vy -= (dy / dist) * force * 5;
          }
        }
        p.vx += (p.originX - p.x) * RETURN_SPEED;
        p.vy += (p.originY - p.y) * RETURN_SPEED;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.hypot(p.vx, p.vy);
        const opacity = Math.min(0.35 + speed * 0.12, 1);
        ctx.fillStyle = p.cyan
          ? `rgba(53, 194, 232, ${Math.min(opacity + 0.15, 1)})`
          : `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onLeave = () => {
      mouse.current.active = false;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(wrapper);

    resize();
    window.addEventListener("resize", resize);
    wrapper.addEventListener("mousemove", onMove, { passive: true });
    wrapper.addEventListener("mouseleave", onLeave);
    frameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId.current);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      wrapper.removeEventListener("mousemove", onMove);
      wrapper.removeEventListener("mouseleave", onLeave);
    };
  }, [init]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
