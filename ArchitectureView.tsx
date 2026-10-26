import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Sparkles,
  Video,
  Award,
  Sliders,
  Server,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  FileCode,
  Download,
  Database,
  Globe,
} from 'lucide-react';
import { ARCHITECTURE_MODULES } from './mediaData';
import { ArchitectureModule } from './media';

export const ArchitectureView: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<ArchitectureModule>(ARCHITECTURE_MODULES[0]);
  const [activeTab, setActiveTab] = useState<'modules' | 'topology' | 'flow' | 'stack'>('modules');

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'Video':
        return <Video className="w-5 h-5 text-indigo-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sliders className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-purple-950 text-purple-300 border border-purple-800/60 font-bold">
                SYSTEM ARCHITECTURE WHITE-PAPER
              </span>
              <span className="text-xs text-slate-400 font-mono">AETHERIS v3.5 Enterprise Blueprint</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Modular Generative Media Architecture & Tech Stack
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Designed from first principles to exceed Midjourney v6/v7, Kling AI, and Luma Dream Machine. Built around a 14B parameter 3D Flow-Matching Diffusion Transformer, 3D RoPE temporal stability, and microscopic physical surface synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const specData = JSON.stringify(ARCHITECTURE_MODULES, null, 2);
                const blob = new Blob([specData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'aetheris_architecture_spec.json';
                a.click();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Architecture JSON</span>
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'modules'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            6 Core Modules Explorer
          </button>
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'topology'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            GPU Cluster Topology (H100 NVLink)
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'flow'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            End-to-End Latent Pipeline Flow
          </button>
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'stack'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            Complete Technical Stack Spec
          </button>
        </div>
      </div>

      {/* TAB 1: 6 Core Modules Explorer */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Module Selector Sidebar (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
              Architecture Core Subsystems
            </span>
            {ARCHITECTURE_MODULES.map((mod) => {
              const isSelected = selectedModule.id === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={`w-full text-left p-4 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-cyan-500/60 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">
                      {getModuleIcon(mod.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold truncate text-white">{mod.titleEn}</h3>
                        <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                          {mod.latencyBenchmark.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5" dir="rtl">
                        {mod.titleFa}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                        {mod.headline}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Module Deep-Dive Details (7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800">
                  {getModuleIcon(selectedModule.icon)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{selectedModule.titleEn}</h2>
                  <p className="text-xs text-cyan-400 font-mono" dir="rtl">
                    {selectedModule.titleFa}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {selectedModule.category.toUpperCase()}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Technical Summary & Math Foundation
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                {selectedModule.technicalSummary}
              </p>
            </div>

            {/* Key Innovations */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Core Architectural Breakthroughs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedModule.keyInnovations.map((inn, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200 leading-relaxed font-medium">{inn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware & Serving Environment */}
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-purple-400" />
                  Hardware Sizing & Compute Target
                </span>
                <span className="font-mono text-purple-400 font-bold">
                  {selectedModule.latencyBenchmark}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                {selectedModule.hardwareRequirements}
              </p>
            </div>

            {/* Stack Components */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Stack Components & Libraries
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedModule.stackComponents.map((comp, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono text-cyan-300 border border-slate-700"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GPU Cluster Topology (H100 NVLink) */}
      {activeTab === 'topology' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" />
                Enterprise Distributed Inference Topology (8x H100 80GB SXM5 Pod)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Optimized for ultra-low latency Flow-Matching ODE integration and 8K continuous tiled neural upscaling.
              </p>
            </div>

            {/* Cluster Visual Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((gpu) => (
                <div
                  key={gpu}
                  className="p-4 rounded-xl bg-slate-950 border border-cyan-800/40 space-y-2 hover:border-cyan-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">GPU NODE {gpu}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>Model: NVIDIA H100 SXM5</div>
                    <div>VRAM: 80GB HBM3 (3.35 TB/s)</div>
                    <div>Tensor Precision: FP8 / BF16</div>
                    <div>NVLink Bandwidth: 900 GB/s</div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-bold">
                    Active Load: ~42%
                  </div>
                </div>
              ))}
            </div>

            {/* Interconnect & Serving Stack */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Model Sharding & Parallelism
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tensor Parallelism (TP=4) + Sequence Parallelism (SP=2). Fused FlashAttention-3 kernels minimize memory transfers across NVLink mesh.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Inference Serving Engine
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Triton Inference Server paired with TensorRT-LLM and vLLM for continuous batching, dynamic KV-cache sharing, and sub-10ms scheduling overhead.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Storage & Streaming VAE
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  NVMe-oF (NVMe over Fabrics) storage cluster delivering 100 GB/s throughput for instant checkpoint loading and tiled 8K uncompressed EXR streaming.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Pipeline Flow */}
      {activeTab === 'flow' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              End-to-End Generative Pipeline Execution Flow
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              From raw bilingual Persian/English user prompt to 8K master output.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Prompt Parsing & Directorial Translation',
                desc: 'Gemini 3.8 Flash / Director NLP parses Persian idioms and English instructions, translating them into optical parameters, ACEScg color specifications, and negative prompt boundaries.',
                badge: '180ms',
                badgeColor: 'text-cyan-400 bg-cyan-950 border-cyan-800',
              },
              {
                step: '02',
                title: 'Dual-Text Conditioning & Latent Seeding',
                desc: 'Dual text encoders (T5-XXL + OpenCLIP-G/14) vectorize syntax and semantics into cross-attention projections. 3D spatial-temporal latent noise tensor initialized at 8x8x4 compression ratio.',
                badge: '120ms',
                badgeColor: 'text-indigo-400 bg-indigo-950 border-indigo-800',
              },
              {
                step: '03',
                title: 'Flow-Matching 3D DiT ODE Integration',
                desc: 'Rectified Flow solver computes the straight velocity vector field over 40-60 Euler ODE steps. 3D RoPE embeddings and cross-frame attention maintain identity preservation and physical motion dynamics.',
                badge: '2.1s (Image) / 6.8s (Video)',
                badgeColor: 'text-purple-400 bg-purple-950 border-purple-800',
              },
              {
                step: '04',
                title: 'Microscopic Detail Synthesis & Dermal Refinement',
                desc: 'Dermal micro-pore generator, hair strand synthesizer, and caustics refraction engine inject sub-millimeter physical surface realism into specular highlights.',
                badge: '850ms',
                badgeColor: 'text-amber-400 bg-amber-950 border-amber-800',
              },
              {
                step: '05',
                title: 'Aesthetic Scoring QC & Tiled 8K Neural Upscale',
                desc: 'HPSv2 & anatomical defect classifiers score the output (threshold > 9.5). Real-ESRGAN+ tiled neural upscaling reconstructs native 8K/16K buffers with ACEScg color space conversion.',
                badge: '1.2s',
                badgeColor: 'text-emerald-400 bg-emerald-950 border-emerald-800',
              },
            ].map((st, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-black text-cyan-400 text-sm shrink-0">
                    {st.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{st.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">{st.desc}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border shrink-0 ${st.badgeColor}`}
                >
                  {st.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Technical Stack Spec */}
      {activeTab === 'stack' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Machine Learning & Model Frameworks
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-white">PyTorch 2.4+</strong> with TorchDynamo Inductor C++ compiler
              </li>
              <li className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-white">FlashAttention-3</strong> with FP8 fused cross-attention kernels
              </li>
              <li className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-white">Gemini 3.8 Flash SDK</strong> for multilingual multimodal director prompt expansion
              </li>
              <li className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-white">TensorRT-LLM</strong> for ultra-low latency continuous transformer inference
              </li>
              <li className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-white">RAFT Optical Flow & 3D RoPE</strong> for cross-frame temporal locking
              </li>
            </ul>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Rendering, Optics & Color Science
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-white">ACEScg (SMPTE 2065-1)</strong> Linear Floating-Point Color Pipeline
              </li>
              <li className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-white">Kodak Vision3 5219</strong> Physical Film Grain & Halation Simulator
              </li>
              <li className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-white">Cooke /i Technology</strong> Anamorphic lens distortion and oval bokeh engine
              </li>
              <li className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-white">Real-ESRGAN+ & DiT Tiled Refiner</strong> for native 8K/16K scaling
              </li>
              <li className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-white">OpenEXR & Apple ProRes 422 HQ</strong> Multi-channel output encoder
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
