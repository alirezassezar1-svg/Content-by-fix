import React, { useState } from 'react';
import { Share2, Copy, Check, X, Twitter, Send, Globe, CheckCircle2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, content }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareId = Math.random().toString(36).substring(2, 9);
  const shareUrl = `${window.location.origin}/result/${shareId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`محتوای تولیدشده در استودیوی Nononick:\n\n${title}\n${shareUrl}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`محتوای تولیدشده با Nononick Content Studio:\n${title}\n${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c121e] p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">اشتراک‌گذاری خروجی محتوا</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <span className="text-xs text-slate-400 block mb-1">عنوان محتوا:</span>
          <p className="text-sm font-semibold text-white truncate">{title}</p>
        </div>

        <div>
          <span className="text-xs text-slate-400 block mb-1.5">لینک یکتا جهت اشتراک‌گذاری (Public URL):</span>
          <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-700 rounded-xl">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent px-2 text-xs font-mono text-cyan-300 focus:outline-none"
              dir="ltr"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کپی شد' : 'کپی لینک'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <span className="text-xs text-slate-400 block">ارسال مستقیم به:</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShareTelegram}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>تلگرام</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Twitter className="w-4 h-4 text-cyan-400" />
              <span>شبکه X (توییتر)</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
