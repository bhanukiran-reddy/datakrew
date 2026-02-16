'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './hero.module.css';

const CONFIG = {
  blobs: [
    { x: 0.188, y: 0.218, color: '#132c30', size: 0.25 },
    { x: 0.798, y: 0.219, color: '#132c30', size: 0.22 },
    { x: 0.426, y: 0.525, color: '#1a4148', size: 0.40 },
    { x: 0.775, y: 0.619, color: '#0f1e21', size: 0.25 }
  ],
  fpsLimit: 30,
  speedBase: 0.05,
  interactionStrength: 0.02
};

class BlobParticle {
  index: number;
  def: { x: number; y: number; color: string; size: number };
  x: number = 0;
  y: number = 0;
  anchorX: number = 0;
  anchorY: number = 0;
  phaseX: number = 0;
  phaseY: number = 0;
  radius: number = 0;
  color: string = '';

  constructor(width: number, height: number, index: number) {
    this.index = index;
    this.def = CONFIG.blobs[index];
    this.reset(width, height, true);
  }

  reset(w: number, h: number, initial = false) {
    this.anchorX = this.def.x * w;
    this.anchorY = this.def.y * h;
    this.x = this.anchorX;
    this.y = this.anchorY;
    this.phaseX = Math.random() * Math.PI * 2;
    this.phaseY = Math.random() * Math.PI * 2;
    this.radius = w * this.def.size;
    this.color = this.def.color;
  }

  update(width: number, height: number, mouseX: number, mouseY: number) {
    this.phaseX += CONFIG.speedBase * 0.05;
    this.phaseY += CONFIG.speedBase * 0.05;

    const driftX = Math.sin(this.phaseX) * (width * 0.03);
    const driftY = Math.cos(this.phaseY) * (height * 0.03);

    const nx = (mouseX / width) * 2 - 1;
    const ny = (mouseY / height) * 2 - 1;

    this.x = this.anchorX + driftX + (nx * width * CONFIG.interactionStrength);
    this.y = this.anchorY + driftY + (ny * height * CONFIG.interactionStrength);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    g.addColorStop(0, this.hexToRgba(this.color, 0.5));
    g.addColorStop(1, this.hexToRgba(this.color, 0));

    ctx.fillStyle = g;
    ctx.globalCompositeOperation = 'screen';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const resizeTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const state = {
      isPlaying: true,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      mouseX: 0,
      mouseY: 0,
      ctx: canvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D,
      particles: [] as BlobParticle[],
      width: 0,
      height: 0,
      dpr: 1
    };

    let lastTime = 0;
    const interval = 1000 / CONFIG.fpsLimit;

    const handleResize = () => {
      if (!container) return;
      
      state.dpr = Math.min(window.devicePixelRatio, 1.5);
      state.width = container.clientWidth;
      state.height = container.clientHeight;

      canvas.width = state.width * state.dpr;
      canvas.height = state.height * state.dpr;
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;

      state.ctx.scale(state.dpr, state.dpr);
      state.particles = CONFIG.blobs.map((_, i) => new BlobParticle(state.width, state.height, i));
    };

    const handleMouseMove = (e: MouseEvent) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
    };

    const draw = () => {
      state.ctx.clearRect(0, 0, state.width, state.height);
      state.particles.forEach(p => {
        p.update(state.width, state.height, state.mouseX, state.mouseY);
        p.draw(state.ctx);
      });
    };

    const animate = (timestamp: number) => {
      if (!state.isPlaying) return;
      const deltaTime = timestamp - lastTime;

      if (deltaTime >= interval) {
        lastTime = timestamp - (deltaTime % interval);
        draw();
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    handleResize();
    state.mouseX = state.width / 2;
    state.mouseY = state.height / 2;

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            state.isPlaying = !state.reducedMotion;
            if (state.isPlaying) {
              animationFrameRef.current = requestAnimationFrame(animate);
            }
            setIsLoaded(true);
          } else {
            state.isPlaying = false;
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    // Event listeners
    const resizeHandler = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('mousemove', handleMouseMove);

    // Visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        state.isPlaying = false;
      } else {
        state.isPlaying = !state.reducedMotion;
        if (state.isPlaying) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation if not reduced motion
    if (!state.reducedMotion) {
      animationFrameRef.current = requestAnimationFrame(animate);
      setIsLoaded(true);
    } else {
      draw();
      setIsLoaded(true);
    }

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.canvasContainer}>
      <canvas
        ref={canvasRef}
        className={`${styles.heroCanvas} ${isLoaded ? styles.loaded : ''}`}
      />
      {/* Fallback gradient */}
      <div className={styles.fallbackGradient} />
    </div>
  );
}
