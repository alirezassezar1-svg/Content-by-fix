import React, { useState, useRef, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  Printer,
  Share2,
  RefreshCw,
  Sparkles,
  Scissors,
  Maximize2,
  Sliders,
  Globe,
  FileCode,
  FileText,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ContentEditorProps {
  content: string;
  onContentChange: (newContent: string) => void;
  title?: string;
  contentType?: string;
  onRegenerate?: () => void;
  onShare?: () => void;
  isGenerating?: boolean;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onContentChange,
  title = 'خروجی محتوا',
  contentType = 'محتوا',
  onRegenerate,
  onShare,
  isGenerating = false,
}) => {
  const [copiedType, setCopiedType] = useState<'text' | 'md' | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [isRefining, setIsRefining] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [showSelectionPopup, setShowSelectionPopup] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Statistics calculation
  const cleanText = content.trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const chars = cleanText.length;
  const readingTimeMin = Math.max(1, Math.ceil(words / 200));

  const handleCopy = async (type: 'text' | 'md') => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_') || 'nononick_content'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e293b; background: #fff; }
    h1, h2, h3 { color: #0f172a; margin-top: 1.5em; }
    pre { background: #f1f5f9; padding: 12px; border-radius: 6px; overflow-x: auto; }
    blockquote { border-right: 4px solid #0284c7; padding-right: 16px; margin: 16px 0; color: #475569; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div>${renderSimpleMarkdownToHtml(content)}</div>
  <footer style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8;">
    تولید شده توسط Nononick Content Studio - nononick.com
  </footer>
</body>
</html>`;

    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_') || 'nononick_content'}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  // Text selection listener in raw edit mode
  const handleSelect = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    if (start !== end && end - start > 3) {
      const selected = textareaRef.current.value.substring(start, end);
      setSelectedText(selected);
      setSelectionRange({ start, end });
      setShowSelectionPopup(true);
    } else {
      setShowSelectionPopup(false);
    }
  };

  // Trigger Refinement (Improve, Shorten, Expand, Translate, etc.)
  const handleRefine = async (action: 'improve' | 'shorten' | 'expand' | 'tone' | 'translate', toneVal = 'حرفه‌ای', targetLang = 'en', isSelectionOnly = false) => {
    setIsRefining(true);
    setShowSelectionPopup(false);
    const textToProcess = isSelectionOnly && selectedText ? selectedText : content;

    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToProcess,
          action,
          tone: toneVal,
          targetLang,
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        if (isSelectionOnly && selectionRange) {
          const newFull =
            content.substring(0, selectionRange.start) +
            data.result +
            content.substring(selectionRange.end);
          onContentChange(newFull);
        } else {
          onContentChange(data.result);
        }
      }
    } catch (e) {
      console.error('Refine failed', e);
    } finally {
      setIsRefining(false);
      setSelectedText('');
      setSelectionRange(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0c121d] overflow-hidden flex flex-col shadow-xl">
      {/* Editor Header Bar */}
      <div className="px-4 py-3 border-b border-slate-800 bg-[#0f1726] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-cyan-950/70 border border-cyan-800/60 text-cyan-400">
            {contentType}
          </span>
          <h2 className="text-sm font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-md">
            {title}
          </h2>
        </div>

        {/* View Switcher & Action Icons */}
        <div className="flex items-center gap-2">
          {/* Preview / Raw toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              نمایش زیبا
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'raw'
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ویرایش متن
            </button>
          </div>

          <button
            onClick={() => handleCopy('text')}
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-md transition-colors text-xs flex items-center gap-1"
            title="کپی متن"
          >
            {copiedType === 'text' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">کپی</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="دانلود فایل TXT"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownloadHtml}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="دانلود فایل HTML"
          >
            <FileCode className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="چاپ و پرینت"
          >
            <Printer className="w-4 h-4" />
          </button>

          {onShare && (
            <button
              onClick={onShare}
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-md transition-colors"
              title="اشتراک‌گذاری"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isGenerating || isRefining}
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50"
              title="تولید مجدد محتوا"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Refinement Toolbar */}
      <div className="px-4 py-2 border-b border-slate-800/60 bg-[#090e17] flex items-center gap-2 overflow-x-auto text-xs text-slate-400 scrollbar-none">
        <span className="text-slate-500 whitespace-nowrap pl-1">اصلاح هوشمند:</span>

        <button
          onClick={() => handleRefine('improve')}
          disabled={isRefining}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>بهبود کیفیت</span>
        </button>

        <button
          onClick={() => handleRefine('shorten')}
          disabled={isRefining}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
        >
          <Scissors className="w-3.5 h-3.5 text-amber-400" />
          <span>خلاصه‌تر</span>
        </button>

        <button
          onClick={() => handleRefine('expand')}
          disabled={isRefining}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
        >
          <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
          <span>بسط و گسترش</span>
        </button>

        <button
          onClick={() => handleRefine('tone', 'رسمی')}
          disabled={isRefining}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>لحن رسمی</span>
        </button>

        <button
          onClick={() => handleRefine('tone', 'صمیمی')}
          disabled={isRefining}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
        >
          <Sliders className="w-3.5 h-3.5 text-pink-400" />
          <span>لحن صمیمی</span>
        </button>

        <button
          onClick={() => handleRefine('translate', 'حرفه‌ای', 'en')}
          disabled={isRefining}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>ترجمه به انگلیسی</span>
        </button>

        {isRefining && (
          <span className="flex items-center gap-1 text-cyan-400 animate-pulse text-xs pr-2">
            <RefreshCw className="w-3 h-3 animate-spin" />
            در حال اصلاح متن...
          </span>
        )}
      </div>

      {/* Selection Popup Alert */}
      {showSelectionPopup && (
        <div className="mx-4 mt-2 p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-between text-xs text-cyan-200">
          <div className="flex items-center gap-2 truncate max-w-xs sm:max-w-md">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">بخش انتخاب شده: «{selectedText}»</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleRefine('improve', 'حرفه‌ای', 'en', true)}
              className="px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
            >
              بازنویسی این بخش
            </button>
            <button
              onClick={() => handleRefine('shorten', 'حرفه‌ای', 'en', true)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              خلاصه کردن
            </button>
            <button
              onClick={() => setShowSelectionPopup(false)}
              className="px-2 py-1 text-slate-400 hover:text-white"
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div ref={containerRef} className="p-4 sm:p-6 min-h-[380px] max-h-[650px] overflow-y-auto">
        {viewMode === 'preview' ? (
          <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed space-y-4 font-sans select-text">
            {renderFormattedMarkdown(content)}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            onSelect={handleSelect}
            className="w-full h-full min-h-[350px] bg-transparent text-slate-200 font-sans text-sm sm:text-base leading-relaxed focus:outline-none resize-none"
            placeholder="محتوا در این قسمت نمایش داده می‌شود..."
            dir="auto"
          />
        )}
      </div>

      {/* Editor Footer Metric Bar */}
      <div className="px-4 py-2.5 border-t border-slate-800/80 bg-[#090e17] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-500" />
            <strong className="text-slate-200 font-medium tabular-nums">{words}</strong> کلمه
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <strong className="text-slate-200 font-medium tabular-nums">{chars}</strong> کاراکتر
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            حدود <strong className="text-slate-200 font-medium tabular-nums">{readingTimeMin}</strong> دقیقه مطالعه
          </span>
        </div>

        <div className="text-slate-500 hidden sm:block">
          برای بازنویسی سریع بخش خاصی از متن، به حالت «ویرایش متن» بروید و متن را انتخاب کنید.
        </div>
      </div>
    </div>
  );
};

// Simple clean markdown parser for rendering formatted preview
function renderFormattedMarkdown(text: string) {
  if (!text) return <p className="text-slate-500 italic">متنی برای نمایش وجود ندارد.</p>;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-2xl sm:text-3xl font-extrabold text-white mt-6 mb-3 border-b border-slate-800 pb-2">
          {trimmed.replace('# ', '')}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-xl sm:text-2xl font-bold text-cyan-300 mt-5 mb-2">
          {trimmed.replace('## ', '')}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-lg font-semibold text-indigo-300 mt-4 mb-1">
          {trimmed.replace('### ', '')}
        </h3>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={index} className="list-disc list-inside text-slate-300 my-1 pr-2">
          {parseBoldAndItalic(trimmed.substring(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <div key={index} className="text-slate-300 my-1 pr-2 font-medium">
          {parseBoldAndItalic(trimmed)}
        </div>
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-r-4 border-cyan-500 pr-4 my-3 text-slate-400 italic bg-slate-900/40 p-2 rounded-l">
          {trimmed.replace('> ', '')}
        </blockquote>
      );
    } else if (trimmed === '---') {
      elements.push(<hr key={index} className="border-slate-800 my-4" />);
    } else if (trimmed === '') {
      elements.push(<div key={index} className="h-2" />);
    } else {
      elements.push(
        <p key={index} className="text-slate-300 leading-relaxed text-sm sm:text-base my-2">
          {parseBoldAndItalic(trimmed)}
        </p>
      );
    }
  });

  return elements;
}

function parseBoldAndItalic(str: string): React.ReactNode {
  // Simple bold pattern: **text**
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderSimpleMarkdownToHtml(text: string): string {
  return text
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\n$/gim, '<br />');
}
