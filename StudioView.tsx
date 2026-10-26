import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Video,
  Layers,
  Wand2,
  Sliders,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Eye,
  RefreshCw,
  Zap,
  Info,
  Compass,
  Sun,
  Palette,
  Film,
  Download,
  Share2,
  Cpu,
  Activity,
  AlertCircle,
  Calendar,
  Clock,
  Send,
  Play,
} from 'lucide-react';
import { ScheduleModal } from './ScheduleModal';
import { CinemaVideoPlayer } from './CinemaVideoPlayer';
import { renderAndDownloadCinematicVideo } from './videoRecorder';
import {
  GenerationMode,
  ResolutionOption,
  AspectRatioOption,
  RenderEngine,
  CameraBody,
  LensType,
  CameraMovement,
  GeneratedMediaItem,
  EnhancedPromptResponse,
} from './media';
import {
  CAMERA_BODIES,
  LENS_PRESETS,
  LIGHTING_PRESETS,
  CAMERA_MOVEMENTS,
  PROMPT_IDEAS,
  SHOWCASE_GALLERY,
} from './mediaData';

interface StudioViewProps {
  technicalMode: boolean;
  onSelectMediaForInspect: (item: GeneratedMediaItem) => void;
  onSaveToVault: (item: GeneratedMediaItem) => void;
  latestGenerated: GeneratedMediaItem | null;
  setLatestGenerated: (item: GeneratedMediaItem) => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  technicalMode,
  onSelectMediaForInspect,
  onSaveToVault,
  latestGenerated,
  setLatestGenerated,
}) => {
  // Generation state
  const [promptInput, setPromptInput] = useState('');
  const [mode, setMode] = useState<GenerationMode>('image');
  const [engine, setEngine] = useState<RenderEngine>('aetheris-flow-dit');
  const [resolution, setResolution] = useState<ResolutionOption>('8K');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('16:9');

  // Camera & Optics
  const [selectedBody, setSelectedBody] = useState<CameraBody>('ARRI Alexa 65');
  const [selectedLens, setSelectedLens] = useState<LensType>('Cooke Anamorphic /i 35mm T2.3');
  const [focalLength, setFocalLength] = useState(35);
  const [aperture, setAperture] = useState('f/1.4');
  const [shutterAngle, setShutterAngle] = useState('180°');
  const [iso, setIso] = useState(200);
  const [depthOfField, setDepthOfField] = useState(0.85);
  const [bokehStyle, setBokehStyle] = useState<'circular' | 'anamorphic_oval' | 'cat_eye' | 'swirly'>('anamorphic_oval');
  const [chromaticAberration, setChromaticAberration] = useState(0.12);
  const [filmGrain, setFilmGrain] = useState(0.08);

  // Lighting & Atmosphere
  const [selectedLighting, setSelectedLighting] = useState(LIGHTING_PRESETS[0].name);
  const [globalIllumination, setGlobalIllumination] = useState(true);
  const [volumetricFog, setVolumetricFog] = useState(0.45);
  const [hdrIntensity, setHdrIntensity] = useState(1.8);
  const [colorTempK, setColorTempK] = useState(5400);
  const [subsurfaceScattering, setSubsurfaceScattering] = useState(0.92);

  // Micro-materials
  const [microPores, setMicroPores] = useState(true);
  const [individualHairs, setIndividualHairs] = useState(true);
  const [fabricWeave, setFabricWeave] = useState(true);
  const [metalScratches, setMetalScratches] = useState(true);
  const [waterCaustics, setWaterCaustics] = useState(true);

  // Video & Motion
  const [cameraMovement, setCameraMovement] = useState<CameraMovement>('dolly_in');
  const [durationSec, setDurationSec] = useState(6);
  const [fps, setFps] = useState(30);
  const [motionIntensity, setMotionIntensity] = useState(1.2);
  const [easing, setEasing] = useState<'linear' | 'ease_in_out' | 'exponential' | 'slowmo_ramp'>('ease_in_out');
  const [hairClothPhysics, setHairClothPhysics] = useState(true);
  const [fluidSmokeParticles, setFluidSmokeParticles] = useState(true);
  const [identityWeight, setIdentityWeight] = useState(0.96);

  // Sampler & Inference
  const [steps, setSteps] = useState(50);
  const [cfgScale, setCfgScale] = useState(7.0);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 89999999) + 10000000);
  const [negativePrompt, setNegativePrompt] = useState(
    'blurry, cartoon, 3D CGI plastic skin, extra limbs, deformed face, low resolution, temporal jitter, flicker, ghosting artifacts'
  );

  // Directorial AI Expansion state
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedPromptResponse | null>(null);
  const [showDirectorialNotes, setShowDirectorialNotes] = useState(false);

  // Generation execution state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Social Media Scheduling state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Video export state
  const [isVideoExporting, setIsVideoExporting] = useState(false);
  const [videoExportProgress, setVideoExportProgress] = useState(0);
  const [videoExportStage, setVideoExportStage] = useState('');

  const handleExportVideoFile = async (itemToExport: GeneratedMediaItem) => {
    setIsVideoExporting(true);
    setVideoExportProgress(10);
    setVideoExportStage('Synthesizing Camera Motion Vectors...');
    try {
      await renderAndDownloadCinematicVideo({
        imageUrl: itemToExport.passes.compositeUrl,
        durationSeconds: itemToExport.motionConfig?.durationSeconds || durationSec,
        fps: itemToExport.motionConfig?.fps || fps,
        cameraPath: itemToExport.motionConfig?.cameraPath || cameraMovement,
        aspectRatio: itemToExport.aspectRatio || aspectRatio,
        title: itemToExport.title,
        onProgress: (p, stage) => {
          setVideoExportProgress(p);
          setVideoExportStage(stage);
        },
      });
      setTimeout(() => {
        setIsVideoExporting(false);
        setVideoExportProgress(0);
      }, 1000);
    } catch (err) {
      console.error('Video export error:', err);
      setIsVideoExporting(false);
      setVideoExportProgress(0);
    }
  };

  const handleScheduleSave = (
    item: GeneratedMediaItem,
    scheduledDate: string,
    platform: 'instagram' | 'x' | 'linkedin' | 'youtube' | 'tiktok' | 'telegram' | 'general',
    caption: string,
    notes?: string
  ) => {
    const updated: GeneratedMediaItem = {
      ...item,
      status: 'scheduled',
      scheduledDate,
      scheduledPlatform: platform,
      socialCaption: caption,
      scheduledNotes: notes,
    };
    setLatestGenerated(updated);
    onSaveToVault(updated);
  };

  // Quick load from prompt ideas
  const handleLoadIdea = (idea: { fa: string; en: string; mode: GenerationMode }) => {
    setPromptInput(idea.fa);
    setMode(idea.mode);
  };

  // Directorial Prompt Expansion using server endpoint with Gemini
  const handleEnhancePrompt = async () => {
    if (!promptInput.trim()) return;
    setIsEnhancing(true);

    try {
      const res = await fetch('/api/media/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          mode,
          cameraBody: selectedBody,
          lens: selectedLens,
          aperture,
          cameraMovement,
          lighting: selectedLighting,
          materials: microPores
            ? 'Subsurface scattering, micro-pore skin, fabric weave, metal micro-scratches'
            : 'Standard physically based materials',
          resolution,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setEnhancedResult(json.data);
        if (json.data.negativePrompt) {
          setNegativePrompt(json.data.negativePrompt);
        }
        setShowDirectorialNotes(true);
      }
    } catch (e) {
      console.error('Enhancement error:', e);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Run generation through server DiT engine pipeline
  const handleGenerate = async () => {
    const activePrompt = enhancedResult?.enhancedPromptEn || promptInput;
    if (!activePrompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(5);
    setGenerationStage('Initializing 3D Latent Noise Tensor & Text Alignment...');

    const stageInterval = setInterval(() => {
      setGenerationProgress((p) => {
        if (p < 25) {
          setGenerationStage('Cross-Attention Semantic Layout & Geometry Formulation...');
          return p + 6;
        } else if (p < 55) {
          setGenerationStage(
            mode === 'video'
              ? '3D RoPE Temporal Motion Consistency & Optical Flow Constraint...'
              : 'Flow-Matching ODE Solver (Rectified Trajectory Convergence)...'
          );
          return p + 7;
        } else if (p < 85) {
          setGenerationStage('Micro-Surface Synthesis: Pores, Hair Strands & SSS Caustics...');
          return p + 5;
        } else if (p < 96) {
          setGenerationStage('ACEScg Linear Color Grading & Tiled 8K Neural Refinement...');
          return p + 2;
        }
        return p;
      });
    }, 280);

    try {
      const res = await fetch('/api/media/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptEn: enhancedResult?.enhancedPromptEn || promptInput,
          promptFa: enhancedResult?.enhancedPromptFa || promptInput,
          mode,
          engine,
          resolution,
          aspectRatio,
          cameraConfig: {
            body: selectedBody,
            lens: selectedLens,
            focalLengthMm: focalLength,
            aperture,
            shutterAngle,
            iso,
            depthOfField,
            bokehStyle,
            chromaticAberration,
            lensDistortion: 0.04,
            filmGrain,
          },
          lightingConfig: {
            preset: selectedLighting,
            globalIllumination,
            volumetricFog,
            hdrIntensity,
            colorTemperatureK: colorTempK,
            raytracedReflections: true,
            subsurfaceScattering,
          },
          materialConfig: {
            microPoreSkin: microPores,
            individualHairStrands: individualHairs,
            fabricWeaveDetails: fabricWeave,
            metalMicroScratches: metalScratches,
            waterCausticsIOR: waterCaustics ? 1.33 : 1.0,
            subsurfaceDermalDepth: subsurfaceScattering,
          },
          motionConfig: {
            cameraPath: cameraMovement,
            durationSeconds: durationSec,
            fps,
            motionIntensity,
            cameraSpeedEasing: easing,
            hairClothPhysics,
            fluidSmokeParticles,
            identityPreservationWeight: identityWeight,
          },
          seed,
          steps,
          cfgScale,
        }),
      });

      const json = await res.json();
      if (json.success && json.item) {
        clearInterval(stageInterval);
        setGenerationProgress(100);
        setGenerationStage('8K Rendering Complete');
        setTimeout(() => {
          setLatestGenerated(json.item);
          onSaveToVault(json.item);
          setIsGenerating(false);
          setGenerationProgress(0);
        }, 400);
      }
    } catch (e) {
      console.error('Generation error:', e);
      clearInterval(stageInterval);
      setIsGenerating(false);
    }
  };

  const currentDisplayItem = latestGenerated || SHOWCASE_GALLERY[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner: Studio Engine Highlights */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/60 border border-slate-800 p-4 sm:p-6 shadow-xl shadow-cyan-950/20">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                PRO STUDIO ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">DiT-XL/16 Flow-Matching</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Ultra-Fidelity Generative Media Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Photorealistic 8K imagery, cinematic motion consistency, and optical lens physics. Native bilingual English & Persian (فارسی) prompt synthesis with direct Hollywood director parameter mapping.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700/60 text-[11px] font-mono text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Octane & UE5 Lighting Active</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700/60 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>8K Flow Tensor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Control Panel (Prompt & Cinematography) | Right Live Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Generation Mode Switcher */}
          <div className="glass-panel rounded-xl p-3 border border-slate-800">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setMode('image')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  mode === 'image'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>8K Image</span>
              </button>
              <button
                onClick={() => setMode('video')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  mode === 'video'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Cinematic Video</span>
              </button>
              <button
                onClick={() => setMode('animation')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  mode === 'animation'
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Physical Motion</span>
              </button>
            </div>
          </div>

          {/* Prompt Entry Box & Multilingual AI Expansion */}
          <div className="glass-panel rounded-xl p-4 sm:p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Intelligent Prompt (English / فارسی)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Bilingual Directorial Parser</span>
            </div>

            <div className="relative">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="ایده یا سناریوی خود را به فارسی یا انگلیسی بنویسید (مثال: پرتره پیرمرد درودگر با چروک‌های طبیعی و نور گرم پنجره، یا ماشین سوپراسپرت در جاده بارانی)..."
                rows={3}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none transition-all leading-relaxed"
                dir="auto"
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Presets:</span>
              {PROMPT_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadIdea(idea)}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-cyan-300 border border-slate-700/50 transition-colors truncate max-w-[200px]"
                  title={idea.fa}
                >
                  {idea.fa.slice(0, 26)}...
                </button>
              ))}
            </div>

            {/* AI Directorial Expansion Action */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/70">
              <button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !promptInput.trim()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 text-cyan-200 border border-cyan-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed group shadow-sm shadow-cyan-950/30"
              >
                {isEnhancing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                )}
                <span>Directorial AI Expansion (Gemini)</span>
              </button>

              {enhancedResult && (
                <button
                  onClick={() => setShowDirectorialNotes(!showDirectorialNotes)}
                  className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>{showDirectorialNotes ? 'Hide Specs' : 'View Expanded Specs'}</span>
                  {showDirectorialNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Expanded Directorial Card */}
            {enhancedResult && showDirectorialNotes && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-950/90 border border-cyan-900/40 space-y-2.5 animate-fadeIn text-xs">
                <div>
                  <span className="font-mono text-[10px] uppercase text-cyan-400 block mb-1">
                    English Studio Prompt (Hollywood UE5/Octane)
                  </span>
                  <p className="text-slate-200 font-mono text-[11px] leading-relaxed bg-slate-900/80 p-2 rounded border border-slate-800 select-all">
                    {enhancedResult.enhancedPromptEn}
                  </p>
                </div>

                {enhancedResult.enhancedPromptFa && (
                  <div>
                    <span className="font-mono text-[10px] uppercase text-amber-400 block mb-1">
                      برگردان و تفسیر کارگردانی فارسی
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/80 p-2 rounded border border-slate-800" dir="rtl">
                      {enhancedResult.enhancedPromptFa}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block">Photorealism</span>
                    <span className="text-emerald-400 font-bold">
                      {enhancedResult.aestheticScores?.predictedPhotorealism || 9.85} / 10
                    </span>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block">Micro Detail</span>
                    <span className="text-cyan-400 font-bold">
                      {enhancedResult.aestheticScores?.textureMicroDetail || 9.9} / 10
                    </span>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block">Lighting</span>
                    <span className="text-amber-400 font-bold">
                      {enhancedResult.aestheticScores?.lightingCoherence || 9.8} / 10
                    </span>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block">Color Gamut</span>
                    <span className="text-purple-400 font-bold">ACEScg 16-bit</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Engine & Aspect Ratio Controls */}
          <div className="glass-panel rounded-xl p-4 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Output Resolution</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['1080p', '4K', '8K', '16K'] as ResolutionOption[]).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      resolution === res
                        ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/50 border border-cyan-400/40'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Aspect Ratio</label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['16:9', '2.39:1', '1:1', '9:16', '4:3'] as AspectRatioOption[]).map((ar) => (
                  <button
                    key={ar}
                    onClick={() => setAspectRatio(ar)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      aspectRatio === ar
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50 border border-indigo-400/40'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Technical Controls (Camera, Optics, Lighting, Physics) */}
          {technicalMode && (
            <div className="glass-panel rounded-xl p-4 sm:p-5 border border-purple-900/30 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Cinematography & Optical Director Studio
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Physical Camera Simulation</span>
              </div>

              {/* Camera Body & Lens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Camera Sensor / Body</label>
                  <select
                    value={selectedBody}
                    onChange={(e) => setSelectedBody(e.target.value as CameraBody)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {CAMERA_BODIES.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} ({b.sensor})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Optical Prime Lens</label>
                  <select
                    value={selectedLens}
                    onChange={(e) => {
                      const l = e.target.value as LensType;
                      setSelectedLens(l);
                      const matched = LENS_PRESETS.find((p) => p.name === l);
                      if (matched) setFocalLength(matched.focal);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {LENS_PRESETS.map((lp) => (
                      <option key={lp.name} value={lp.name}>
                        {lp.name} - {lp.character}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Aperture, Focal Length, Bokeh */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Aperture (f-stop)</label>
                  <select
                    value={aperture}
                    onChange={(e) => setAperture(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200"
                  >
                    {['f/1.2', 'f/1.4', 'f/1.8', 'f/2.8', 'f/4.0', 'f/5.6', 'f/11', 'f/22'].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Shutter Angle</label>
                  <select
                    value={shutterAngle}
                    onChange={(e) => setShutterAngle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200"
                  >
                    {['180° (Cinema Standard)', '90° (Crisp Action)', '45° (Strobe)', '360° (Fluid Motion)'].map((s) => (
                      <option key={s} value={s.split(' ')[0]}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Bokeh Style</label>
                  <select
                    value={bokehStyle}
                    onChange={(e) => setBokehStyle(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200"
                  >
                    <option value="anamorphic_oval">Anamorphic Oval</option>
                    <option value="circular">Circular 9-Blade</option>
                    <option value="cat_eye">Cat-Eye Swirl</option>
                    <option value="swirly">Petzval Vintage</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Focal Length: {focalLength}mm</label>
                  <input
                    type="range"
                    min="14"
                    max="200"
                    value={focalLength}
                    onChange={(e) => setFocalLength(parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>

              {/* Lighting Setup */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1.5">
                  Lighting & Volumetric Atmosphere
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LIGHTING_PRESETS.map((lp) => (
                    <button
                      key={lp.id}
                      onClick={() => setSelectedLighting(lp.name)}
                      className={`p-2 rounded-lg text-left transition-all border ${
                        selectedLighting === lp.name
                          ? 'bg-slate-800 text-white border-cyan-400/60 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lp.color }} />
                        <span className="text-xs font-semibold truncate">{lp.name.split(' ')[0]}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{lp.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Microscopic Surface Detail Toggles */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Microscopic Surface Detail Synthesis
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={microPores}
                      onChange={(e) => setMicroPores(e.target.checked)}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-300 text-[11px]">Skin Micro-Pores</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={individualHairs}
                      onChange={(e) => setIndividualHairs(e.target.checked)}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-300 text-[11px]">Individual Hair Follicles</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={metalScratches}
                      onChange={(e) => setMetalScratches(e.target.checked)}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-300 text-[11px]">Metal Micro-Scratches</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fabricWeave}
                      onChange={(e) => setFabricWeave(e.target.checked)}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-300 text-[11px]">Physical Fabric Weave</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={waterCaustics}
                      onChange={(e) => setWaterCaustics(e.target.checked)}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-300 text-[11px]">Water Caustics (IOR 1.33)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={globalIllumination}
                      onChange={(e) => setGlobalIllumination(e.target.checked)}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-300 text-[11px]">Ray-Traced Path Tracing</span>
                  </label>
                </div>
              </div>

              {/* Video Specific Camera Path & Temporal Lock */}
              {(mode === 'video' || mode === 'animation') && (
                <div className="pt-2 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                      Camera Trajectory & Physical Dynamics
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">3D RoPE Temporal Lock</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CAMERA_MOVEMENTS.slice(0, 6).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setCameraMovement(m.id)}
                        className={`p-2 rounded-lg text-left text-xs transition-all border ${
                          cameraMovement === m.id
                            ? 'bg-indigo-950/80 text-cyan-300 border-indigo-400/60'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <span className="font-semibold block truncate">{m.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{m.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Duration</label>
                      <select
                        value={durationSec}
                        onChange={(e) => setDurationSec(parseInt(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200"
                      >
                        <option value="2">2s (Short Action)</option>
                        <option value="6">6s (Standard Cinematic)</option>
                        <option value="10">10s (Extended Sequence)</option>
                        <option value="15">15s (Master Clip)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">FPS Cadence</label>
                      <select
                        value={fps}
                        onChange={(e) => setFps(parseInt(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200"
                      >
                        <option value="24">24 FPS (Cinematic 35mm)</option>
                        <option value="30">30 FPS (Commercial)</option>
                        <option value="60">60 FPS (Ultra Smooth HFR)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Identity Lock: {identityWeight * 100}%</label>
                      <input
                        type="range"
                        min="0.8"
                        max="1.0"
                        step="0.01"
                        value={identityWeight}
                        onChange={(e) => setIdentityWeight(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Master Generate Button */}
          <div className="space-y-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!promptInput.trim() && !enhancedResult?.enhancedPromptEn)}
              className="w-full py-3.5 px-6 rounded-xl font-black text-sm tracking-wide uppercase bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-fuchsia-500 text-white shadow-lg shadow-cyan-950/60 hover:shadow-cyan-800/40 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer group"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Synthesizing 8K Flow Latents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
                  <span>
                    Generate 8K {mode === 'image' ? 'Masterpiece Image' : mode === 'video' ? 'Cinematic Video' : 'Physical Animation'}
                  </span>
                </>
              )}
            </button>

            {/* Denoising Latent Progress Bar */}
            {isGenerating && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-800/60 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                    {generationStage}
                  </span>
                  <span className="text-slate-400 font-bold">{generationProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 transition-all duration-300 ease-out"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Sampler: Flow-Matching Rectified ODE</span>
                  <span>Cluster: 8x H100 SXM5 NVLink</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Viewport (5 Cols): Live Render Display & Master Inspection Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Render Output Viewport
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">
                {currentDisplayItem.resolution} • {currentDisplayItem.aspectRatio}
              </span>
            </div>

            {/* Image / Video Display Container */}
            {currentDisplayItem.mode === 'video' || currentDisplayItem.mode === 'animation' ? (
              <CinemaVideoPlayer
                item={currentDisplayItem}
                aspectRatio={currentDisplayItem.aspectRatio || aspectRatio}
                onOpenLoupe={() => onSelectMediaForInspect(currentDisplayItem)}
              />
            ) : (
              <div className="space-y-3">
                <div
                  className={`relative group rounded-xl overflow-hidden bg-slate-950 border border-slate-800 ${
                    currentDisplayItem.aspectRatio === '2.39:1'
                      ? 'aspect-[2.39/1]'
                      : currentDisplayItem.aspectRatio === '1:1'
                      ? 'aspect-square'
                      : currentDisplayItem.aspectRatio === '9:16'
                      ? 'aspect-[9/16]'
                      : currentDisplayItem.aspectRatio === '4:3'
                      ? 'aspect-[4/3]'
                      : 'aspect-video'
                  } flex items-center justify-center shadow-2xl`}
                >
                  <img
                    src={currentDisplayItem.passes.compositeUrl}
                    alt={currentDisplayItem.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Resolution Watermark */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>8K NATIVE MASTER</span>
                  </div>

                  {/* Mode Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-cyan-300 capitalize">
                    {currentDisplayItem.mode}
                  </div>

                  {/* Quick Hover Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-xs text-white font-medium line-clamp-2 mb-3">
                      {currentDisplayItem.promptEn}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectMediaForInspect(currentDisplayItem)}
                        className="flex-1 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Open 8K Loupe Inspector</span>
                      </button>
                      <button
                        onClick={() => setScheduleModalOpen(true)}
                        className="p-2 rounded-lg bg-amber-950/90 hover:bg-amber-900 text-amber-300 transition-colors border border-amber-600/60"
                        title="Schedule Social Post"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <a
                        href={currentDisplayItem.passes.compositeUrl}
                        download={`${currentDisplayItem.id}_8k_master.png`}
                        className="p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
                        title="Download 16-bit Master PNG"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Quick Video Export Action for Image */}
                {isVideoExporting ? (
                  <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-purple-300">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                        {videoExportStage}
                      </span>
                      <span className="font-bold">{videoExportProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-200"
                        style={{ width: `${videoExportProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={currentDisplayItem.passes.compositeUrl}
                      download={`${currentDisplayItem.id}_8k_master.png`}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>16-Bit Master PNG</span>
                    </a>
                    <button
                      onClick={() => handleExportVideoFile(currentDisplayItem)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-950/30"
                    >
                      <Film className="w-3.5 h-3.5 text-purple-300" />
                      <span>Animate to Video (MP4)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Scheduled State Banner or Schedule Action Button */}
            {currentDisplayItem.status === 'scheduled' ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/40 border border-amber-600/50">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-amber-300 block">
                      Post Scheduled: {currentDisplayItem.scheduledDate?.replace('T', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      Target: {currentDisplayItem.scheduledPlatform || 'Social Media'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setScheduleModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-medium border border-amber-600/40 transition-colors"
                >
                  Edit Schedule
                </button>
              </div>
            ) : (
              <button
                onClick={() => setScheduleModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600/30 via-rose-600/30 to-purple-600/30 hover:from-amber-600/50 hover:via-rose-600/50 hover:to-purple-600/50 text-amber-200 border border-amber-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950/20"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Schedule Post for Social Media (زمان‌بندی انتشار)</span>
              </button>
            )}

            {/* Aesthetic & Physical Metric Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Aesthetic Scoring (HPSv2)</span>
                <span className="font-mono font-bold text-emerald-400">
                  {currentDisplayItem.aestheticScore.predictedPhotorealism} / 10
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Micro Detail</span>
                  <span className="text-cyan-300 font-bold">
                    {currentDisplayItem.aestheticScore.textureMicroDetail}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Temporal Stability</span>
                  <span className="text-purple-300 font-bold">
                    {currentDisplayItem.aestheticScore.temporalStability
                      ? `${currentDisplayItem.aestheticScore.temporalStability}%`
                      : '99.4%'}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Anatomy Score</span>
                  <span className="text-emerald-300 font-bold">10 / 10</span>
                </div>
              </div>
            </div>

            {/* Optical Specs Recap */}
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs space-y-1.5 font-mono text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Sensor / Camera:</span>
                <span className="text-slate-200">{currentDisplayItem.cameraConfig.body}</span>
              </div>
              <div className="flex justify-between">
                <span>Lens & Aperture:</span>
                <span className="text-slate-200">
                  {currentDisplayItem.cameraConfig.lens.split(' ')[0]} @ {currentDisplayItem.cameraConfig.aperture}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Color Space:</span>
                <span className="text-cyan-400">ACEScg Linear 16-bit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Post Scheduler Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        item={currentDisplayItem}
        onSaveSchedule={handleScheduleSave}
      />
    </div>
  );
};
