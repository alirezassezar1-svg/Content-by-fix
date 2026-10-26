import React, { useState } from 'react';
import {
  Lightbulb,
  ListTree,
  FileEdit,
  Search,
  CheckSquare,
  Share2,
  Send,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Loader2,
} from 'lucide-react';
import { ContentEditor } from './ContentEditor';

export const WorkflowView: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [ideaTopic, setIdeaTopic] = useState('راهنمای راه‌اندازی کسب‌وکار آنلاین در سال ۲۰۲۶');
  const [targetAudience, setTargetAudience] = useState('افراد جویای کار و علاقه‌مندان به تجارت الکترونیک');
  const [keywords, setKeywords] = useState('کسب و کار اینترنتی, فروش آنلاین, طراحی سایت');

  // Workflow Stages Data
  const [outlineContent, setOutlineContent] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [seoPackageContent, setSeoPackageContent] = useState('');
  const [socialContent, setSocialContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 1, name: 'IDEA', label: 'ایده‌پردازی', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 2, name: 'OUTLINE', label: 'ساختار و سرفصل‌ها', icon: <ListTree className="w-4 h-4" /> },
    { id: 3, name: 'DRAFT', label: 'پیش‌نویس جامع', icon: <FileEdit className="w-4 h-4" /> },
    { id: 4, name: 'SEO', label: 'بهینه‌سازی سئو', icon: <Search className="w-4 h-4" /> },
    { id: 5, name: 'EDIT', label: 'ویرایش نهایی', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 6, name: 'SOCIAL', label: 'بسته‌های شبکه‌های اجتماعی', icon: <Share2 className="w-4 h-4" /> },
    { id: 7, name: 'PUBLISH', label: 'انتشار و چک‌لیست', icon: <Send className="w-4 h-4" /> },
  ];

  const handleGenerateOutline = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'مقاله وبلاگ',
          topic: ideaTopic,
          customPrompt: `لطفاً سرفصل‌های ساختاریافته (Outline) کامل برای موضوع "${ideaTopic}" شامل مقدمه، ۴ تیتر اصلی H2، زیرتیترهای H3 و جمع‌بندی تهیه کن.`,
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setOutlineContent(data.content);
        setCurrentStep(2);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateDraft = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'مقاله وبلاگ',
          topic: ideaTopic,
          initialText: outlineContent,
          customPrompt: `بر اساس سرفصل‌های زیر یک مقاله کامل، آموزنده و جذاب با بیش از ۱۰۰۰ کلمه بنویس:\n${outlineContent}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setDraftContent(data.content);
        setCurrentStep(3);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateSeo = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: ideaTopic,
          primaryKeyword: keywords.split(',')[0] || ideaTopic,
          targetAudience,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSeoPackageContent(
          `## تحلیل سئو برای: ${ideaTopic}\n\n- **عنوان سئو:** ${data.data.seoTitle}\n- **توضیحات متا:** ${data.data.metaDescription}\n- **نامک:** /${data.data.slug}\n- **قصد جستجو:** ${data.data.searchIntent}\n- **امتیاز تخمینی سئو:** ${data.data.seoScore}/100\n\n### سوالات متداول (FAQ):\n${data.data.faq.map((f: any) => `**${f.question}**\n${f.answer}\n`).join('\n')}`
        );
        setCurrentStep(4);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateSocial = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText: draftContent || ideaTopic,
          topic: ideaTopic,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSocialContent(
          `# کمپین انتشار در شبکه‌های اجتماعی برای: ${ideaTopic}\n\n### ۱. کپشن برتر اینستاگرام:\n${data.data.instagramCaptions[0]}\n\n### ۲. پست لینکدین:\n${data.data.linkedinPosts[0]}\n\n### ۳. رشته توییت X:\n${data.data.xPosts.slice(0, 3).join('\n\n')}\n\n### ۴. سناریوی ریلز:\n${data.data.reelsScript.hook}\n${data.data.reelsScript.body}`
        );
        setCurrentStep(6);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>چرخه استاندارد ۷ مرحله‌ای تولید محتوا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Content Workflow Pipeline
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            از یک ایده خام تا انتشار سراسری در وب و شبکه‌های اجتماعی؛ گام به گام ساختاربندی کنید، سئو کنید و پست‌های شبکه اجتماعی استخراج نمایید.
          </p>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="p-4 rounded-xl border border-slate-800 bg-[#0c121d] overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                      : isCompleted
                      ? 'bg-slate-800/80 text-emerald-400 border border-emerald-900/60'
                      : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-black/20">
                    {isCompleted ? <Check className="w-3 h-3" /> : step.id}
                  </div>
                  <span>{step.name}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      currentStep > step.id ? 'bg-cyan-600' : 'bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Workspace Content */}
      <div className="p-6 rounded-xl border border-slate-800 bg-[#0c121d] space-y-6">
        {/* Step 1: IDEA */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>گام ۱: تعریف ایده و مخاطب هدف</span>
            </h3>
            <p className="text-xs text-slate-400">
              موضوع اصلی مقاله یا محتوایی که در ذهن دارید را همراه با مخاطبان هدف مشخص کنید.
            </p>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-medium mb-1">موضوع اصلی محتوا</label>
                <input
                  type="text"
                  value={ideaTopic}
                  onChange={(e) => setIdeaTopic(e.target.value)}
                  className="w-full bg-[#080d15] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">مخاطب هدف</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-[#080d15] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">کلمات کلیدی محوری (با ویرگول)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full bg-[#080d15] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleGenerateOutline}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>تولید سرفصل‌ها و حرکت به گام بعدی (Outline)</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: OUTLINE */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ListTree className="w-5 h-5 text-cyan-400" />
                <span>گام ۲: تایید و ویرایش ساختار محتوا (Outline)</span>
              </h3>
              <button
                onClick={handleGenerateDraft}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>نگارش متن کامل مقاله بر اساس این ساختار</span>
              </button>
            </div>

            <ContentEditor
              content={outlineContent || 'سرفصل‌ها در حال بارگذاری است...'}
              onContentChange={(val) => setOutlineContent(val)}
              title="سرفصل‌های مقاله"
              contentType="Outline"
            />
          </div>
        )}

        {/* Step 3: DRAFT */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-indigo-400" />
                <span>گام ۳: پیش‌نویس کامل محتوا (Draft)</span>
              </h3>
              <button
                onClick={handleGenerateSeo}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>بهینه‌سازی سئو این مقاله (گام ۴)</span>
              </button>
            </div>

            <ContentEditor
              content={draftContent || 'پیش‌نویس مقاله...'}
              onContentChange={(val) => setDraftContent(val)}
              title={ideaTopic}
              contentType="Draft"
            />
          </div>
        )}

        {/* Step 4: SEO */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-400" />
                <span>گام ۴: سئو تکنیکال و متادیتا (SEO)</span>
              </h3>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                تایید سئو و رفتن به ویرایش نهایی (گام ۵)
              </button>
            </div>

            <ContentEditor
              content={seoPackageContent || 'پکیج سئو...'}
              onContentChange={(val) => setSeoPackageContent(val)}
              title={`سئو: ${ideaTopic}`}
              contentType="SEO Meta"
            />
          </div>
        )}

        {/* Step 5: EDIT */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-sky-400" />
                <span>گام ۵: ویرایش نهایی و پالایش متن (Edit)</span>
              </h3>
              <button
                onClick={handleGenerateSocial}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                <span>تولید پست‌های سوشال مدیا از این مقاله (گام ۶)</span>
              </button>
            </div>

            <ContentEditor
              content={draftContent}
              onContentChange={(val) => setDraftContent(val)}
              title={ideaTopic}
              contentType="Final Article"
            />
          </div>
        )}

        {/* Step 6: SOCIAL */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-pink-400" />
                <span>گام ۶: دارایی‌های شبکه‌های اجتماعی (Social Repurposing)</span>
              </h3>
              <button
                onClick={() => setCurrentStep(7)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                مشاهده چک‌لیست انتشار (گام ۷)
              </button>
            </div>

            <ContentEditor
              content={socialContent}
              onContentChange={(val) => setSocialContent(val)}
              title={`سوشال مدیا: ${ideaTopic}`}
              contentType="Social Campaign"
            />
          </div>
        )}

        {/* Step 7: PUBLISH */}
        {currentStep === 7 && (
          <div className="max-w-2xl mx-auto space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">تبریک! محتوای شما آماده انتشار است</h3>
              <p className="text-xs text-slate-400">
                چک‌لیست زیر را پیش از زدن دکمه انتشار نهایی بررسی کنید:
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs sm:text-sm">
              {[
                'تگ Title و Meta Description در افزونه سئو وارد شد.',
                'کد اسکیما FAQ در صفحه وب قرار گرفت.',
                'تصویر شاخص دارای Alt Text مرتبط بارگذاری شد.',
                'لینک‌های داخلی به خدمات Nononick تعبیه شد.',
                'پست اینستاگرام و ریلز برای روز انتشار زمان‌بندی شد.',
                'پست لینکدین و رشته توییت در تقویم محتوایی ثبت شد.',
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 text-slate-300 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500" />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                شروع پروژه جدید
              </button>
              <a
                href="https://nononick.com/services.php"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
              >
                ساخت سایت برای انتشار با Nononick
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
