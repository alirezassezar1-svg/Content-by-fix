import React, { useState } from 'react';
import {
  Archive,
  Maximize2,
  Trash2,
  Star,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Camera,
  Film,
  Search,
  Clock,
  Send,
  CheckCircle2,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
  Video,
  Edit3,
  Copy,
  Check,
  ListOrdered,
  Grid,
} from 'lucide-react';
import { GeneratedMediaItem } from './media';
import { ScheduleModal } from './ScheduleModal';

interface VaultHistoryViewProps {
  history: GeneratedMediaItem[];
  onSelectForInspect: (item: GeneratedMediaItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateItem?: (updatedItem: GeneratedMediaItem) => void;
}

export const VaultHistoryView: React.FC<VaultHistoryViewProps> = ({
  history,
  onSelectForInspect,
  onDeleteItem,
  onToggleFavorite,
  onUpdateItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'favorites'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  // Modal state for editing/creating schedule
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedulingItem, setSchedulingItem] = useState<GeneratedMediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scheduledCount = history.filter((i) => i.status === 'scheduled').length;
  const favCount = history.filter((i) => i.isFavorite).length;

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.promptEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.promptFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.socialCaption && item.socialCaption.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'scheduled') {
      return item.status === 'scheduled';
    }
    if (activeTab === 'favorites') {
      return item.isFavorite;
    }
    return true;
  });

  // Sort scheduled items chronologically in timeline view
  const timelineItems = [...history]
    .filter((i) => i.status === 'scheduled' && i.scheduledDate)
    .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());

  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-400" />;
      case 'x':
        return <Twitter className="w-3.5 h-3.5 text-slate-200" />;
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5 text-blue-400" />;
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5 text-red-400" />;
      case 'tiktok':
        return <Video className="w-3.5 h-3.5 text-teal-300" />;
      case 'telegram':
        return <MessageCircle className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Send className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const formatScheduledDate = (dateTimeStr?: string) => {
    if (!dateTimeStr) return '';
    try {
      const d = new Date(dateTimeStr);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateTimeStr.replace('T', ' ');
    }
  };

  const handleOpenScheduleModal = (item: GeneratedMediaItem) => {
    setSchedulingItem(item);
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = (
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
    if (onUpdateItem) {
      onUpdateItem(updated);
    }
  };

  const handleCancelSchedule = (item: GeneratedMediaItem) => {
    const updated: GeneratedMediaItem = {
      ...item,
      status: 'draft',
      scheduledDate: undefined,
    };
    if (onUpdateItem) {
      onUpdateItem(updated);
    }
  };

  const handleMarkPublished = (item: GeneratedMediaItem) => {
    const updated: GeneratedMediaItem = {
      ...item,
      status: 'published',
    };
    if (onUpdateItem) {
      onUpdateItem(updated);
    }
  };

  const handleCopyCaption = (item: GeneratedMediaItem) => {
    const text = item.socialCaption || item.promptEn;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-bold">
                PRODUCTION ASSET VAULT
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {history.length} Master Renders • {scheduledCount} Scheduled
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Render Vault & Social Queue Management
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Permanent studio vault holding 16-bit float masters, 3D camera trajectory metadata, reproducibility seeds, and scheduled social media publication queues.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute('href', dataStr);
                downloadAnchor.setAttribute('download', `aetheris_production_vault_${Date.now()}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Full Vault Manifest</span>
            </button>
          </div>
        </div>

        {/* Tab & Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-800/80">
          {/* Main Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>All Assets</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/40 font-mono">
                {history.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'scheduled'
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-sm shadow-amber-950/40'
                  : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Scheduled Posts</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  scheduledCount > 0 ? 'bg-amber-400 text-slate-950' : 'bg-black/40 text-slate-400'
                }`}
              >
                {scheduledCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'favorites'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Favorites Only</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/40 font-mono">
                {favCount}
              </span>
            </button>
          </div>

          {/* Search & View Mode Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompt, caption, tag..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {activeTab === 'scheduled' && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'grid' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'timeline' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Timeline Queue"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TIMELINE VIEW (When activeTab is 'scheduled' and viewMode is 'timeline') */}
      {activeTab === 'scheduled' && viewMode === 'timeline' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Chronological Scheduled Timeline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upcoming social media publications ordered by target date & time.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              {timelineItems.length} Posts in Queue
            </span>
          </div>

          {timelineItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Calendar className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-xs">No posts scheduled yet. Click "Schedule" on any asset to add to queue.</p>
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              {timelineItems.map((item, idx) => (
                <div key={item.id} className="relative pl-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all">
                  {/* Timeline Node Icon */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-400 z-10">
                    {idx + 1}
                  </div>

                  {/* Thumbnail & Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.passes.compositeUrl}
                      alt={item.title}
                      className="w-20 h-14 object-cover rounded-lg border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                          {getPlatformIcon(item.scheduledPlatform)}
                          <span>{item.scheduledPlatform?.toUpperCase()}</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {formatScheduledDate(item.scheduledDate)}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate max-w-md">{item.title}</h4>
                      {item.socialCaption && (
                        <p className="text-[11px] text-slate-400 truncate max-w-lg mt-0.5">
                          "{item.socialCaption}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyCaption(item)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 border border-slate-800 transition-colors"
                      title="Copy Caption"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">Caption</span>
                    </button>
                    <button
                      onClick={() => handleOpenScheduleModal(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors border border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Reschedule</span>
                    </button>
                    <button
                      onClick={() => handleMarkPublished(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-medium flex items-center gap-1 transition-colors border border-emerald-800/60"
                      title="Mark as Published"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Publish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {!(activeTab === 'scheduled' && viewMode === 'timeline') && (
        <>
          {filteredHistory.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-3">
              <Archive className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Assets Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {activeTab === 'scheduled'
                  ? 'There are currently no scheduled social posts in this queue. Use the "Schedule" button on any generated media asset to set publication date and time.'
                  : 'Your generated 8K images and cinematic video clips will be saved here automatically.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.map((item) => {
                const isScheduled = item.status === 'scheduled';
                return (
                  <div
                    key={item.id}
                    className={`group glass-panel rounded-2xl overflow-hidden border transition-all flex flex-col shadow-xl ${
                      isScheduled
                        ? 'border-amber-500/40 hover:border-amber-400 shadow-amber-950/20'
                        : 'border-slate-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={item.passes.compositeUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Resolution badge */}
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-300 font-bold border border-white/10">
                        {item.resolution}
                      </div>

                      {/* Scheduled status badge */}
                      {isScheduled && (
                        <div className="absolute top-3 right-12 px-2.5 py-0.5 rounded-lg bg-amber-950/90 text-[10px] font-mono text-amber-300 font-bold border border-amber-600/60 shadow-lg flex items-center gap-1.5 animate-pulse">
                          {getPlatformIcon(item.scheduledPlatform)}
                          <span>SCHEDULED</span>
                        </div>
                      )}

                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/80 text-slate-300 hover:text-amber-400 transition-colors"
                      >
                        <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.promptEn}
                        </p>
                      </div>

                      {/* Scheduled Date & Social Info Card */}
                      {isScheduled && item.scheduledDate && (
                        <div className="p-2.5 rounded-xl bg-slate-950/90 border border-amber-900/40 text-[11px] font-mono space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatScheduledDate(item.scheduledDate)}</span>
                            </span>
                            <span className="text-slate-400 uppercase text-[10px] flex items-center gap-1">
                              {getPlatformIcon(item.scheduledPlatform)}
                              <span>{item.scheduledPlatform || 'Social'}</span>
                            </span>
                          </div>
                          {item.socialCaption && (
                            <p className="text-[10px] text-slate-400 line-clamp-1 italic font-sans">
                              "{item.socialCaption}"
                            </p>
                          )}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Score: <strong className="text-emerald-400">{item.aestheticScore.predictedPhotorealism}</strong></span>
                        <span>Seed: <strong className="text-purple-300">{item.seed}</strong></span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={() => onSelectForInspect(item)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>8K Loupe</span>
                        </button>

                        {/* Schedule / Reschedule Button */}
                        <button
                          onClick={() => handleOpenScheduleModal(item)}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border ${
                            isScheduled
                              ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-700/60'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          }`}
                          title={isScheduled ? 'Edit Scheduled Date & Time' : 'Schedule Social Post'}
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isScheduled ? 'Reschedule' : 'Schedule'}</span>
                        </button>

                        {isScheduled && (
                          <button
                            onClick={() => handleCancelSchedule(item)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800"
                            title="Cancel Schedule"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Embedded Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false);
          setSchedulingItem(null);
        }}
        item={schedulingItem}
        onSaveSchedule={handleSaveSchedule}
      />
    </div>
  );
};
