'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './hero.module.css';

// Beautiful color palette - teal/cyan variations with different intensities
const COLOR_PALETTE = [
  { base: '#1e4e57', intensity: 0.8 }, // Main brand teal - highest intensity
  { base: '#2A9DB3', intensity: 0.7 }, // Slightly darker - high intensity
  { base: '#1e4e57', intensity: 0.75 }, // Lighter teal - medium-high
  { base: '#082f36', intensity: 0.65 }, // Darker variant - medium
  { base: '#5AD5E9', intensity: 0.55 }, // Lightest - medium-low
  { base: '#0D6C7D', intensity: 0.45 }, // Deep teal - low
];

const CONFIG = {
  waveCount: 20, // Multiple flowing waves
  fpsLimit: 60,
  waveSpeed: 0.015, // Slow, organic wave motion
  flowSpeed: 0.008, // Gentle flowing speed
  waveAmplitude: 0.12, // How wavy the streaks are
  verticalFlow: 0.006, // Vertical drift
  noiseAmount: 0.02, // Subtle noise for organic feel
};

class WaveStreak {
  index: number;
  x: number = 0;
  y: number = 0;
  baseX: number = 0;
  baseY: number = 0;
  phase: number = 0;
  flowPhase: number = 0;
  noisePhase: number = 0;
  length: number = 0;
  width: number = 0;
  color: string = '';
  intensity: number = 0;
  speed: number = 0;
  direction: number = 0;

  constructor(width: number, height: number, index: number) {
    this.index = index;
    this.reset(width, height);
  }

  reset(w: number, h: number) {
    // Random starting position across the screen
    this.baseX = (this.index / CONFIG.waveCount) * w + (Math.random() - 0.5) * w * 0.3;
    this.baseY = h * (0.15 + (this.index / CONFIG.waveCount) * 0.7);
    
    // Random flow direction (left to right or right to left)
    this.direction = Math.random() > 0.5 ? 1 : -1;
    
    // Varying lengths and widths for organic feel
    this.length = w * (0.4 + Math.random() * 0.4); // 40-80% of screen width
    this.width = h * (0.08 + Math.random() * 0.12); // 8-20% of screen height
    
    // Random phases for independent motion
    this.phase = Math.random() * Math.PI * 2;
    this.flowPhase = Math.random() * Math.PI * 2;
    this.noisePhase = Math.random() * Math.PI * 2;
    
    // Varying speeds for depth
    this.speed = 0.008 + Math.random() * 0.01;
    
    // Random color and intensity from palette
    const colorData = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    this.color = colorData.base;
    this.intensity = colorData.intensity * (0.7 + Math.random() * 0.3); // Vary intensity
    
    // Start position
    this.x = this.baseX;
    this.y = this.baseY;
  }

  update(width: number, height: number, time: number) {
    // Wavy horizontal motion using sine waves
    this.phase += CONFIG.waveSpeed * (0.8 + Math.random() * 0.4);
    const waveX = Math.sin(this.phase) * (width * CONFIG.waveAmplitude);
    
    // Flowing motion (horizontal drift) - REDUCED to keep within bounds
    this.flowPhase += this.speed * this.direction;
    const flowX = Math.sin(this.flowPhase) * (width * 0.08); // Reduced from 0.15 to 0.08
    
    // Vertical gentle drift
    const verticalDrift = Math.sin(this.flowPhase * 0.7) * (height * 0.05);
    
    // Subtle noise for organic movement - REDUCED
    this.noisePhase += CONFIG.noiseAmount;
    const noiseX = Math.sin(this.noisePhase) * (width * 0.01); // Reduced from 0.02
    const noiseY = Math.cos(this.noisePhase * 1.3) * (height * 0.01); // Reduced from 0.02
    
    // Update position - CLAMP to canvas bounds
    this.x = Math.max(-this.length * 0.5, Math.min(width + this.length * 0.5, 
      this.baseX + waveX + flowX + noiseX));
    this.y = Math.max(-this.width * 0.5, Math.min(height + this.width * 0.5,
      this.baseY + verticalDrift + noiseY));
    
    // Wrap around screen edges for continuous flow - IMPROVED bounds checking
    if (this.x < -this.length * 0.5) {
      this.x = width + this.length * 0.5;
      this.baseX = width + this.length * 0.5;
    }
    if (this.x > width + this.length * 0.5) {
      this.x = -this.length * 0.5;
      this.baseX = -this.length * 0.5;
    }
    
    // Clamp Y position to stay within bounds
    if (this.y < -this.width * 0.5) {
      this.y = height + this.width * 0.5;
      this.baseY = height + this.width * 0.5;
    }
    if (this.y > height + this.width * 0.5) {
      this.y = -this.width * 0.5;
      this.baseY = -this.width * 0.5;
    }
  }

  draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    // Only draw if wave is within or near canvas bounds (with some margin for blur)
    const margin = Math.max(this.length, this.width) * 0.5;
    if (this.x < -margin || this.x > canvasWidth + margin) return;
    if (this.y < -margin || this.y > canvasHeight + margin) return;
    
    // Create elongated gradient for streak effect
    const gradient = ctx.createLinearGradient(
      this.x - this.length / 2, this.y,
      this.x + this.length / 2, this.y
    );
    
    // Gradient with varying intensity - brighter in center, fading at edges
    const centerIntensity = this.intensity;
    const edgeIntensity = this.intensity * 0.3;
    const fadeIntensity = 0;
    
    gradient.addColorStop(0, this.hexToRgba(this.color, fadeIntensity));
    gradient.addColorStop(0.2, this.hexToRgba(this.color, edgeIntensity));
    gradient.addColorStop(0.5, this.hexToRgba(this.color, centerIntensity));
    gradient.addColorStop(0.8, this.hexToRgba(this.color, edgeIntensity));
    gradient.addColorStop(1, this.hexToRgba(this.color, fadeIntensity));

    ctx.fillStyle = gradient;
    ctx.globalCompositeOperation = 'screen';
    
    // Draw elongated ellipse for wavy streak
    ctx.beginPath();
    ctx.ellipse(
      this.x, this.y,
      this.length / 2, // Horizontal radius
      this.width / 2, // Vertical radius (creates the streak width)
      Math.sin(this.phase) * 0.3, // Slight rotation for wavy effect
      0, Math.PI * 2
    );
    ctx.fill();
    
    // Add subtle radial glow at center for extra depth
    const radialGradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.width * 0.6
    );
    radialGradient.addColorStop(0, this.hexToRgba(this.color, centerIntensity * 0.5));
    radialGradient.addColorStop(1, this.hexToRgba(this.color, 0));
    
    ctx.fillStyle = radialGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width * 0.6, 0, Math.PI * 2);
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
  const timeRef = useRef<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const state = {
      isPlaying: true,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      ctx: canvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D,
      particles: [] as WaveStreak[],
      width: 0,
      height: 0,
      dpr: 1
    };

    let lastTime = 0;
    const interval = 1000 / CONFIG.fpsLimit;

    const handleResize = () => {
      if (!container) return;
      
      // Use getBoundingClientRect for accurate dimensions
      const rect = container.getBoundingClientRect();
      state.width = rect.width || container.clientWidth || window.innerWidth;
      state.height = rect.height || container.clientHeight || window.innerHeight;
      
      // Ensure we have valid dimensions
      if (state.width <= 0 || state.height <= 0) {
        state.width = window.innerWidth;
        state.height = window.innerHeight;
      }
      
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      
      // Set canvas internal resolution (actual pixels)
      canvas.width = state.width * state.dpr;
      canvas.height = state.height * state.dpr;
      
      // Set canvas display size (CSS pixels) - MUST match container exactly
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      
      // Reset transform matrix first, then scale
      state.ctx.setTransform(1, 0, 0, 1, 0, 0);
      state.ctx.scale(state.dpr, state.dpr);
      
      // Recreate particles with CSS pixel dimensions (not internal canvas pixels)
      state.particles = Array.from(
        { length: CONFIG.waveCount },
        (_, i) => new WaveStreak(state.width, state.height, i)
      );
    };

    const draw = () => {
      // Clear with transparent background (alpha channel)
      // Use CSS pixel dimensions (state.width/height) since context is already scaled
      state.ctx.clearRect(0, 0, state.width, state.height);
      
      // Draw all wavy streaks using CSS pixel dimensions
      state.particles.forEach(p => {
        p.update(state.width, state.height, timeRef.current);
        p.draw(state.ctx, state.width, state.height);
      });
      
      timeRef.current += 0.01;
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

    // Initialize - use requestAnimationFrame to ensure container is rendered
    requestAnimationFrame(() => {
      handleResize();
      
      // Start animation immediately
      setIsLoaded(true);
      if (!state.reducedMotion) {
        animationFrameRef.current = requestAnimationFrame(animate);
        draw();
      } else {
        draw();
      }
    });

    // Intersection Observer - pause when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            state.isPlaying = !state.reducedMotion;
            if (state.isPlaying && !animationFrameRef.current) {
              animationFrameRef.current = requestAnimationFrame(animate);
            }
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

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeHandler);
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
