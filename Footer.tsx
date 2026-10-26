import React from 'react';
import { Sparkles, Cpu, Layers, Video, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { NavigationTab } from './types';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070a10] text-slate-400">
      {/* Top Architecture Status Bar */}
      <div className="border-b border-slate-800/60 bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-600 p-[1px] shadow-lg shadow-cyan-950/40">
              <div className="w-full h-full bg-[#070a10] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white font-mono">AETHERIS STUDIO</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                  v3.5 PRODUCTION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                14B Parameter 3D Flow-Matching DiT • 8K Native Output • 3D RoPE Temporal Consistency
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('architecture')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-300 border border-slate-700 transition-colors"
            >
              Architecture Blueprint
            </button>
            <button
              onClick={() => setActiveTab('specification')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono text-purple-300 border border-slate-700 transition-colors"
            >
              Benchmarks vs Midjourney & Kling
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Specs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: System Specs */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white font-mono block">
              Core Engine Specs
            </span>
            <ul className="space-y-1.5 text-xs font-mono text-slate-400">
              <li>DiT Architecture: 3D DiT-XL/16 (14B)</li>
              <li>Temporal Positional: 3D RoPE</li>
              <li>VAE Compression: 8×8×4 Spatial-Temporal</li>
              <li>Inference ODE: Rectified Flow-Matching</li>
              <li>Color Science: ACEScg Linear 16-bit</li>
            </ul>
          </div>

          {/* Col 2: Studio Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white font-mono block">
              Studio Workspaces
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('studio')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  8K Image & Video Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('canvas')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  400% Loupe & Multi-Pass Canvas
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('motion_brush')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Motion Brush & Physics Dynamics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Master Showcase Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Render Production Vault
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hardware Cluster */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white font-mono block">
              Inference Hardware Mesh
            </span>
            <ul className="space-y-1.5 text-xs font-mono text-slate-400">
              <li>Nodes: 8× NVIDIA H100 SXM5 80GB</li>
              <li>Interconnect: NVLink 900 GB/s</li>
              <li>Kernels: FlashAttention-3 FP8 Fused</li>
              <li>Serving: Triton + TensorRT-LLM</li>
              <li>Latency Target: &lt; 2.1s per 4K frame</li>
            </ul>
          </div>

          {/* Col 4: Quality & Standards */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white font-mono block">
              Quality Assurance
            </span>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Octane & Unreal Engine 5 Parity</li>
              <li>Subsurface Dermal Scattering (SSS)</li>
              <li>Zero Mutant Anatomy Classifier</li>
              <li>C2PA Content Credentials Provenance</li>
              <li>Bilingual Persian & English Understanding</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © 2026 AETHERIS Generative Media Engine. Built for global studios, creators, and enterprises.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400 font-bold">8K Cinema Ready</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">100% Deterministic Seed Reproducibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
