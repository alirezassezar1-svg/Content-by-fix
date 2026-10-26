import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Send,
  X,
  Sparkles,
  CheckCircle2,
  Share2,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
  Video,
  Hash,
  Copy,
  Check,
} from 'lucide-react';
import { GeneratedMediaItem } from './media';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GeneratedMediaItem | null;
  onSaveSchedule: (
    item: GeneratedMediaItem,
    scheduledDate: string,
    platform: 'instagram' | 'x' | 'linkedin' | 'youtube' | 'tiktok' | 'telegram' | 'general',
    caption: string,
    notes?: string
  ) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveSchedule,
}) => {
  if (!isOpen || !item) return null;

  // Initialize with tomorrow at 18:00 or existing scheduled date
  const getInitialDate = () => {
    if (item.scheduledDate) {
      return item.scheduledDate.split('T')[0] || '';
    }
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getInitialTime = () => {
    if (item.scheduledDate && item.scheduledDate.includes('T')) {
      return item.scheduledDate.split('T')[1].slice(0, 5) || '18:00';
    }
    return '18:00';
  };

  const [date, setDate] = useState<string>(getInitialDate());
  const [time, setTime] = useState<string>(getInitialTime());
  const [platform, setPlatform] = useState<
    'instagram' | 'x' | 'linkedin' | 'youtube' | 'tiktok' | 'telegram' | 'general'
  >(item.scheduledPlatform || 'instagram');

  const [caption, setCaption] = useState<string>(() => {
    if (item.socialCaption) return item.socialCaption;
    return `✨ ${item.title}\n\n${item.promptEn.slice(0, 180)}...\n\n#AIArt #Cinematography #8K #AetherisStudio #DigitalArt`;
  });

  const [notes, setNotes] = useState<string>(item.scheduledNotes || '');
  const [copied, setCopied] = useState(false);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Platform limits & icons
  const platforms = [
    {
      id: 'instagram' as const,
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 via-rose-500 to-amber-500',
      badgeColor: 'border-pink-500/50 text-pink-400 bg-pink-950/40',
      charLimit: 2200,
    },
    {
      id: 'x' as const,
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'from-slate-700 to-slate-900',
      badgeColor: 'border-slate-500/50 text-slate-200 bg-slate-900',
      charLimit: 280,
    },
    {
      id: 'linkedin' as const,
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'from-blue-600 to-cyan-700',
      badgeColor: 'border-blue-500/50 text-blue-400 bg-blue-950/40',
      charLimit: 3000,
    },
    {
      id: 'youtube' as const,
      name: 'YouTube Shorts',
      icon: Youtube,
      color: 'from-red-600 to-rose-700',
      badgeColor: 'border-red-500/50 text-red-400 bg-red-950/40',
      charLimit: 5000,
    },
    {
      id: 'tiktok' as const,
      name: 'TikTok',
      icon: Video,
      color: 'from-teal-500 to-fuchsia-600',
      badgeColor: 'border-teal-500/50 text-teal-300 bg-teal-950/40',
      charLimit: 2200,
    },
    {
      id: 'telegram' as const,
      name: 'Telegram',
      icon: MessageCircle,
      color: 'from-sky-500 to-blue-600',
      badgeColor: 'border-sky-500/50 text-sky-400 bg-sky-950/40',
      charLimit: 4096,
    },
  ];

  const currentPlatformObj = platforms.find((p) => p.id === platform) || platforms[0];

  // Quick Date presets
  const handleQuickDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    setDate(d.toISOString().split('T')[0]);
  };

  // Quick Time presets
  const quickTimes = [
    { label: '09:00', desc: 'Morning Peak' },
    { label: '13:00', desc: 'Lunch Break' },
    { label: '18:00', desc: 'Evening Commute' },
    { label: '21:00', desc: 'Prime Time' },
  ];

  // Auto-generate hashtags
  const handleAddHashtags = () => {
    const tags = ['#NextGenAI', '#8KPhotorealism', '#CinematicRendering', '#AetherisEngine', '#CreativeStudio', '#VFX'];
    if (!caption.includes('#NextGenAI')) {
      setCaption((prev) => `${prev.trim()}\n\n${tags.join(' ')}`);
    }
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    const fullScheduledDateTime = `${date}T${time}`;
    onSaveSchedule(item, fullScheduledDateTime, platform, caption, notes);

    setIsSuccessToast(true);
    setTimeout(() => {
      setIsSuccessToast(false);
      onClose();
    }, 600);
  };

  // Today string for min date
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#080c14] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-950/40">
              <div className="w-full h-full bg-[#080c14] rounded-[11px] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Schedule Social Media Post
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-800/60">
                  Scheduled State
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pick publication date, time, and target platform to queue in your Vault
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Item Preview Card */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-700/60">
              <img
                src={item.passes.compositeUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-cyan-300">
                {item.resolution}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-0.5">
                Target Render Asset • {item.mode.toUpperCase()}
              </span>
              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.promptEn}</p>
            </div>
          </div>

          {/* Social Platform Selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300 uppercase tracking-wider block text-[11px]">
              1. Select Social Media Destination
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {platforms.map((p) => {
                const isSelected = platform === p.id;
                const IconComponent = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 text-white border-cyan-400 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/40'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${p.color} flex items-center justify-center text-white shrink-0`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold block truncate text-xs">{p.name}</span>
                      <span className="text-[10px] text-slate-500">Max {p.charLimit} chars</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Picker & Presets */}
            <div className="space-y-2">
              <label className="font-bold text-slate-300 uppercase tracking-wider block text-[11px] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. Publication Date</span>
              </label>

              <input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />

              {/* Quick Date Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickDate(0)}
                  className="px-2 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(1)}
                  className="px-2 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(2)}
                  className="px-2 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors"
                >
                  In 2 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(5)}
                  className="px-2 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors"
                >
                  Weekend
                </button>
              </div>
            </div>

            {/* Time Picker & Presets */}
            <div className="space-y-2">
              <label className="font-bold text-slate-300 uppercase tracking-wider block text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>3. Publication Time</span>
              </label>

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />

              {/* Quick Time Slots */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {quickTimes.map((qt) => (
                  <button
                    key={qt.label}
                    type="button"
                    onClick={() => setTime(qt.label)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono text-left transition-colors flex items-center justify-between border ${
                      time === qt.label
                        ? 'bg-purple-950/80 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{qt.label}</span>
                    <span className="text-[9px] text-slate-500">{qt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Social Caption & Hashtag Composer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 uppercase tracking-wider block text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Social Post Caption & Hashtags</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddHashtags}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                >
                  <Hash className="w-3 h-3" />
                  <span>+ Smart Tags</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write or edit the post caption that will accompany the visual..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-sans leading-relaxed"
            />

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>Optimized for {currentPlatformObj.name}</span>
              <span className={caption.length > currentPlatformObj.charLimit ? 'text-rose-400 font-bold' : ''}>
                {caption.length} / {currentPlatformObj.charLimit} chars
              </span>
            </div>
          </div>

          {/* Schedule Confirmation Summary Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-950 border border-cyan-800/40 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-slate-300 space-y-0.5 leading-relaxed">
              <span className="font-bold text-white block">Queue Summary</span>
              <p>
                Asset will be tagged as <strong className="text-amber-400">Scheduled</strong> for{' '}
                <strong className="text-cyan-300">{date}</strong> at <strong className="text-cyan-300">{time}</strong> on{' '}
                <strong className="text-white">{currentPlatformObj.name}</strong> and saved in your Vault.
              </p>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Save to Scheduled Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
