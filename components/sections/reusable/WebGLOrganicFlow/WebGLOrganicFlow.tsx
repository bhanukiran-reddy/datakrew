'use client';

import { useEffect, useRef, useState } from 'react';
import { VERTEX_SHADER, FRAGMENT_SHADER } from './organicFlowShaders';
import styles from './WebGLOrganicFlow.module.css';

const COLS = 200;
const ROWS = 100;
const NUM_PARTICLES = COLS * ROWS;

const DEFAULT_CONFIG = {
  baseSize: 10.5,
  sizeVariation: 2.0,
};

/* Match site background (--background: #101215) */
const CLEAR_COLOR = [16 / 255, 18 / 255, 21 / 255, 1.0] as const;
const RESIZE_DEBOUNCE_MS = 120;
const PIXEL_RATIO_CAP = 2;

export type WebGLOrganicFlowProps = {
  className?: string;
  style?: React.CSSProperties;
  baseSize?: number;
  sizeVariation?: number;
  ariaHidden?: boolean;
};

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function WebGLOrganicFlow({
  className,
  style,
  baseSize = DEFAULT_CONFIG.baseSize,
  sizeVariation = DEFAULT_CONFIG.sizeVariation,
  ariaHidden = true,
}: WebGLOrganicFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const resizeTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [fallback, setFallback] = useState(false);
  const stateRef = useRef<{
    gl: WebGLRenderingContext | null;
    program: WebGLProgram | null;
    buffer: WebGLBuffer | null;
    numParticles: number;
    uTime: WebGLUniformLocation | null;
    uResolution: WebGLUniformLocation | null;
    uPixelRatio: WebGLUniformLocation | null;
    uBaseSize: WebGLUniformLocation | null;
    uSizeVariation: WebGLUniformLocation | null;
    width: number;
    height: number;
    dpr: number;
    isPlaying: boolean;
    contextLost: boolean;
  }>({
    gl: null,
    program: null,
    buffer: null,
    numParticles: NUM_PARTICLES,
    uTime: null,
    uResolution: null,
    uPixelRatio: null,
    uBaseSize: null,
    uSizeVariation: null,
    width: 0,
    height: 0,
    dpr: 1,
    isPlaying: false,
    contextLost: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) {
      setFallback(true);
      return;
    }

    const vert = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) {
      setFallback(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setFallback(true);
      return;
    }
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      setFallback(true);
      return;
    }
    gl.useProgram(program);

    const data = new Float32Array(NUM_PARTICLES * 2);
    let i = 0;
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        data[i++] = x / (COLS - 1);
        data[i++] = y / (ROWS - 1);
      }
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uPixelRatio = gl.getUniformLocation(program, 'u_pixelRatio');
    const uBaseSize = gl.getUniformLocation(program, 'u_baseSize');
    const uSizeVariation = gl.getUniformLocation(program, 'u_sizeVariation');

    const state = stateRef.current;
    state.gl = gl;
    state.program = program;
    state.buffer = buffer;
    state.uTime = uTime;
    state.uResolution = uResolution;
    state.uPixelRatio = uPixelRatio;
    state.uBaseSize = uBaseSize;
    state.uSizeVariation = uSizeVariation;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      if (!canvas || !container || !gl || state.contextLost) return;
      const rect = container.getBoundingClientRect();
      const w = rect.width || container.clientWidth || 1;
      const h = rect.height || container.clientHeight || 1;
      const dpr = Math.min(
        typeof window !== 'undefined' ? window.devicePixelRatio : 1,
        PIXEL_RATIO_CAP
      );
      state.width = w;
      state.height = h;
      state.dpr = dpr;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uPixelRatio, dpr);
    }

    function draw(time: number) {
      if (!state.isPlaying || state.contextLost || !state.gl) return;
      const { gl: g } = state;
      g.useProgram(program);
      g.clear(g.COLOR_BUFFER_BIT);
      g.uniform1f(uTime, time * 0.001);
      g.uniform1f(uBaseSize, baseSize);
      g.uniform1f(uSizeVariation, sizeVariation);
      g.drawArrays(g.POINTS, 0, NUM_PARTICLES);
    }

    function animate(timestamp: number) {
      draw(timestamp);
      if (state.isPlaying && !state.contextLost) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    function startLoop() {
      if (state.contextLost || reducedMotion) return;
      state.isPlaying = true;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    function stopLoop() {
      state.isPlaying = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    }

    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        resize();
        resizeTimerRef.current = undefined;
      }, RESIZE_DEBOUNCE_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      state.contextLost = true;
      stopLoop();
      setFallback(true);
    };

    const handleContextRestored = () => {
      state.contextLost = false;
      /* Context is reset; program/buffers are invalid. Keep fallback so user can refresh. */
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    gl.clearColor(CLEAR_COLOR[0], CLEAR_COLOR[1], CLEAR_COLOR[2], CLEAR_COLOR[3]);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    requestAnimationFrame(() => {
      resize();
      if (reducedMotion) {
        draw(0);
      } else {
        state.isPlaying = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [baseSize, sizeVariation]);

  if (fallback) {
    return (
      <div
        ref={containerRef}
        className={`${styles.root} ${className ?? ''}`}
        style={style}
        aria-hidden={ariaHidden}
      >
        <div className={styles.fallback} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.root} ${className ?? ''}`}
      style={style}
      aria-hidden={ariaHidden}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
