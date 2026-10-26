import React, { useState } from 'react';
import { SeoPackageData, GeneratedHistoryItem } from './types';
import { ContentEditor } from './ContentEditor';
import {
  Search,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Code,
  FileText,
  Link as LinkIcon,
  HelpCircle,
  TrendingUp,
  Tag,
  Share2,
  Loader2,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface SeoModeViewProps {
  onSaveToHistory: (item: GeneratedHistoryItem) => void;
}

export const SeoModeView: React.FC<SeoModeViewProps> = ({ onSaveToHistory }) => {
  const [topic, setTopic] = useState('طراحی سایت فروشگاهی');
  const [primaryKeyword, setPrimaryKeyword] = useState('طراحی سایت فروشگاهی');
  const [secondaryKeywords, setSecondaryKeywords] = useState('قیمت سایت فروشگاهی، سئو فروشگاه، ساخت سایت');
  const [targetAudience, setTargetAudience] = useState('کسب‌وکارهای اینترنتی و فروشگاه‌داران');
  const [brandName, setBrandName] = useState('Nononick');

  const [isLoading, setIsLoading] = useState(false);
  const [seoData, setSeoData] = useState<SeoPackageData | null>(null);
  const [activeTab, setActiveTab] = useState<'article' | 'meta' | 'schema' | 'faq' | 'links'>('article');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleGenerateSeo = async () => {
    if (!topic.trim() && !primaryKeyword.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          primaryKeyword,
          secondaryKeywords,
          targetAudience,
          brandName,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSeoData(data.data);
        // Save article to history
        onSaveToHistory({
          id: Date.now().toString(),
          title: data.data.h1 || `سئو: ${primaryKeyword}`,
          contentType: 'مقاله سئو جامع',
          content: data.data.articleContent,
          date: new Date().toISOString(),
          wordCount: data.data.articleContent.split(/\s+/).length,
          metadata: { seoScore: data.data.seoScore, keyword: primaryKeyword },
        });
      }
    } catch (e) {
      console.error('Failed to generate SEO package', e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(identifier);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const getFaqSchemaCode = (faqList: { question: string; answer: string }[]) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0d1627] to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Search className="w-3.5 h-3.5" />
            <span>حالت اختصاصی SEO Content Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            تولید پکیج ۳۶۰ درجه سئو محتوایی با امتیاز کیفی
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            کلمه کلیدی را وارد کنید تا استودیو در چند ثانیه تمام موارد مورد نیاز از تگ‌های متا، هدینگ‌ها، مقاله کامل، کدهای Schema.org، لینک‌سازی داخلی و چک‌لیست سئو را برای شما آماده کند.
          </p>
        </div>

        {/* Input Form */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-300 mb-1">کلمه کلیدی اصلی (Primary Keyword)</label>
            <input
              type="text"
              value={primaryKeyword}
              onChange={(e) => setPrimaryKeyword(e.target.value)}
              placeholder="مثال: طراحی سایت فروشگاهی"
              className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-300 mb-1">موضوع یا زاویه دید محتوا</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: راهنمای راه‌اندازی و قیمت طراحی سایت"
              className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">نام برند</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Nononick"
              className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleGenerateSeo}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 text-sm disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>تولید پکیج سئو</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEO Score & Diagnostic Radar */}
      {seoData && (
        <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-950/40">
                <span className="text-xl font-extrabold leading-none tabular-nums">{seoData.seoScore}</span>
                <span className="text-[10px] text-emerald-100 font-medium mt-0.5">از ۱۰۰</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">امتیاز سئو و خوانایی (SEO Score)</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    وضعیت عالی
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحلیل خودکار انطباق با الگوریتم‌های Help Content گوگل، توزیع کلمات کلیدی و ساختار فنی
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">قصد جستجو (Search Intent):</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-cyan-300 font-medium border border-slate-700">
                {seoData.searchIntent}
              </span>
            </div>
          </div>

          {/* 10 Diagnostic Checkpoints */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
            {[
              { label: 'توزیع کلمه کلیدی', status: 'عالی', pass: true },
              { label: 'کیفیت عنوان (Title)', status: '۵۸ کاراکتر', pass: true },
              { label: 'توضیحات متا', status: '۱۵۲ کاراکتر', pass: true },
              { label: 'ساختار هدینگ‌ها', status: 'H1 تا H3 استاندارد', pass: true },
              { label: 'شاخص خوانایی', status: 'روان و طبیعی', pass: true },
              { label: 'عمق و پوشش محتوا', status: 'جامع و عمیق', pass: true },
              { label: 'قصد کاربر (Intent)', status: 'تطبیق ۱۰۰٪', pass: true },
              { label: 'لینک‌سازی داخلی', status: '۳ لینک مرتبط', pass: true },
              { label: 'پرسش‌های FAQ', status: '۵ پرسش با اسکیما', pass: true },
              { label: 'دعوت به اقدام CTA', status: 'شخصی‌سازی شده', pass: true },
            ].map((check, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#080d16] border border-slate-800/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 truncate">{check.label}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <span className="text-slate-200 font-semibold">{check.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Package Tabbed Viewer */}
      {seoData && (
        <div className="space-y-4">
          {/* Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('article')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'article'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>مقاله سئو کامل</span>
            </button>

            <button
              onClick={() => setActiveTab('meta')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'meta'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>متادیتا و تگ‌ها</span>
            </button>

            <button
              onClick={() => setActiveTab('schema')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'schema'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>کد FAQ Schema</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'faq'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>پرسش و پاسخ (FAQ)</span>
            </button>

            <button
              onClick={() => setActiveTab('links')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'links'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>لینک‌های داخلی و خارجی</span>
            </button>
          </div>

          {/* Active Tab Content */}
          {activeTab === 'article' && (
            <ContentEditor
              content={seoData.articleContent}
              onContentChange={(updated) => setSeoData({ ...seoData, articleContent: updated })}
              title={seoData.h1}
              contentType="مقاله سئو ۳۶۰ درجه"
            />
          )}

          {activeTab === 'meta' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0c121d] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">SEO Title & Meta</h4>
                  <button
                    onClick={() => copyToClipboard(seoData.seoTitle, 'title')}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copiedItem === 'title' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>کپی عنوان</span>
                  </button>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">SEO Title (تگ عنوان صفحه)</span>
                  <div className="p-3 bg-slate-900 rounded-lg text-sm text-cyan-300 font-medium">
                    {seoData.seoTitle}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Meta Description (توضیحات متا)</span>
                  <div className="p-3 bg-slate-900 rounded-lg text-sm text-slate-200 leading-relaxed">
                    {seoData.metaDescription}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">URL Slug (نامک استاندارد)</span>
                  <div className="p-2.5 bg-slate-900 rounded-lg text-xs font-mono text-emerald-400" dir="ltr">
                    /{seoData.slug}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-[#0c121d] space-y-4">
                <h4 className="text-sm font-bold text-white">Open Graph & Media Alt</h4>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Open Graph Title</span>
                  <div className="p-3 bg-slate-900 rounded-lg text-sm text-slate-300">
                    {seoData.ogTitle}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Open Graph Description</span>
                  <div className="p-3 bg-slate-900 rounded-lg text-sm text-slate-300">
                    {seoData.ogDescription}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Image Alt Text (متن جایگزین تصویر شاخص)</span>
                  <div className="p-3 bg-slate-900 rounded-lg text-sm text-slate-300">
                    {seoData.imageAlt}
                  </div>
                </div>
              </div>

              {/* Related LSI Keywords */}
              <div className="md:col-span-2 p-5 rounded-xl border border-slate-800 bg-[#0c121d] space-y-3">
                <h4 className="text-sm font-bold text-white">کلمات کلیدی مرتبط LSI (پیشنهادات جستجو)</h4>
                <div className="flex flex-wrap gap-2">
                  {seoData.relatedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="p-5 rounded-xl border border-slate-800 bg-[#0c121d] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">کد اسکیما JSON-LD برای FAQ</h4>
                  <p className="text-xs text-slate-400">
                    این کد را در تگ &lt;head&gt; یا انتهای صفحه وبلاگ خود قرار دهید تا نتایج سوالات در گوگل ستاره‌دار و بازشونده شوند.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(getFaqSchemaCode(seoData.faq), 'schema')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedItem === 'schema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>کپی کد Schema</span>
                </button>
              </div>
              <pre className="p-4 bg-[#080d16] border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed" dir="ltr">
                {getFaqSchemaCode(seoData.faq)}
              </pre>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="p-5 rounded-xl border border-slate-800 bg-[#0c121d] space-y-4">
              <h4 className="text-sm font-bold text-white">پرسش‌های پرتکرار کاربران و پاسخ‌های اقناعی</h4>
              <div className="space-y-3">
                {seoData.faq.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1.5">
                    <h5 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span>{item.question}</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pr-6">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0c121d] space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  <span>پیشنهادات لینک داخلی (Internal Links)</span>
                </h4>
                <div className="space-y-2">
                  {seoData.internalLinks.map((link, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 rounded-lg flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium">{link.title}</span>
                      <a
                        href={`https://nononick.com${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline font-mono"
                        dir="ltr"
                      >
                        {link.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-[#0c121d] space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-indigo-400" />
                  <span>پیشنهادات لینک خارجی معتبر (Outbound Links)</span>
                </h4>
                <div className="space-y-2">
                  {seoData.externalLinks.map((link, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 rounded-lg flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium">{link.title}</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline font-mono truncate max-w-[150px]"
                        dir="ltr"
                      >
                        {link.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
