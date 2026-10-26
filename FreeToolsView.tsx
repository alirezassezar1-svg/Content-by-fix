import React, { useState } from 'react';
import { FREE_TOOLS_DATA } from './freeToolsData';
import { FreeToolInfo } from './types';
import {
  Wrench,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface FreeToolsViewProps {
  onExecuteToolOutputInEditor?: (text: string) => void;
}

export const FreeToolsView: React.FC<FreeToolsViewProps> = ({ onExecuteToolOutputInEditor }) => {
  const [selectedTool, setSelectedTool] = useState<FreeToolInfo>(FREE_TOOLS_DATA[0]);
  const [inputText, setInputText] = useState('');
  const [outputResult, setOutputResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Word counter stats calculation
  const wordsCount = inputText.trim() ? inputText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charsWithSpaces = inputText.length;
  const charsNoSpaces = inputText.replace(/\s+/g, '').length;
  const paragraphs = inputText.trim() ? inputText.split(/\n+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordsCount / 200));

  const handleToolRun = async () => {
    if (!inputText.trim()) return;

    if (selectedTool.inputType === 'counter') {
      return; // Counter is live
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedTool.name,
          topic: inputText,
          customPrompt: `به عنوان ابزار تخصصی "${selectedTool.name}"، برای ورودی زیر بهترین خروجی را تولید کن:\n"""${inputText}"""\nفقط خروجی نهایی ساختاریافته را به فارسی بازگردان.`,
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setOutputResult(data.content);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0c1626] to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Wrench className="w-3.5 h-3.5" />
            <span>کتابخانه ابزارهای رایگان سئو و محتوا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            مجموعه ابزارهای آنلاین، مستقل و بهینه‌شده برای سئو
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            از شمارنده کلمات و تولیدکننده هشتگ تا سازنده اسلاگ و متای توضیحات سئو؛ هر ابزار به طور مستقل با ساختار سئو، FAQ و راهنمای کامل برای شما آماده شده است.
          </p>
        </div>

        {/* Quick Tools Selector Buttons */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {FREE_TOOLS_DATA.map((tool) => (
            <button
              key={tool.slug}
              onClick={() => {
                setSelectedTool(tool);
                setOutputResult('');
                setInputText('');
              }}
              className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors border ${
                selectedTool.slug === tool.slug
                  ? 'bg-cyan-600 text-white font-bold border-cyan-500 shadow-md shadow-cyan-950'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              {tool.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dedicated Tool Page Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tool Form & Live Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c121d] space-y-5 shadow-xl">
            {/* SEO H1 Header for tool page */}
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1" dir="ltr">
                <span>/tools/{selectedTool.slug}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {selectedTool.h1}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                {selectedTool.description}
              </p>
            </div>

            {/* Input Box */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                ورودی ابزار:
              </label>

              {selectedTool.inputType === 'counter' ? (
                <textarea
                  rows={6}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={selectedTool.inputPlaceholder}
                  className="w-full bg-[#080d15] border border-slate-700/80 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  dir="auto"
                />
              ) : selectedTool.inputType === 'textarea' ? (
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={selectedTool.inputPlaceholder}
                  className="w-full bg-[#080d15] border border-slate-700/80 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  dir="auto"
                />
              ) : (
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={selectedTool.inputPlaceholder}
                  className="w-full bg-[#080d15] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  dir="auto"
                />
              )}

              {/* Counter Live Statistics Display */}
              {selectedTool.inputType === 'counter' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
                    <span className="text-[11px] text-slate-400 block">تعداد کلمات</span>
                    <strong className="text-xl font-bold text-cyan-400 tabular-nums">{wordsCount}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
                    <span className="text-[11px] text-slate-400 block">حروف با فاصله</span>
                    <strong className="text-xl font-bold text-slate-200 tabular-nums">{charsWithSpaces}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
                    <span className="text-[11px] text-slate-400 block">حروف بدون فاصله</span>
                    <strong className="text-xl font-bold text-slate-200 tabular-nums">{charsNoSpaces}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
                    <span className="text-[11px] text-slate-400 block">زمان مطالعه</span>
                    <strong className="text-xl font-bold text-indigo-400 tabular-nums">{readingTime} دقیقه</strong>
                  </div>
                </div>
              )}

              {selectedTool.inputType !== 'counter' && (
                <button
                  onClick={handleToolRun}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-cyan-950 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>پردازش و اجرای ابزار ({selectedTool.name})</span>
                </button>
              )}
            </div>

            {/* Tool Output Display */}
            {outputResult && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">نتیجه خروجی:</span>
                  <button
                    onClick={copyOutput}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'کپی شد!' : 'کپی خروجی'}</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                  {outputResult}
                </div>
              </div>
            )}
          </div>

          {/* How to use & benefits */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c121d] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>راهنمای گام‌به‌گام نحوه استفاده (How to Use)</span>
            </h3>
            <ol className="space-y-2 text-xs sm:text-sm text-slate-300 pr-5 list-decimal">
              {selectedTool.howToUse.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Column: SEO Metadata, Benefits, FAQ, Nononick CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Benefits Box */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c121d] space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>مزایای کلیدی این ابزار</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedTool.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Real Examples */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c121d] space-y-3">
            <h4 className="text-sm font-bold text-white">نمونه‌های کاربردی واقعی</h4>
            <div className="space-y-2 text-xs text-slate-300">
              {selectedTool.examples.map((ex, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  {ex}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ with structured schema representation */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c121d] space-y-3">
            <h4 className="text-sm font-bold text-white">پرسش‌های متداول (FAQ)</h4>
            <div className="space-y-3 text-xs">
              {selectedTool.faq.map((item, i) => (
                <div key={i} className="p-3 bg-slate-900 rounded-lg space-y-1">
                  <strong className="text-cyan-300 block">{item.q}</strong>
                  <p className="text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nononick CTA Promo Card */}
          <div className="p-5 rounded-2xl border border-cyan-800/50 bg-gradient-to-b from-cyan-950/40 to-slate-900 space-y-3">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>طراحی وب‌سایت با استانداردهای گوگل</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              می‌خواهید رتبه ۱ سرچ این کلمات در دستان شما باشد؟
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              تیم تخصصی طراحی سایت و سئو Nononick آماده است تا وب‌سایت شما را با جدیدترین فناوری‌ها و بهینه‌سازی کامل راه‌اندازی کند.
            </p>
            <div className="pt-2">
              <a
                href="https://nononick.com/services.php"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-950"
              >
                <span>مشاهده خدمات طراحی سایت Nononick</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
