import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Zap,
  Target,
  Calendar,
  Layers,
  Sparkles,
  Shield,
  Download,
} from 'lucide-react';
import { BENCHMARK_COMPARISONS } from './mediaData';

export const SpecificationView: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  const ROADMAP_PHASES = [
    {
      phase: 1,
      name: 'Phase 1: Flow-Matching DiT Foundation & Multilingual NLP',
      timeline: 'Q1 - Q2 2026',
      status: 'Production Ready',
      milestones: [
        '14B Parameter 3D Diffusion Transformer (DiT-XL/16) core engine',
        'Rectified Flow-Matching ODE solver (40-step convergence)',
        'Native Persian & English semantic parser with Gemini 3.8 Flash',
        'Native 4K generation with zero-shot aspect ratio flexibility',
        'HPSv2 & LAION Aesthetic automated scoring pipeline',
      ],
    },
    {
      phase: 2,
      name: 'Phase 2: Temporal Video Engine & Optical Cinematography',
      timeline: 'Q3 2026',
      status: 'Active Deployment',
      milestones: [
        '3D RoPE temporal positional embeddings across 120 continuous frames',
        'Parametric Camera Trajectories (Dolly, Crane, Orbit, FPV Drone, Vertigo)',
        'Selective Latent Motion Brush with fluid & cloth physics',
        'Identity Preservation Lock (character consistency across shots < 0.6% drift)',
        '24/30/60 FPS cinema cadence rendering',
      ],
    },
    {
      phase: 3,
      name: 'Phase 3: Microscopic Surface Detail & Studio Compositing Pipeline',
      timeline: 'Q4 2026',
      status: 'Feature Complete',
      milestones: [
        'Micro-dermal pore, individual hair follicle & metal scratch synthesis',
        'Multi-layer Subsurface Scattering (SSS) and water caustics (IOR 1.33)',
        'Full multi-pass output: Composite, Z-Depth, Surface Normals, AO',
        'Native 8K (7680x4320) & 16K IMAX neural tiled upscaler',
        'ACEScg Linear color management & ProRes 422 HQ exporter',
      ],
    },
    {
      phase: 4,
      name: 'Phase 4: Global Enterprise Cloud & Real-Time Interactive DiT',
      timeline: '2027 Horizon',
      status: 'Research & Scaling',
      milestones: [
        'Sub-second real-time interactive generation (100ms latent feedback)',
        'Multi-camera virtual studio rigging & Unreal Engine 5 live bridge',
        'Global multi-region H100/B200 cluster mesh with geo-distributed caching',
        'Enterprise RBAC, team collaboration workspaces & on-premise air-gapped pods',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/60 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-bold">
            PRODUCT SPECIFICATION & BENCHMARKS
          </span>
          <span className="text-xs text-slate-400 font-mono">Industry Competitive Analysis</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Product Specification & Technical Roadmap
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Comprehensive competitive benchmarks against Midjourney v6/v7, Leonardo.ai, Kling AI, and Luma Dream Machine. Outlining our architectural advantage, enterprise SLA, and four-phase implementation roadmap.
        </p>
      </div>

      {/* Competitive Benchmark Matrix */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Competitive Benchmark Matrix (AETHERIS vs Industry Leaders)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical evaluation across resolution, microscopic fidelity, motion consistency, and optical controls.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold bg-slate-900 px-3 py-1 rounded border border-slate-700">
            AETHERIS Flow-DiT v3.5
          </span>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-3 px-3">Evaluation Metric</th>
                <th className="py-3 px-3 bg-cyan-950/40 text-cyan-300 font-bold border-x border-cyan-800/40">
                  AETHERIS (Our Platform)
                </th>
                <th className="py-3 px-3 text-slate-400">Midjourney v6/v7</th>
                <th className="py-3 px-3 text-slate-400">Kling AI</th>
                <th className="py-3 px-3 text-slate-400">Luma Dream Machine</th>
                <th className="py-3 px-3 text-emerald-400">Aetheris Architectural Moat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {BENCHMARK_COMPARISONS.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold text-slate-200">{b.metric}</td>
                  <td className="py-3 px-3 bg-cyan-950/20 text-cyan-300 font-bold border-x border-cyan-800/30">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{b.aetheris}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{b.midjourneyV6}</td>
                  <td className="py-3 px-3 text-slate-400">{b.klingAI}</td>
                  <td className="py-3 px-3 text-slate-400">{b.lumaDream}</td>
                  <td className="py-3 px-3 text-emerald-300 font-sans font-medium text-[11px]">
                    {b.advantage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enterprise Product Specifications & SLA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance & Latency SLA
          </span>
          <ul className="space-y-2 text-xs font-mono text-slate-300">
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Prompt Directorial Expansion:</span>
              <span className="text-cyan-300 font-bold">&lt; 350ms</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">4K Image Generation:</span>
              <span className="text-cyan-300 font-bold">2.1s (H100)</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">8K Master Neural Pass:</span>
              <span className="text-cyan-300 font-bold">4.8s total</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">6s Cinematic Video (30fps):</span>
              <span className="text-cyan-300 font-bold">6.8s</span>
            </li>
            <li className="flex justify-between py-1">
              <span className="text-slate-400">API Cluster Uptime:</span>
              <span className="text-emerald-400 font-bold">99.95% SLA</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Supported Output Formats
          </span>
          <ul className="space-y-2 text-xs font-mono text-slate-300">
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Still Formats:</span>
              <span className="text-slate-200">16-bit PNG, TIFF, OpenEXR</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Video Formats:</span>
              <span className="text-slate-200">ProRes 422 HQ, MP4 H.265</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Pass Channels:</span>
              <span className="text-purple-300">Beauty, Z-Depth, Normals, AO</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Color Spaces:</span>
              <span className="text-slate-200">ACEScg, Rec.2020, sRGB</span>
            </li>
            <li className="flex justify-between py-1">
              <span className="text-slate-400">3D Metadata:</span>
              <span className="text-cyan-300">Camera Trajectory FBX/JSON</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Quality Assurance & Safety
          </span>
          <ul className="space-y-2 text-xs font-mono text-slate-300">
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Anatomical Defect Filter:</span>
              <span className="text-emerald-400">Zero mutant fingers</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Temporal Flicker Tolerance:</span>
              <span className="text-emerald-400">&lt; 0.6% EPE</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Aesthetic Threshold:</span>
              <span className="text-slate-200">HPSv2 &gt; 9.5 (Auto-resample)</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Content Moderation:</span>
              <span className="text-slate-200">Enterprise C2PA Watermark</span>
            </li>
            <li className="flex justify-between py-1">
              <span className="text-slate-400">Identity Persistence:</span>
              <span className="text-purple-300 font-bold">Consistent Across 30+ Shots</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4-Phase Implementation Roadmap */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Four-Phase Implementation Roadmap
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured engineering milestones from initial research to global distributed cloud deployment.
            </p>
          </div>
        </div>

        {/* Phase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {ROADMAP_PHASES.map((rp) => {
            const isSelected = selectedPhase === rp.phase;
            return (
              <button
                key={rp.phase}
                onClick={() => setSelectedPhase(rp.phase)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">PHASE 0{rp.phase}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      rp.status === 'Production Ready'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                        : rp.status === 'Active Deployment'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                        : 'bg-purple-950 text-purple-300 border border-purple-800/50'
                    }`}
                  >
                    {rp.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2 mb-1">{rp.name}</h4>
                <span className="text-[10px] font-mono text-indigo-400 block">{rp.timeline}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Phase Detail Card */}
        {(() => {
          const current = ROADMAP_PHASES.find((p) => p.phase === selectedPhase) || ROADMAP_PHASES[0];
          return (
            <div className="p-5 rounded-xl bg-slate-950 border border-indigo-900/40 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{current.name}</h4>
                <span className="text-xs font-mono text-indigo-300">{current.timeline}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {current.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
