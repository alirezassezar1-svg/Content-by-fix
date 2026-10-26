import React, { useState } from 'react';
import { NavigationTab } from './types';
import {
  Sparkles,
  Camera,
  Maximize2,
  Cpu,
  FileText,
  Paintbrush,
  Image as ImageIcon,
  Archive,
  Menu,
  X,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  technicalMode: boolean;
  setTechnicalMode: (mode: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  technicalMode,
  setTechnicalMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNav: { id: NavigationTab; label: string; labelFa: string; icon: React.ReactNode }[] = [
    { id: 'studio', label: 'Studio Engine', labelFa: 'موتور استودیو', icon: <Camera className="w-4 h-4" /> },
    { id: 'canvas', label: '8K Inspector & Passes', labelFa: 'بازرس ۸K و لایه‌ها', icon: <Maximize2 className="w-4 h-4" /> },
    { id: 'architecture', label: 'System Architecture', labelFa: 'معماری سیستم', icon: <Cpu className="w-4 h-4" /> },
    { id: 'specification', label: 'Specification & Roadmap', labelFa: 'مشخصات و نقشه راه', icon: <FileText className="w-4 h-4" /> },
    { id: 'motion_brush', label: 'Motion Physics', labelFa: 'فیزیک حرکت', icon: <Paintbrush className="w-4 h-4" /> },
    { id: 'gallery', label: 'Master Showcase', labelFa: 'گالری شاهکارها', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'history', label: 'Render Vault', labelFa: 'آرشیو رندرها', icon: <Archive className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080c14]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-2.5 text-left focus:outline-none rounded-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-600 p-[1.5px] shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider text-white font-mono">AETHERIS</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded">
                  8K DiT
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block tracking-tight font-medium">
                Next-Gen Generative Media Platform
              </span>
            </div>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {mainNav.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-slate-800/90 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Technical Mode Toggle & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setTechnicalMode(false)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                !technicalMode
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setTechnicalMode(true)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded font-medium transition-all ${
                technicalMode
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-300" />
              Advanced Tech
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#080c14] px-4 py-4 space-y-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Engine Mode</span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-1">
              <button
                onClick={() => setTechnicalMode(false)}
                className={`px-2 py-0.5 text-xs rounded ${!technicalMode ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                Simple
              </button>
              <button
                onClick={() => setTechnicalMode(true)}
                className={`px-2 py-0.5 text-xs rounded ${technicalMode ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
              >
                Advanced
              </button>
            </div>
          </div>
          {mainNav.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-slate-800 text-cyan-300' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{link.labelFa}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
