import React, { useState } from 'react';
import { GeneratedHistoryItem } from './types';
import {
  History,
  Search,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

interface HistoryViewProps {
  history: GeneratedHistoryItem[];
  onLoadItemIntoEditor: (item: GeneratedHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onLoadItemIntoEditor,
  onDeleteItem,
  onClearAll,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'yesterday' | 'week'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  const filteredHistory = history.filter((item) => {
    const itemDate = new Date(item.date);
    const diffDays = Math.floor((now.getTime() - itemDate.getTime()) / oneDay);

    if (filterPeriod === 'today' && diffDays !== 0) return false;
    if (filterPeriod === 'yesterday' && diffDays !== 1) return false;
    if (filterPeriod === 'week' && diffDays > 7) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchContent = item.content.toLowerCase().includes(q);
      const matchType = item.contentType.toLowerCase().includes(q);
      return matchTitle || matchContent || matchType;
    }

    return true;
  });

  const handleCopy = (item: GeneratedHistoryItem) => {
    navigator.clipboard.writeText(item.content);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('fa-IR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c121e] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <History className="w-4 h-4" />
            <span>تاریخچه محتواهای تولیدشده</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            پروژه‌ها و محتواهای ذخیره‌شده شما
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            تمامی محتواهای تولیدشده به صورت محلی (LocalStorage) در مرورگر شما نگهداری می‌شوند.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>پاکسازی تاریخچه</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-[#0c121d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {[
            { id: 'all', label: 'همه زمان‌ها' },
            { id: 'today', label: 'امروز (Today)' },
            { id: 'yesterday', label: 'دیروز (Yesterday)' },
            { id: 'week', label: '۷ روز گذشته (Last 7 Days)' },
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => setFilterPeriod(period.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                filterPeriod === period.id
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در آرشیو محتوا..."
            className="w-full bg-[#080d15] border border-slate-700/80 rounded-lg pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2" />
        </div>
      </div>

      {/* Items Grid */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-800 bg-[#090e17] space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">هنوز پروژه‌ای در تاریخچه ثبت نشده است</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            پس از هر بار تولید محتوا در استودیو، خروجی به صورت خودکار در این بخش ذخیره خواهد شد.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-slate-800 bg-[#0c121d] flex flex-col justify-between gap-4 hover:border-slate-700 transition-all shadow-md"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 font-medium">
                    {item.contentType}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.date)}</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {item.content.replace(/#+/g, '').trim()}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 tabular-nums">
                  {item.wordCount} کلمه
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 rounded transition-colors"
                    title="کپی متن"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onLoadItemIntoEditor(item)}
                    className="p-1.5 text-slate-400 hover:text-white rounded transition-colors"
                    title="باز کردن در ویرایشگر"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    title="حذف از تاریخچه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
