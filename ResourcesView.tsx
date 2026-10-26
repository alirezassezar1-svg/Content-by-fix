import React from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0e172a] to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>مرکز آموزش و استراتژی محتوا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            اصول تولید محتوای ارگانیک، پایدار و سئومحور در سال ۲۰۲۶
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            راهنماهای عملی و چک‌لیست‌های تیم تحریریه Nononick برای خلق محتوایی که مخاطب را میخکوب کرده و توسط الگوریتم‌های هوشمند گوگل به رتبه‌های برتر هدایت می‌شود.
          </p>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c121d] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            ۱. الگوریتم Helpful Content گوگل
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            گوگل دیگر به محتوای صرفاً ماشینی و بی‌روح رتبه نمی‌دهد. محتوا باید تجربه زیسته، زاویه دید انسانی (EEAT)، و ارزش واقعی برای حل دغدغه کاربر داشته باشد.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
            <li>✓ پرهیز از تکرار مصنوعی کلمات (Stuffing)</li>
            <li>✓ پاسخ سریع به سوال اصلی در ۳ پاراگراف اول</li>
            <li>✓ استفاده از اسکیماهای ساختاریافته FAQ و Breadcrumb</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c121d] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            ۲. روانشناسی قلاب ۳ ثانیه‌ای (Hook)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            کاربران در شبکه‌های اجتماعی کمتر از ۳ ثانیه برای اسکرول تصمیم می‌گیرند. هر محتوا باید با ایجاد شکاف آگاهی (Curiosity Gap) یا به چالش کشیدن یک باور غلط شروع شود.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
            <li>✓ ایجاد حس فوریت بدون کلیک‌بیت‌های فریبنده</li>
            <li>✓ ارقام ملموس و دقیق (مثلاً «۳ روش» به جای «چند روش»)</li>
            <li>✓ متن روی تصویر خوانا با کنتراست بالا</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c121d] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            ۳. سئو محلی (Local SEO) در شهرهای ایران
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            جستجوهایی نظیر «طراحی سایت در اندیمشک» یا «کلینیک دندانپزشکی در شیراز» نرخ تبدیل ۱۰ برابری نسبت به کلمات عمومی دارند زیرا نیت کاربر خرید فوری است.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
            <li>✓ نام بردن از محله‌ها و مناطق آشنای شهر</li>
            <li>✓ تطبیق مشخصات تماس (NAP) با گوگل مپ</li>
            <li>✓ پاسخ به سوالات بومی و نیازهای خاص ساکنان</li>
          </ul>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="p-8 rounded-2xl border border-slate-800 bg-[#0c121d] space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">سوالات پرتکرار کاربران Nononick Content Studio</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-bold block">آیا استفاده از این ابزار کاملاً رایگان است؟</strong>
            <p className="text-slate-400 leading-relaxed">
              بله! تمامی بخش‌های استودیو، تقویم محتوایی و ابزارهای سئو بدون نیاز به ثبت‌نام و پرداخت هزینه برای عموم کاربران و بیزینس‌ها رایگان است.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-bold block">چگونه متن‌های تولیدشده را در سایت خود منتشر کنم؟</strong>
            <p className="text-slate-400 leading-relaxed">
              با کلیک روی دکمه «کپی» یا «دانلود HTML» می‌توانید متن را مستقیماً در وردپرس، سیستم مدیریت محتوا یا شبکه‌های اجتماعی خود الصاق کنید.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-bold block">آیا گوگل محتوای تولیدشده توسط هوش مصنوعی را جریمه می‌کند؟</strong>
            <p className="text-slate-400 leading-relaxed">
              طبق بیانیه رسمی گوگل، نحوه تولید محتوا معیار نیست، بلکه کیفیت، دقت و رفع نیاز کاربر معیار است. استودیوی ما متونی بدون حشو و استاندارد تحویل می‌دهد.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-bold block">آیا برای ساخت وب‌سایت می‌توانم از خدمات Nononick استفاده کنم؟</strong>
            <p className="text-slate-400 leading-relaxed">
              بله! تیم فنی Nononick ارائه‌دهنده خدمات تخصصی طراحی سایت‌های اختصاصی، شرکتی، فروشگاهی و بهینه‌سازی حرفه‌ای سئو است.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
