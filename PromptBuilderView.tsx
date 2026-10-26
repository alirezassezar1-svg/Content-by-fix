import React, { useState } from 'react';
import { Sparkles, Copy, Check, Terminal, Play, ArrowRight } from 'lucide-react';
import { TONE_OPTIONS } from './contentTypes';

interface PromptBuilderViewProps {
  onExecutePromptInStudio: (promptText: string) => void;
}

export const PromptBuilderView: React.FC<PromptBuilderViewProps> = ({ onExecutePromptInStudio }) => {
  const [role, setRole] = useState('متخصص ارشد سئو و کپی‌رایتر حرفه‌ای با ۱۰ سال سابقه');
  const [goal, setGoal] = useState('یک برنامه محتوایی ۳۰ روزه هدفمند برای افزایش ترافیک ارگانیک و جذب مشتری بساز');
  const [context, setContext] = useState('برای فروشگاه آنلاین پوشاک و اکسسوری زنانه مدرن با ارسال فوری و تضمین کیفیت');
  const [audience, setAudience] = useState('بانوان جوان ۲۰ تا ۳۵ سال علاقه‌مند به استایل مینیمال');
  const [tone, setTone] = useState('صمیمی، اعتمادساز و ترغیب‌کننده');
  const [format, setFormat] = useState('جدول زمان‌بندی شده به همراه متن کامل برای هر پست و هشتگ‌های اختصاصی');
  const [constraints, setConstraints] = useState('از عبارات کلیشه‌ای مانند «با ما همراه باشید» استفاده نکن، برای هر پست یک قلاب ۳ ثانیه‌ای غیرتکراری بنویس و روی مزیت رقابتی تمرکز کن.');

  const [copied, setCopied] = useState(false);

  const fullConstructedPrompt = `نقش:
تو ${role} هستی.

هدف پروژه:
${goal}

زمینه و اطلاعات کسب‌وکار:
${context}

مخاطب هدف:
${audience}

لحن نگارش:
${tone}

قالب خروجی مورد انتظار:
${format}

محدودیت‌ها و خط قرمزها:
${constraints}

لطفاً خروجی را با بالاترین کیفیت، به زبان فارسی روان و کاملاً ساختاریافته تحویل بده.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullConstructedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#101b2f] to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>مهندسی پرامپت تخصصی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Prompt Builder؛ ساخت پرامپت‌های مهندسی‌شده و بی‌نقص
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            به جای درخواست‌های مبهم، با استانداردسازی نقش (Role)، هدف (Goal)، زمینه (Context)، مخاطب، لحن و محدودیت‌ها پرامپت‌هایی بسازید که خروجی مدل‌های هوش مصنوعی را تا ۱۰ برابر دقیق‌تر کنند.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs: 6 cols */}
        <div className="lg:col-span-6 space-y-4 rounded-xl border border-slate-800 bg-[#0c121d] p-5">
          <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
            مؤلفه‌های تشکیل‌دهنده پرامپت حرفه‌ای
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-300 font-medium mb-1">نقش هوش مصنوعی (Role)</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#080d15] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">هدف اصلی (Goal)</label>
              <textarea
                rows={2}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#080d15] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">زمینه و اطلاعات تکمیلی (Context)</label>
              <textarea
                rows={2}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full bg-[#080d15] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">مخاطب هدف (Audience)</label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-[#080d15] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">لحن مطلوب (Tone)</label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-[#080d15] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">قالب خروجی (Output Format)</label>
              <input
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#080d15] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">محدودیت‌ها و قوانین (Constraints)</label>
              <textarea
                rows={2}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full bg-[#080d15] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Right Preview & Action: 6 cols */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400">پیش‌نمایش پرامپت نهایی (Ready to Copy)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'کپی شد!' : 'کپی پرامپت (COPY PROMPT)'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-[#080d16] border border-slate-800 rounded-lg text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto" dir="rtl">
              {fullConstructedPrompt}
            </pre>

            <div className="pt-2">
              <button
                onClick={() => onExecutePromptInStudio(fullConstructedPrompt)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>اجرای مستقیم این پرامپت در استودیوی محتوا</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
