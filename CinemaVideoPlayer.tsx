import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Download,
  Film,
  Compass,
  Sparkles,
  Maximize2,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { CameraMovement, GeneratedMediaItem } from './media';
import { renderAndDownloadCinematicVideo } from './videoRecorder';

interface CinemaVideoPlayerProps {
  item: GeneratedMediaItem;
  aspectRatio?: string;
  onOpenLoupe?: () => void;
}

export const CinemaVideoPlayer: React.FC<CinemaVideoPlayerProps> = ({
  item,
  aspectRatio = '16:9',
  onOpenLoupe,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStage, setExportStage] = useState('');

  const duration = item.motionConfig?.durationSeconds || 6;
  const fps = item.motionConfig?.fps || 30;
  const totalFrames = Math.max(1, duration * fps);
  const cameraPath = item.motionConfig?.cameraPath || 'dolly_in';

  const animFrameIdRef = useRef<number | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Preload master image for canvas animation
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = item.passes.compositeUrl;
    img.onload = () => {
      imageObjRef.current = img;
    };
  }, [item.passes.compositeUrl]);

  // Main Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = currentFrame;

    const render = () => {
      const img = imageObjRef.current;
      const width = canvas.width;
      const height = canvas.height;

      if (img && img.complete) {
        const t = (frame % totalFrames) / totalFrames; // 0 to 1
        // Smooth easing
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        ctx.save();
        ctx.fillStyle = '#080c14';
        ctx.fillRect(0, 0, width, height);

        let scale = 1.0;
        let offsetX = 0;
        let offsetY = 0;
        let rotation = 0;

        switch (cameraPath) {
          case 'dolly_in':
            scale = 1.05 + easeT * 0.28;
            break;
          case 'dolly_out':
            scale = 1.35 - easeT * 0.28;
            break;
          case 'crane_up':
            scale = 1.15;
            offsetY = (1 - easeT) * 60 - 30;
            break;
          case 'orbit_360':
            scale = 1.18;
            offsetX = Math.sin(easeT * Math.PI * 2) * 45;
            offsetY = Math.cos(easeT * Math.PI * 2) * 20;
            rotation = Math.sin(easeT * Math.PI * 2) * 0.025;
            break;
          case 'fpv_drone':
            scale = 1.1 + easeT * 0.35;
            offsetX = Math.sin(easeT * Math.PI * 3) * 35;
            offsetY = Math.cos(easeT * Math.PI * 2) * 25;
            rotation = Math.sin(easeT * Math.PI * 3) * 0.04;
            break;
          case 'handheld_sway':
            scale = 1.12;
            offsetX = Math.sin(frame * 0.35) * 8 + Math.cos(frame * 0.15) * 4;
            offsetY = Math.cos(frame * 0.28) * 6 + Math.sin(frame * 0.18) * 3;
            rotation = Math.sin(frame * 0.2) * 0.008;
            break;
          case 'tracking_follow':
            scale = 1.15;
            offsetX = (easeT - 0.5) * 110;
            break;
          case 'hitchcock_vertigo':
            scale = 1.0 + easeT * 0.45;
            offsetY = (0.5 - easeT) * 40;
            break;
          default:
            scale = 1.05 + easeT * 0.05;
            break;
        }

        ctx.translate(width / 2, height / 2);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.translate(-width / 2 + offsetX, -height / 2 + offsetY);

        // Aspect fit & cover
        const imgAspect = img.width / img.height;
        const targetAspect = width / height;

        let drawW = width;
        let drawH = height;
        let drawX = 0;
        let drawY = 0;

        if (imgAspect > targetAspect) {
          drawH = height;
          drawW = height * imgAspect;
          drawX = (width - drawW) / 2;
        } else {
          drawW = width;
          drawH = width / imgAspect;
          drawY = (height - drawH) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      if (isPlaying) {
        frame = (frame + 1 * playbackSpeed) % totalFrames;
        setCurrentFrame(Math.floor(frame));
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, totalFrames, cameraPath, playbackSpeed]);

  // Handle Export Video button
  const handleExportRealVideo = async () => {
    setIsExporting(true);
    setExportProgress(10);
    setExportStage('Initializing Video MediaRecorder...');

    try {
      await renderAndDownloadCinematicVideo({
        imageUrl: item.passes.compositeUrl,
        durationSeconds: duration,
        fps,
        cameraPath,
        aspectRatio: item.aspectRatio || '16:9',
        title: item.title,
        onProgress: (p, stage) => {
          setExportProgress(p);
          setExportStage(stage);
        },
      });
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1200);
    } catch (err) {
      console.error('Video export error:', err);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '2.39:1':
        return 'aspect-[2.39/1]';
      case '1:1':
        return 'aspect-square';
      case '9:16':
        return 'aspect-[9/16]';
      case '4:3':
        return 'aspect-[4/3]';
      default:
        return 'aspect-video';
    }
  };

  const cameraMovementLabel = {
    static: 'Static Lock',
    dolly_in: 'Dolly Push-In',
    dolly_out: 'Dolly Pull-Back',
    crane_up: 'Crane Pedestal Up',
    orbit_360: '360° Hero Orbit',
    fpv_drone: 'FPV Kinetic Drone Dive',
    tracking_follow: 'Steadicam Tracking',
    handheld_sway: 'Handheld Organic Sway',
    hitchcock_vertigo: 'Vertigo Dolly-Zoom',
  }[cameraPath] || cameraPath;

  return (
    <div className="space-y-3">
      {/* Canvas Viewport Frame */}
      <div className={`relative group rounded-xl overflow-hidden bg-black border border-slate-800 ${getAspectClass()} flex items-center justify-center shadow-2xl select-none`}>
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-cover"
        />

        {/* Live Cinema Motion Overlay Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>CINEMA MOTION: {cameraMovementLabel.toUpperCase()}</span>
          </div>
          <div className="px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
            {fps} FPS • ACEScg
          </div>
        </div>

        {/* Live Camera Trajectory Reticle */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-purple-950/80 backdrop-blur-md border border-purple-500/40 text-[10px] font-mono font-bold text-purple-300 flex items-center gap-1">
          <Film className="w-3.5 h-3.5" />
          <span>3D RoPE LOCK</span>
        </div>

        {/* Hover Action Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300">
            Frame: <strong className="text-cyan-400">{currentFrame}</strong> / {totalFrames}
          </span>
          <div className="flex items-center gap-2">
            {onOpenLoupe && (
              <button
                onClick={onOpenLoupe}
                className="px-2.5 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Inspector</span>
              </button>
            )}
            <button
              onClick={handleExportRealVideo}
              disabled={isExporting}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Download Real Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Scrubber & Playback Controls */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setCurrentFrame(0)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-400">
              Frame: <strong className="text-white">{currentFrame}</strong> / {totalFrames}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed pills */}
            <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-800">
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    playbackSpeed === s ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <span className="text-[11px] text-cyan-400 font-bold">{duration}s Clip</span>
          </div>
        </div>

        {/* Scrubber slider */}
        <input
          type="range"
          min="0"
          max={totalFrames}
          value={currentFrame}
          onChange={(e) => {
            setCurrentFrame(parseInt(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full accent-cyan-500 cursor-pointer"
        />
      </div>

      {/* Live Video Export Progress Toast */}
      {isExporting && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-800/80 space-y-2 animate-fadeIn font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>{exportStage}</span>
            </span>
            <span className="text-white font-bold">{exportProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 transition-all duration-200"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
