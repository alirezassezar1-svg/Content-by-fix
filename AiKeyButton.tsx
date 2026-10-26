import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { DEFAULT_MODEL, loadAi, saveAi } from './studioApi';

/** Floating button + dialog to store the user's Gemini key in this browser only. */
export function AiKeyButton() {
  const [open, setOpen] = useState(false);
  const [ai, setAi] = useState(loadAi);
  const [key, setKey] = useState(ai.apiKey);
  const [model, setModel] = useState(ai.model);

  return (
    <>
      <button
        onClick={() => { setKey(ai.apiKey); setModel(ai.model); setOpen(true); }}
        className="fixed bottom-4 left-4 z-[60] flex items-center gap-2 rounded-full border border-sky-600 bg-slate-900/95 px-4 py-2 text-xs font-medium text-sky-300 shadow-lg"
        style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <Sparkles size={14} /> {ai.apiKey ? 'AI: ON' : 'AI: OFF'}
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" dir="rtl">
          <form
            className="w-full max-w-md space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-100"
            onSubmit={(e) => {
              e.preventDefault();
              const k = key.trim();
              const m = model.trim() || DEFAULT_MODEL;
              saveAi(k, m);
              setAi({ apiKey: k, model: m });
              setOpen(false);
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-sky-300">
                <Sparkles size={16} /> تنظیمات هوش مصنوعی (Gemini)
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-400"><X size={16} /></button>
            </div>
            <label className="block text-xs">
              کلید API
              <input type="password" dir="ltr" autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)}
                placeholder="AIza..." className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </label>
            <label className="block text-xs">
              مدل
              <input dir="ltr" value={model} onChange={(e) => setModel(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </label>
            <p className="text-[11px] leading-6 text-slate-400">
              کلید فقط در همین مرورگر ذخیره می‌شود و فقط به Google فرستاده می‌شود. بدون کلید، موتور آفلاین استودیو جواب می‌دهد.
              روی هاست Node با سرور، این تنظیم لازم نیست (کلید در <code>.env</code> سرور است).
            </p>
            <button type="submit" className="w-full rounded bg-sky-600 py-2 text-sm font-medium text-white">ذخیره</button>
          </form>
        </div>
      )}
    </>
  );
}
