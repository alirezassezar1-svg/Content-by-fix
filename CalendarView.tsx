import React, { useState } from 'react';
import { CalendarDayItem, GeneratedHistoryItem } from './types';
import { BUSINESS_INDUSTRIES } from './industries';
import {
  Calendar,
  Sparkles,
  Download,
  Copy,
  Check,
  Filter,
  Instagram,
  Linkedin,
  Twitter,
  FileText,
  Film,
  Youtube,
  Mail,
  Loader2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface CalendarViewProps {
  onSaveToHistory: (item: GeneratedHistoryItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onSaveToHistory }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(BUSINESS_INDUSTRIES[10].id); // ecommerce default
  const [businessName, setBusinessName] = useState('فروشگاه پوشاک مدرن');
  const [audience, setAudience] = useState('خریداران آنلاین ۲۰ تا ۳۵ سال');
  const [postsPerWeek, setPostsPerWeek] = useState(4);
  const [daysCount, setDaysCount] = useState<7 | 14 | 30>(14);

  const [isLoading, setIsLoading] = useState(false);
  const [calendarItems, setCalendarItems] = useState<CalendarDayItem[]>([]);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const currentInd = BUSINESS_INDUSTRIES.find((b) => b.id === selectedIndustry) || BUSINESS_INDUSTRIES[0];

  const handleGenerateCalendar = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType: businessName,
          industry: currentInd.name,
          audience,
          postsPerWeek,
          daysCount,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCalendarItems(data.data);
        onSaveToHistory({
          id: Date.now().toString(),
          title: `تقویم محتوایی ${daysCount} روزه: ${businessName}`,
          contentType: 'تقویم محتوایی',
          content: `تقویم محتوایی شامل برنامه انتشار برای ${data.data.length} روز در پلتفرم‌های اینستاگرام، لینکدین، بلاگ، توییتر و ریلز.`,
          date: new Date().toISOString(),
          wordCount: 350,
        });
      }
    } catch (e) {
      console.error('Calendar generation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = calendarItems.filter((item) => {
    if (platformFilter === 'all') return true;
    return item.platform.includes(platformFilter);
  });

  const copyDay = (item: CalendarDayItem) => {
    const text = `روز ${item.dayNumber} (${item.dayName}) - پلتفرم: ${item.platform}
نوع محتوا: ${item.contentType}
عنوان: ${item.title}
قلاب (Hook): ${item.hook}
کلمه کلیدی: ${item.targetKeyword}
کال تو اکشن: ${item.cta}`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.dayNumber);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCsv = () => {
    if (!calendarItems.length) return;
    const header = 'Day,DayName,Platform,Type,Title,Hook,Keyword,CTA\n';
    const rows = calendarItems
      .map(
        (c) =>
          `"${c.dayNumber}","${c.dayName}","${c.platform}","${c.contentType}","${c.title.replace(/"/g, '""')}","${c.hook.replace(/"/g, '""')}","${c.targetKeyword}","${c.cta.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content_calendar_${daysCount}_days.csv`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0d1727] to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>برنامه‌ریزی استراتژیک محتوا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            تقویم محتوایی عملیاتی (۷، ۱۴ یا ۳۰ روزه)
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            نوع کسب‌وکار و صنعت خود را انتخاب کنید تا استودیو تقویم زمان‌بندی‌شده، متنوع و فروش‌محور با تیتر، هوک و هدف مشخص برای هر روز تحویل دهد.
          </p>
        </div>

        {/* Inputs Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">صنعت و حوزه فعالیت</label>
            <select
              value={selectedIndustry}
              onChange={(e) => {
                setSelectedIndustry(e.target.value);
                const ind = BUSINESS_INDUSTRIES.find((b) => b.id === e.target.value);
                if (ind) setAudience(ind.audience);
              }}
              className="w-full bg-[#080d15] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {BUSINESS_INDUSTRIES.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">نام یا موضوع کسب‌وکار</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="مثال: کلینیک لبخند، فروشگاه کفش..."
              className="w-full bg-[#080d15] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">پست در هفته</label>
            <select
              value={postsPerWeek}
              onChange={(e) => setPostsPerWeek(Number(e.target.value))}
              className="w-full bg-[#080d15] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value={3}>۳ پست در هفته</option>
              <option value={4}>۴ پست در هفته</option>
              <option value={5}>۵ پست در هفته</option>
              <option value={7}>انتشار روزانه (۷ روز)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">مدت زمان تقویم</label>
            <select
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value) as any)}
              className="w-full bg-[#080d15] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value={7}>۷ روزه (۱ هفته فشرده)</option>
              <option value={14}>۱۴ روزه (۲ هفته استاندارد)</option>
              <option value={30}>۳۰ روزه (۱ ماه کامل)</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleGenerateCalendar}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 text-xs disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>تولید تقویم محتوایی</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar List & Controls */}
      {calendarItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-[#0c121d]">
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
              <span className="text-slate-400 pl-2">فیلتر پلتفرم:</span>
              {[
                { id: 'all', label: 'همه' },
                { id: 'اینستاگرام', label: 'اینستاگرام' },
                { id: 'لینکدین', label: 'لینکدین' },
                { id: 'وبلاگ', label: 'وبلاگ' },
                { id: 'توییتر', label: 'X (توییتر)' },
                { id: 'ریلز', label: 'ریلز' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatformFilter(p.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    platformFilter === p.id
                      ? 'bg-cyan-600 text-white font-medium'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>دانلود فایل Excel / CSV</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.dayNumber}
                className="p-5 rounded-xl border border-slate-800 bg-[#0c121d] flex flex-col justify-between gap-4 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-cyan-950 text-cyan-400 font-bold text-xs flex items-center justify-center">
                        {item.dayNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">{item.dayName}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-cyan-300 border border-slate-700/80">
                      {item.platform}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">{item.contentType}</span>
                    <h4 className="text-sm font-bold text-white line-clamp-2">{item.title}</h4>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] text-slate-400 font-medium block">قلاب ۳ ثانیه اول (Hook):</span>
                    <p className="line-clamp-2 text-slate-200">{item.hook}</p>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>
                      <span className="text-slate-500">کال تو اکشن: </span>
                      <span className="text-slate-300">{item.cta}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">کلمه کلیدی: </span>
                      <span className="text-cyan-400 font-mono">{item.targetKeyword}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 line-clamp-1 max-w-[170px]" title={item.rationale}>
                    {item.rationale}
                  </span>
                  <button
                    onClick={() => copyDay(item)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-md transition-colors flex items-center gap-1 text-xs"
                    title="کپی جزئیات این روز"
                  >
                    {copiedId === item.dayNumber ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>کپی</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
