import React, { useState } from 'react';
import { RepurposeData, GeneratedHistoryItem } from './types';
import {
  Repeat,
  Sparkles,
  Instagram,
  Linkedin,
  Twitter,
  Film,
  Youtube,
  Zap,
  Heading,
  MousePointer,
  Mail,
  Copy,
  Check,
  Loader2,
  FileText,
} from 'lucide-react';

interface RepurposeViewProps {
  onSaveToHistory: (item: GeneratedHistoryItem) => void;
}

export const RepurposeView: React.FC<RepurposeViewProps> = ({ onSaveToHistory }) => {
  const [sourceText, setSourceText] = useState(
    `در سال ۲۰۲۶ تسلط بر استراتژی چندکاناله و تولید محتوای یکپارچه، برگ برنده هر کسب‌وکاری است. به جای نوشتن روزانه ده مطلب مختلف و خستگی تیم، راهکار هوشمند این است که یک محتوای عمیق و ارزشمند (Pillar Content) تولید کنید و سپس آن را به چندین قطعه مناسب برای اینستاگرام، لینکدین، توییتر، ریلز و خبرنامه ایمیلی تبدیل کنید. این کار زمان شما را ۸۰٪ آزاد می‌کند و نرخ تعامل را تا ۳ برابر ارتقا می‌دهد.`
  );
  const [topic, setTopic] = useState('استراتژی بازآفرینی محتوا');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<RepurposeData | null>(null);
  const [activeTab, setActiveTab] = useState<
    'instagram' | 'linkedin' | 'x' | 'reels' | 'youtube' | 'hooks' | 'headlines' | 'ctas' | 'newsletter'
  >('instagram');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleRepurpose = async () => {
    if (!sourceText.trim() || sourceText.length < 20) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText, topic }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
        onSaveToHistory({
          id: Date.now().toString(),
          title: `بازآفرینی: ${topic}`,
          contentType: 'یک محتوا، چندین محتوا',
          content: `پکیج بازآفرینی کامل شامل ۵ کپشن، ۳ پست لینکدین، ۵ توییت، سناریوی ریلز، سناریوی یوتیوب، ۱۰ هوک و خبرنامه برای موضوع: ${topic}`,
          date: new Date().toISOString(),
          wordCount: 450,
        });
      }
    } catch (e) {
      console.error('Repurpose error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyItem = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Visual Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0c121e] p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
            <Repeat className="w-4 h-4 text-indigo-400" />
            <span>معماری چندکاناله محتوا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            یک محتوا، چندین محتوا؛ بازآفرینی در ۹ کانال با یک کلیک
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            یک متن یا مقاله وارد کنید. استودیو آن را بدون افت کیفیت به ۵ کپشن اینستاگرام، ۳ پست لینکدین، ۵ توییت X، سناریوی کامل ریلز و یوتیوب، ۱۰ هوک انفجاری، ۱۰ عنوان، ۵ کال تو اکشن و یک خبرنامه ایمیلی تبدیل می‌کند.
          </p>
        </div>

        {/* Input Box */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              متن مقاله یا محتوای منبع خود را وارد کنید:
            </label>
            <textarea
              rows={5}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="متن مقاله، پیش‌نویس، یا یادداشت‌های خود را اینجا پیست کنید..."
              className="w-full bg-[#080d15] border border-slate-700/80 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
              dir="auto"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-72">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="موضوع محوری محتوا"
                className="w-full bg-[#080d15] border border-slate-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleRepurpose}
              disabled={isLoading || !sourceText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-cyan-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-950 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال بازآفرینی محتوا...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تبدیل به ۹ پلتفرم</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Output Stream Navigation */}
      {data && (
        <div className="space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs scrollbar-none">
            <button
              onClick={() => setActiveTab('instagram')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'instagram' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>۵ کپشن اینستاگرام</span>
            </button>

            <button
              onClick={() => setActiveTab('linkedin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'linkedin' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>۳ پست لینکدین</span>
            </button>

            <button
              onClick={() => setActiveTab('x')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'x' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>۵ توییت X</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'reels' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>سناریوی Reels</span>
            </button>

            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'youtube' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>سناریوی YouTube</span>
            </button>

            <button
              onClick={() => setActiveTab('hooks')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'hooks' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>۱۰ قلاب (Hook)</span>
            </button>

            <button
              onClick={() => setActiveTab('headlines')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'headlines' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Heading className="w-3.5 h-3.5" />
              <span>۱۰ عنوان</span>
            </button>

            <button
              onClick={() => setActiveTab('ctas')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'ctas' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span>۵ دکمه اقدام CTA</span>
            </button>

            <button
              onClick={() => setActiveTab('newsletter')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'newsletter' ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>خبرنامه ایمیلی</span>
            </button>
          </div>

          {/* Tab 1: Instagram Captions */}
          {activeTab === 'instagram' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.instagramCaptions.map((caption, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-800 bg-[#0c121d] flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-pink-400 block mb-2">کپشن شماره {i + 1}</span>
                    <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                      {caption}
                    </p>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-slate-800">
                    <button
                      onClick={() => copyItem(caption, `ig-${i}`)}
                      className="text-xs text-slate-400 hover:text-pink-400 flex items-center gap-1"
                    >
                      {copiedIndex === `ig-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>کپی کپشن</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: LinkedIn Posts */}
          {activeTab === 'linkedin' && (
            <div className="space-y-4">
              {data.linkedinPosts.map((post, i) => (
                <div key={i} className="p-5 rounded-xl border border-slate-800 bg-[#0c121d] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-400">پست لینکدین شماره {i + 1}</span>
                    <button
                      onClick={() => copyItem(post, `li-${i}`)}
                      className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1"
                    >
                      {copiedIndex === `li-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>کپی پست</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                    {post}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: X Posts */}
          {activeTab === 'x' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.xPosts.map((tweet, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-800 bg-[#0c121d] flex flex-col justify-between gap-3">
                  <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                    {tweet}
                  </p>
                  <div className="flex justify-end pt-2 border-t border-slate-800">
                    <button
                      onClick={() => copyItem(tweet, `x-${i}`)}
                      className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                    >
                      {copiedIndex === `x-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>کپی توییت</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Reels Script */}
          {activeTab === 'reels' && (
            <div className="p-6 rounded-xl border border-slate-800 bg-[#0c121d] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{data.reelsScript.title}</h4>
                  <span className="text-xs text-purple-400 font-medium">مدت زمان تخمینی: {data.reelsScript.duration}</span>
                </div>
                <button
                  onClick={() =>
                    copyItem(
                      `${data.reelsScript.title}\n\nهوک اول:\n${data.reelsScript.hook}\n\nسناریو:\n${data.reelsScript.body}\n\nکپشن:\n${data.reelsScript.captionText}`,
                      'reels'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  {copiedIndex === 'reels' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>کپی سناریوی ریلز</span>
                </button>
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-lg">
                <span className="text-xs text-purple-300 font-bold block mb-1">هوک ۳ ثانیه اول (جلوگیری از اسکرول):</span>
                <p className="text-xs sm:text-sm text-white font-medium">{data.reelsScript.hook}</p>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg space-y-2">
                <span className="text-xs text-slate-400 font-bold block">متن و سناریوی اجرایی:</span>
                <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                  {data.reelsScript.body}
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg">
                <span className="text-xs text-slate-400 font-bold block mb-1">کپشن پیشنهادی:</span>
                <p className="text-xs text-slate-300">{data.reelsScript.captionText}</p>
              </div>
            </div>
          )}

          {/* Tab 5: YouTube Script */}
          {activeTab === 'youtube' && (
            <div className="p-6 rounded-xl border border-slate-800 bg-[#0c121d] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white">{data.youtubeScript.title}</h4>
                <button
                  onClick={() =>
                    copyItem(
                      `${data.youtubeScript.title}\n\nقلاب ثانیه‌های اول:\n${data.youtubeScript.hookSeconds}\n\nسرفصل‌ها:\n${data.youtubeScript.outline.join('\n')}\n\nدیسکریپشن:\n${data.youtubeScript.description}`,
                      'yt'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  {copiedIndex === 'yt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>کپی سناریو</span>
                </button>
              </div>

              <div className="p-3 bg-red-950/30 border border-red-800/60 rounded-lg text-xs sm:text-sm">
                <span className="text-xs text-red-300 font-bold block mb-1">اینترو و هوک اول ویدیو:</span>
                <p className="text-slate-200">{data.youtubeScript.hookSeconds}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-bold block">بخش‌بندی ویدیو (Video Chapters):</span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300 pr-4 list-disc">
                  {data.youtubeScript.outline.map((sec, i) => (
                    <li key={i}>{sec}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg text-xs">
                <span className="text-slate-400 font-bold block mb-1">توضیحات و دیسکریپشن ویدیو:</span>
                <p className="text-slate-300">{data.youtubeScript.description}</p>
              </div>
            </div>
          )}

          {/* Tab 6: Hooks */}
          {activeTab === 'hooks' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.hooks.map((hook, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-800 bg-[#0c121d] flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-slate-200">{hook}</span>
                  </div>
                  <button
                    onClick={() => copyItem(hook, `hook-${i}`)}
                    className="text-slate-400 hover:text-amber-400 shrink-0 p-1"
                  >
                    {copiedIndex === `hook-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 7: Headlines */}
          {activeTab === 'headlines' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.headlines.map((hl, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-800 bg-[#0c121d] flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-slate-200 font-medium">{hl}</span>
                  </div>
                  <button
                    onClick={() => copyItem(hl, `hl-${i}`)}
                    className="text-slate-400 hover:text-cyan-400 shrink-0 p-1"
                  >
                    {copiedIndex === `hl-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 8: CTAs */}
          {activeTab === 'ctas' && (
            <div className="space-y-3">
              {data.ctas.map((ctaItem, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-800 bg-[#0c121d] flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <MousePointer className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-200 font-medium">{ctaItem}</span>
                  </div>
                  <button
                    onClick={() => copyItem(ctaItem, `cta-${i}`)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 shrink-0 flex items-center gap-1"
                  >
                    {copiedIndex === `cta-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>کپی</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 9: Newsletter */}
          {activeTab === 'newsletter' && (
            <div className="p-6 rounded-xl border border-slate-800 bg-[#0c121d] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{data.newsletter.subject}</h4>
                  <span className="text-xs text-violet-400">پیش‌نمایش اینباکس: {data.newsletter.previewText}</span>
                </div>
                <button
                  onClick={() =>
                    copyItem(
                      `موضوع: ${data.newsletter.subject}\n\n${data.newsletter.bodyMarkdown}\n\n[دکمه: ${data.newsletter.buttonCta}]`,
                      'nl'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  {copiedIndex === 'nl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>کپی خبرنامه</span>
                </button>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                {data.newsletter.bodyMarkdown}
              </div>

              <div className="pt-2">
                <span className="px-4 py-2 rounded-lg bg-cyan-600 text-white text-xs font-semibold inline-block">
                  {data.newsletter.buttonCta}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
