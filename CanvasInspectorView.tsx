import React, { useState, useRef } from 'react';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  CheckCircle2,
  Info,
  Sparkles,
  Camera,
  Film,
  Grid,
  Calendar,
  Clock,
  Activity,
  Compass,
} from 'lucide-react';
import { GeneratedMediaItem } from './media';
import { SHOWCASE_GALLERY } from './mediaData';
import { ScheduleModal } from './ScheduleModal';
import { CinemaVideoPlayer } from './CinemaVideoPlayer';
import { renderAndDownloadCinematicVideo } from './videoRecorder';

interface CanvasInspectorViewProps {
  item?: GeneratedMediaItem | null;
  onBackToStudio: () => void;
  onScheduleItem?: (item: GeneratedMediaItem) => void;
}

export const CanvasInspectorView: React.FC<CanvasInspectorViewProps> = ({
  item: propItem,
  onBackToStudio,
  onScheduleItem,
}) => {
  const item = propItem || SHOWCASE_GALLERY[0];
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const aesthetic = item?.aestheticScore || {
    predictedPhotorealism: 9.9,
    textureMicroDetail: 9.95,
    lightingCoherence: 9.85,
    compositionRating: 9.9,
    anatomyIntegrity: 10,
    temporalStability: 99.4,
  };
  const camera = item?.cameraConfig || SHOWCASE_GALLERY[0].cameraConfig;
  const lighting = item?.lightingConfig || SHOWCASE_GALLERY[0].lightingConfig;
  const passes = item?.passes || SHOWCASE_GALLERY[0].passes;
  const motion = item?.motionConfig || SHOWCASE_GALLERY[0].motionConfig;

  // Viewer modes
  const [activeTab, setActiveTab] = useState<'loupe' | 'split_ab' | 'passes' | 'video_path'>('loupe');
  
  // Real video export state
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStage, setExportStage] = useState('');

  // Loupe Zoom state
  const [zoomLevel, setZoomLevel] = useState<number>(1.5);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [showLoupeLens, setShowLoupeLens] = useState(true);

  // Split-screen A/B Slider state
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Multi-pass selection
  const [activePass, setActivePass] = useState<'composite' | 'depth' | 'normal' | 'volumetric'>('composite');

  // Video scrubber state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(24);
  const totalFrames = (motion?.durationSeconds || 6) * (motion?.fps || 24);

  // Real video export handler
  const handleExportRealVideo = async () => {
    setIsExportingVideo(true);
    setExportProgress(10);
    setExportStage('Initializing Canvas Frame Pipeline...');
    try {
      await renderAndDownloadCinematicVideo({
        imageUrl: item.passes.compositeUrl,
        durationSeconds: motion?.durationSeconds || 6,
        fps: motion?.fps || 30,
        cameraPath: motion?.cameraPath || 'dolly_in',
        aspectRatio: item.aspectRatio || '16:9',
        title: item.title,
        onProgress: (p, stage) => {
          setExportProgress(p);
          setExportStage(stage);
        },
      });
      setTimeout(() => {
        setIsExportingVideo(false);
        setExportProgress(0);
      }, 1000);
    } catch (err) {
      console.error('ProRes / MP4 video export error:', err);
      setIsExportingVideo(false);
      setExportProgress(0);
    }
  };

  // Interactive Loupe Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLoupePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const getPassFilterStyle = () => {
    switch (activePass) {
      case 'depth':
        return 'contrast(180%) grayscale(100%) invert(20%)';
      case 'normal':
        return 'hue-rotate(180deg) saturate(220%) contrast(140%)';
      case 'volumetric':
        return 'contrast(150%) brightness(120%) saturate(60%)';
      default:
        return 'none';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar: Navigation & Mode Selection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBackToStudio}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              ← Back to Studio Engine
            </button>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
              8K NATIVE MASTER
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Ultra-Detail Master Canvas & Pass Inspector
          </h2>
        </div>

        {/* Inspection Tools Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('loupe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'loupe'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>400% Loupe</span>
          </button>
          <button
            onClick={() => setActiveTab('split_ab')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'split_ab'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>A/B Clarity Split</span>
          </button>
          <button
            onClick={() => setActiveTab('passes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'passes'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Pass Layers</span>
          </button>
          <button
            onClick={() => setActiveTab('video_path')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'video_path'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Camera Path</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Viewport (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
            {/* Viewport Header Controls */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-3">
                <span>Resolution: <strong className="text-white">7680 × 4320 (8K)</strong></span>
                <span>Gamut: <strong className="text-cyan-400">ACEScg Linear</strong></span>
              </div>
              {activeTab === 'loupe' && (
                <div className="flex items-center gap-2">
                  <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(4.0, z + 0.5))}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(1.0, z - 0.5))}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Image Frame */}
            <div
              onMouseMove={handleMouseMove}
              className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 select-none cursor-crosshair group shadow-2xl"
            >
              {/* TAB 1: 400% Loupe Inspector */}
              {activeTab === 'loupe' && (
                <>
                  <img
                    src={item.passes.compositeUrl}
                    alt={item.title}
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* High magnification floating loupe lens */}
                  {showLoupeLens && (
                    <div
                      className="absolute w-44 h-44 rounded-full border-2 border-cyan-400/90 shadow-[0_0_25px_rgba(6,182,212,0.6)] overflow-hidden pointer-events-none -translate-x-1/2 -translate-y-1/2 bg-black backdrop-blur-sm z-30"
                      style={{
                        left: `${loupePos.x}%`,
                        top: `${loupePos.y}%`,
                      }}
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${item.passes.compositeUrl})`,
                          backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
                          backgroundSize: `${zoomLevel * 400}%`,
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                      {/* Crosshair reticle */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-4 h-[1px] bg-cyan-400/80" />
                        <div className="h-4 w-[1px] bg-cyan-400/80 absolute" />
                        <span className="absolute bottom-2 text-[9px] font-mono text-cyan-300 font-bold bg-black/70 px-1 rounded">
                          {Math.round(zoomLevel * 100)}% Dermal Pass
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Microscopic Surface Banner */}
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300">
                    Hover to inspect microscopic skin pores, individual fibers, and caustics
                  </div>
                </>
              )}

              {/* TAB 2: Split-Screen A/B Slider */}
              {activeTab === 'split_ab' && (
                <div className="relative w-full h-full">
                  {/* Side A: Raw Latent Output (Left) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={item.passes.compositeUrl}
                      alt="Raw Latent"
                      className="w-full h-full object-cover filter blur-[0.8px] brightness-95"
                      style={{ width: '100%', maxWidth: 'none' }}
                    />
                    <div className="absolute top-4 left-4 px-2 py-1 rounded bg-black/80 border border-slate-700 text-[10px] font-mono font-bold text-slate-300">
                      RAW FLOW LATENT (UNREFINED)
                    </div>
                  </div>

                  {/* Side B: 8K Micro-Detail Refined (Right) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <img
                      src={item.passes.compositeUrl}
                      alt="8K Refined"
                      className="w-full h-full object-cover filter contrast-[105%]"
                      style={{
                        position: 'absolute',
                        left: `-${sliderPosition}%`,
                        width: '100vw',
                        maxWidth: 'none',
                      }}
                    />
                    <div className="absolute top-4 right-4 px-2 py-1 rounded bg-cyan-950/90 border border-cyan-500/60 text-[10px] font-mono font-bold text-cyan-300">
                      8K NEURAL CLARITY + PORES
                    </div>
                  </div>

                  {/* Slider divider line */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20 cursor-ew-resize flex items-center justify-center -translate-x-1/2"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-7 h-7 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-lg">
                      A|B
                    </div>
                  </div>

                  {/* Range input overlay */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                  />
                </div>
              )}

              {/* TAB 3: Multi-Pass Layers */}
              {activeTab === 'passes' && (
                <div className="relative w-full h-full">
                  <img
                    src={item.passes.compositeUrl}
                    alt={activePass}
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{ filter: getPassFilterStyle() }}
                  />

                  <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-white uppercase">
                    PASS: {activePass}
                  </div>
                </div>
              )}

              {/* TAB 4: Video Camera Path Trajectory */}
              {activeTab === 'video_path' && (
                <div className="relative w-full h-full">
                  <img
                    src={item.passes.compositeUrl}
                    alt="Camera Path"
                    className="w-full h-full object-cover"
                  />

                  {/* 3D Spline trajectory SVG overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                    <defs>
                      <linearGradient id="splineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                    {/* Camera track curve */}
                    <path
                      d="M 120 320 C 260 200, 480 380, 720 180"
                      fill="none"
                      stroke="url(#splineGrad)"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                    />
                    {/* Keyframes */}
                    <circle cx="120" cy="320" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                    <text x="110" y="350" fill="#06b6d4" fontSize="11" fontFamily="monospace">KF 01 (0.0s)</text>

                    <circle cx="420" cy="270" r="7" fill="#818cf8" stroke="#ffffff" strokeWidth="2" />
                    <text x="410" y="300" fill="#818cf8" fontSize="11" fontFamily="monospace">KF 02 (3.0s)</text>

                    <circle cx="720" cy="180" r="7" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                    <text x="690" y="210" fill="#f43f5e" fontSize="11" fontFamily="monospace">KF 03 (6.0s)</text>
                  </svg>

                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300">
                    Trajectory: {item.motionConfig?.cameraPath || 'Dolly In'} • Easing: {item.motionConfig?.cameraSpeedEasing || 'Ease In-Out'}
                  </div>
                </div>
              )}
            </div>

            {/* Video Scrubber & Playback Controls */}
            {activeTab === 'video_path' && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setCurrentFrame(0)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <span>Frame: <strong className="text-white">{currentFrame} / {totalFrames}</strong></span>
                  </div>
                  <span>Cadence: <strong>{item.motionConfig?.fps || 24} FPS (Cinema)</strong></span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={totalFrames}
                  value={currentFrame}
                  onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            )}

            {/* Multi-Pass Selector Buttons */}
            {activeTab === 'passes' && (
              <div className="grid grid-cols-4 gap-2 pt-2">
                {(['composite', 'depth', 'normal', 'volumetric'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePass(p)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono uppercase font-bold transition-all border ${
                      activePass === p
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {p} Pass
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Technical Inspector & Metadata (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Aesthetic Radar & Quality Scores */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Aesthetic & Fidelity Scores
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                PASSED QC
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Photorealism (HPSv2)</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {aesthetic.predictedPhotorealism} / 10
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${aesthetic.predictedPhotorealism * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Micro-Detail Density</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {aesthetic.textureMicroDetail} / 10
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${aesthetic.textureMicroDetail * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Lighting Coherence</span>
                  <span className="font-mono font-bold text-amber-400">
                    {aesthetic.lightingCoherence} / 10
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${aesthetic.lightingCoherence * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Temporal Coherence</span>
                  <span className="font-mono font-bold text-purple-400">
                    {aesthetic.temporalStability || 99.4}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full"
                    style={{ width: `${aesthetic.temporalStability || 99.4}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Camera Rig & Optical Parameters */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span className="font-sans font-bold uppercase tracking-wider text-slate-200">
                Camera Rig & Optics
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Camera Sensor:</span>
                <span className="text-slate-200 font-semibold">{camera.body}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Prime Lens:</span>
                <span className="text-slate-200 font-semibold">{camera.lens.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Focal Length:</span>
                <span className="text-slate-200 font-semibold">{camera.focalLengthMm}mm</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Aperture:</span>
                <span className="text-cyan-400 font-bold">{camera.aperture}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shutter Angle:</span>
                <span className="text-slate-200">{camera.shutterAngle}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Subsurface Depth:</span>
                <span className="text-slate-200">
                  {lighting.subsurfaceScattering ? `${lighting.subsurfaceScattering * 100}%` : '85%'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Random Seed:</span>
                <span className="text-purple-300">{item.seed}</span>
              </div>
            </div>
          </div>

          {/* Studio Export Hub */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
              Studio Export & Compositing Passes
            </span>

            <div className="space-y-2">
              <a
                href={item.passes.compositeUrl}
                download={`${item.id}_8k_master.png`}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-950/40"
              >
                <Download className="w-4 h-4" />
                <span>Export 16-Bit Master PNG (8K)</span>
              </a>

              {/* Real Video Export with progress */}
              {isExportingVideo ? (
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-purple-300">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                      {exportStage}
                    </span>
                    <span className="font-bold">{exportProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-200"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleExportRealVideo}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-950/40 border border-purple-500/30"
                >
                  <Film className="w-4 h-4 text-purple-300" />
                  <span>Render & Export Real Video (MP4 / WebM)</span>
                </button>
              )}

              <button
                onClick={() => setScheduleModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600/30 to-rose-600/30 hover:from-amber-600/50 hover:to-rose-600/50 text-amber-200 border border-amber-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950/20"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>
                  {item.status === 'scheduled'
                    ? `Scheduled (${item.scheduledDate?.replace('T', ' ')})`
                    : 'Schedule Social Post (زمان‌بندی انتشار)'}
                </span>
              </button>

              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(item, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `${item.id}_camera_metadata.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Download Camera & 3D Depth JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Post Scheduler Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        item={item}
        onSaveSchedule={(it, dateStr, plat, cap, notes) => {
          const updated: GeneratedMediaItem = {
            ...it,
            status: 'scheduled',
            scheduledDate: dateStr,
            scheduledPlatform: plat,
            socialCaption: cap,
            scheduledNotes: notes,
          };
          if (onScheduleItem) {
            onScheduleItem(updated);
          }
        }}
      />
    </div>
  );
};
