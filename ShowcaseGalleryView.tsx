import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  Camera,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  Film,
  Download,
} from 'lucide-react';
import { SHOWCASE_GALLERY } from './mediaData';
import { GeneratedMediaItem } from './media';

interface ShowcaseGalleryViewProps {
  onSelectForInspect: (item: GeneratedMediaItem) => void;
  onLoadIntoStudio: (item: GeneratedMediaItem) => void;
}

export const ShowcaseGalleryView: React.FC<ShowcaseGalleryViewProps> = ({
  onSelectForInspect,
  onLoadIntoStudio,
}) => {
  const [filterGenre, setFilterGenre] = useState<string>('all');

  const filteredItems = SHOWCASE_GALLERY.filter((item) => {
    if (filterGenre === 'all') return true;
    if (filterGenre === 'portrait') return item.engine === 'aetheris-micro-macro' && item.mode === 'image';
    if (filterGenre === 'cyberpunk') return item.promptEn.toLowerCase().includes('cyber') || item.promptEn.toLowerCase().includes('tokyo');
    if (filterGenre === 'macro') return item.promptEn.toLowerCase().includes('leaf') || item.promptEn.toLowerCase().includes('caustic');
    if (filterGenre === 'video') return item.mode === 'video';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                8K NATIVE CURATED REEL
              </span>
              <span className="text-xs text-slate-400 font-mono">Hollywood & Octane Standard</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Master Showcase & Directorial Benchmark Gallery
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Explore rendered outputs demonstrating microscopic skin pores, individual silver hair strands, raytraced wet asphalt reflections, brushed titanium micro-scratches, and optical water caustics.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Masterworks' },
            { id: 'portrait', label: '8K Micro-Pore Portraits' },
            { id: 'cyberpunk', label: 'Cyberpunk & Volumetric Lighting' },
            { id: 'macro', label: 'Macro Caustics & SSS' },
            { id: 'video', label: 'Cinematic Tracking Video' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterGenre(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterGenre === f.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col shadow-xl"
          >
            {/* Image Container with Badges */}
            <div className="relative aspect-video overflow-hidden bg-black">
              <img
                src={item.passes.compositeUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Resolution badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-cyan-300">
                8K NATIVE
              </div>

              {/* Mode badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white uppercase">
                {item.mode}
              </div>

              {/* Aesthetic Score overlay */}
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>HPSv2 {item.aestheticScore.predictedPhotorealism} / 10</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.promptEn}
                </p>
                <p className="text-[11px] text-slate-500 font-mono line-clamp-1" dir="rtl">
                  {item.promptFa}
                </p>
              </div>

              {/* Camera metadata tags */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                <div className="truncate">
                  <span className="text-slate-500">Camera:</span> {item.cameraConfig.body.split(' ')[0]}
                </div>
                <div className="truncate">
                  <span className="text-slate-500">Aperture:</span> {item.cameraConfig.aperture}
                </div>
                <div className="truncate">
                  <span className="text-slate-500">Lens:</span> {item.cameraConfig.lens.split(' ')[0]}
                </div>
                <div className="truncate text-cyan-400">
                  <span>Color:</span> ACEScg
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => onSelectForInspect(item)}
                  className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>8K Loupe</span>
                </button>
                <button
                  onClick={() => onLoadIntoStudio(item)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Camera className="w-3.5 h-3.5 text-purple-400" />
                  <span>Load Rig</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
