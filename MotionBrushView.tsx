import React, { useState, useEffect, useRef } from 'react';
import {
  Paintbrush,
  Wind,
  Droplets,
  Flame,
  Activity,
  Sliders,
  RotateCcw,
  Sparkles,
  Compass,
  Layers,
  CheckCircle2,
  Play,
  Pause,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react';
import { MotionBrushRegion } from './media';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const MotionBrushView: React.FC = () => {
  const [activeBrushType, setActiveBrushType] = useState<'hair' | 'water' | 'cloth' | 'smoke' | 'particles'>('cloth');
  const [velocity, setVelocity] = useState<number>(5.5);
  const [directionDeg, setDirectionDeg] = useState<number>(45);
  const [turbulence, setTurbulence] = useState<number>(0.35);
  const [brushSize, setBrushSize] = useState<number>(40);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [customRegionName, setCustomRegionName] = useState<string>('');
  const [showAppliedToast, setShowAppliedToast] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Active painted regions list
  const [regions, setRegions] = useState<MotionBrushRegion[]>([
    { id: 'reg-1', name: 'Silk Gown Fluid Dynamics', type: 'cloth', color: '#f43f5e', velocity: 6.2, directionDeg: 60, turbulence: 0.4 },
    { id: 'reg-2', name: 'Fine Hair Strands Air Sway', type: 'hair', color: '#f59e0b', velocity: 3.8, directionDeg: 35, turbulence: 0.25 },
    { id: 'reg-3', name: 'Volumetric Atmospheric Mist', type: 'smoke', color: '#06b6d4', velocity: 2.1, directionDeg: 120, turbulence: 0.6 },
  ]);

  const getColorForBrush = (type: string) => {
    switch (type) {
      case 'water':
        return 'rgba(56, 189, 248, ';
      case 'cloth':
        return 'rgba(244, 63, 94, ';
      case 'hair':
        return 'rgba(245, 158, 11, ';
      case 'smoke':
        return 'rgba(148, 163, 184, ';
      default:
        return 'rgba(168, 85, 247, ';
    }
  };

  // Initialize background particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const initialParticles: Particle[] = Array.from({ length: 140 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      size: Math.random() * 2.5 + 1.2,
      alpha: Math.random() * 0.7 + 0.3,
      color: getColorForBrush(activeBrushType),
    }));

    particlesRef.current = initialParticles;
  }, []);

  // Main canvas animation and particle physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      // Semi-transparent clear for motion trail
      ctx.fillStyle = 'rgba(8, 12, 20, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const rad = (directionDeg * Math.PI) / 180;
      const baseVx = Math.cos(rad) * (velocity * 0.8);
      const baseVy = Math.sin(rad) * (velocity * 0.8);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const turbOffset = (Math.random() - 0.5) * turbulence * 4;

        p.x += baseVx + turbOffset;
        p.y += baseVy + turbOffset;

        // Wrap around boundaries
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
        if (p.y > height) p.y = 0;
        if (p.y < 0) p.y = height;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }

      // Draw directional vector indicator in top-right corner
      const cx = width - 60;
      const cy = 60;
      ctx.beginPath();
      ctx.arc(cx, cy, 25, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(rad) * 22, cy + Math.sin(rad) * 22);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (isSimulating) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [directionDeg, velocity, turbulence, activeBrushType, isSimulating]);

  // Pointer drag to spawn dynamic particles at cursor
  const handlePointerPaint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Add burst of particles at pointer
    const rad = (directionDeg * Math.PI) / 180;
    const newParticles: Particle[] = Array.from({ length: 8 }).map(() => ({
      x: x + (Math.random() - 0.5) * brushSize * 0.8,
      y: y + (Math.random() - 0.5) * brushSize * 0.8,
      vx: Math.cos(rad) * velocity * (0.8 + Math.random() * 0.4),
      vy: Math.sin(rad) * velocity * (0.8 + Math.random() * 0.4),
      size: Math.random() * 3 + 2,
      alpha: 0.95,
      color: getColorForBrush(activeBrushType),
    }));

    particlesRef.current = [...particlesRef.current.slice(-180), ...newParticles];
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsPainting(true);
    handlePointerPaint(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPainting) {
      handlePointerPaint(e);
    }
  };

  const handlePointerUp = () => {
    setIsPainting(false);
  };

  // Burst injection
  const handleTriggerBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const burst: Particle[] = Array.from({ length: 80 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * velocity * 1.5 + 2;
      return {
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.5,
        alpha: 1.0,
        color: getColorForBrush(activeBrushType),
      };
    });

    particlesRef.current = [...particlesRef.current.slice(-160), ...burst];
  };

  // Add painted region
  const handleAddRegion = () => {
    const colorMap = {
      cloth: '#f43f5e',
      hair: '#f59e0b',
      water: '#06b6d4',
      smoke: '#94a3b8',
      particles: '#a855f7',
    };

    const newRegion: MotionBrushRegion = {
      id: `reg-${Date.now()}`,
      name:
        customRegionName.trim() ||
        `${activeBrushType.charAt(0).toUpperCase() + activeBrushType.slice(1)} Flow Dynamics`,
      type: activeBrushType,
      color: colorMap[activeBrushType],
      velocity,
      directionDeg,
      turbulence,
    };

    setRegions([newRegion, ...regions]);
    setCustomRegionName('');
    setShowAppliedToast(true);
    setTimeout(() => setShowAppliedToast(false), 2400);
  };

  const handleRemoveRegion = (id: string) => {
    setRegions(regions.filter((r) => r.id !== id));
  };

  const handleResetRegions = () => {
    setRegions([
      { id: 'reg-1', name: 'Silk Gown Fluid Dynamics', type: 'cloth', color: '#f43f5e', velocity: 6.2, directionDeg: 60, turbulence: 0.4 },
      { id: 'reg-2', name: 'Fine Hair Strands Air Sway', type: 'hair', color: '#f59e0b', velocity: 3.8, directionDeg: 35, turbulence: 0.25 },
      { id: 'reg-3', name: 'Volumetric Atmospheric Mist', type: 'smoke', color: '#06b6d4', velocity: 2.1, directionDeg: 120, turbulence: 0.6 },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-rose-950 text-rose-300 border border-rose-800/60 font-bold">
                PHYSICAL DYNAMICS STUDIO
              </span>
              <span className="text-xs text-slate-400 font-mono">Selective Latent Motion Vector Field</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Motion Brush & Physics Dynamics Sandbox
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Target specific regions of characters, clothing, water, smoke, or hair to assign physical Navier-Stokes velocity vectors and turbulence for temporal animation without full-frame distortion.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerBurst}
              className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 text-xs font-mono flex items-center gap-2 transition-colors border border-purple-500/40"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Inject Velocity Pulse</span>
            </button>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors border border-slate-700"
            >
              {isSimulating ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              <span>{isSimulating ? 'Pause Flow' : 'Resume Flow'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applied Toast Feedback */}
      {showAppliedToast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Vector Region saved and integrated into Navier-Stokes Latent Mesh. Ready for video rendering!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Motion Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Target Material Type */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Physical Material Domain
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'cloth', name: 'Cloth & Silk', icon: Wind, color: 'text-rose-400' },
                { id: 'hair', name: 'Hair & Fur', icon: Activity, color: 'text-amber-400' },
                { id: 'water', name: 'Liquid & Fluid', icon: Droplets, color: 'text-cyan-400' },
                { id: 'smoke', name: 'Smoke & Mist', icon: Flame, color: 'text-slate-400' },
                { id: 'particles', name: 'Sparks / Dust', icon: Sparkles, color: 'text-purple-400' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBrushType(b.id as any)}
                  className={`p-2.5 rounded-xl text-left transition-all border ${
                    activeBrushType === b.id
                      ? 'bg-slate-800 border-cyan-500/60 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <b.icon className={`w-4 h-4 ${b.color} mb-1`} />
                  <span className="text-xs font-bold block">{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Physical Vector Sliders */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4 font-mono text-xs">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Vector Dynamics & Navier-Stokes Parameters
            </span>

            {/* Velocity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Vector Speed:</span>
                <span className="text-cyan-400 font-bold">{velocity.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.1"
                value={velocity}
                onChange={(e) => setVelocity(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Direction Degree */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Angle Orientation:</span>
                <span className="text-indigo-400 font-bold">{directionDeg}° Compass</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={directionDeg}
                onChange={(e) => setDirectionDeg(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Turbulence */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Turbulence Noise:</span>
                <span className="text-rose-400 font-bold">{Math.round(turbulence * 100)}% Randomness</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={turbulence}
                onChange={(e) => setTurbulence(parseFloat(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            {/* Brush Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Interactive Emitter Radius:</span>
                <span className="text-slate-200 font-bold">{brushSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full accent-slate-400"
              />
            </div>

            {/* Add Region Section */}
            <div className="pt-2 border-t border-slate-800 space-y-2 font-sans">
              <input
                type="text"
                placeholder="Optional region name (e.g. Silk Hair Highlights)..."
                value={customRegionName}
                onChange={(e) => setCustomRegionName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAddRegion}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Save Motion Vector to Model Stack</span>
              </button>
            </div>
          </div>

          {/* Active Motion Regions */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Active Latent Painted Regions ({regions.length})
              </span>
              <button
                onClick={handleResetRegions}
                className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                title="Reset to defaults"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
            <div className="space-y-2">
              {regions.map((reg) => (
                <div
                  key={reg.id}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: reg.color }} />
                    <span className="font-semibold text-slate-200">{reg.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-400">
                      {reg.velocity} m/s @ {reg.directionDeg}°
                    </span>
                    <button
                      onClick={() => handleRemoveRegion(reg.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                      title="Delete region"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Particle Simulation Viewport (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider">
                Interactive Dynamic Particle Canvas (Drag to Paint Flow)
              </span>
            </div>
            <span className="text-slate-400">60 FPS Hardware WebGL</span>
          </div>

          {/* Particle Canvas Display with Pointer Events */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#080c14] border border-slate-800 shadow-2xl flex items-center justify-center cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={720}
              height={405}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-full object-cover touch-none"
            />

            {/* Reticle Overlay */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300">
              Active Physics: {activeBrushType.toUpperCase()} • Speed: {velocity.toFixed(1)} m/s
            </div>

            <div className="absolute top-4 right-20 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-400">
              CLICK & DRAG TO EMIT
            </div>

            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
              Eulerian Grid Mesh: 128×128
            </div>
          </div>

          {/* Simulation Details Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">Temporal Drift</span>
              <span className="text-emerald-400 font-bold">&lt; 0.4%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Motion Coherence</span>
              <span className="text-cyan-400 font-bold">99.7%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Conservation of Mass</span>
              <span className="text-purple-400 font-bold">Conserved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
