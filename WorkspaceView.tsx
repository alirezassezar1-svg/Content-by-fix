import React, { useState } from 'react';
import {
  ALL_CONTENT_TYPES,
  CONTENT_CATEGORIES,
  TONE_OPTIONS,
  LENGTH_OPTIONS,
} from './contentTypes';
import { ContentTypeDefinition, GeneratedHistoryItem } from './types';
import { ContentEditor } from './ContentEditor';
import {
  Sparkles,
  FileText,
  Search,
  Heading,
  Tag,
  Layout,
  Package,
  ShoppingBag,
  HelpCircle,
  Instagram,
  Linkedin,
  Twitter,
  Film,
  Video,
  Youtube,
  UserCheck,
  Megaphone,
  Mail,
  MessageSquare,
  DollarSign,
  MousePointer,
  Zap,
  RefreshCw,
  Minimize2,
  Sliders,
  Globe,
  Maximize2,
  Scissors,
  Share2,
  Tv,
  Lightbulb,
  Calendar,
  MapPin,
  Briefcase,
  Building,
  ArrowRight,
  Send,
  Loader2,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

interface WorkspaceViewProps {
  onSaveToHistory: (item: GeneratedHistoryItem) => void;
  onOpenSeoMode: () => void;
  onOpenCalendar: () => void;
  onOpenRepurpose: () => void;
}

// Icon mapper for dynamic content types
const renderIcon = (name: string, className = 'w-4 h-4') => {
  switch (name) {
    case 'FileText': return <FileText className={className} />;
    case 'Search': return <Search className={className} />;
    case 'Heading': return <Heading className={className} />;
    case 'Tag': return <Tag className={className} />;
    case 'Layout': return <Layout className={className} />;
    case 'Package': return <Package className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'HelpCircle': return <HelpCircle className={className} />;
    case 'Instagram': return <Instagram className={className} />;
    case 'Linkedin': return <Linkedin className={className} />;
    case 'Twitter': return <Twitter className={className} />;
    case 'Film': return <Film className={className} />;
    case 'Video': return <Video className={className} />;
    case 'Youtube': return <Youtube className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'Megaphone': return <Megaphone className={className} />;
    case 'Mail': return <Mail className={className} />;
    case 'MessageSquare': return <MessageSquare className={className} />;
    case 'DollarSign': return <DollarSign className={className} />;
    case 'MousePointer': return <MousePointer className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'RefreshCw': return <RefreshCw className={className} />;
    case 'Minimize2': return <Minimize2 className={className} />;
    case 'Sliders': return <Sliders className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Maximize2': return <Maximize2 className={className} />;
    case 'Scissors': return <Scissors className={className} />;
    case 'Share2': return <Share2 className={className} />;
    case 'Tv': return <Tv className={className} />;
    case 'Lightbulb': return <Lightbulb className={className} />;
    case 'Calendar': return <Calendar className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Building': return <Building className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  onSaveToHistory,
  onOpenSeoMode,
  onOpenCalendar,
  onOpenRepurpose,
}) => {
  const [selectedType, setSelectedType] = useState<ContentTypeDefinition>(ALL_CONTENT_TYPES[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickHeroInput, setQuickHeroInput] = useState<string>('');

  // Form State
  const [topic, setTopic] = useState('');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [audience, setAudience] = useState('عمومی و مشتریان بالقوه');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('افزایش آگاهی، اعتمادسازی و فروش');
  const [tone, setTone] = useState(selectedType.defaultTone || 'آموزشی');
  const [length, setLength] = useState<'کوتاه' | 'متوسط' | 'بلند' | 'خیلی بلند'>(selectedType.defaultLength || 'بلند');
  const [proposedTitle, setProposedTitle] = useState('');
  const [initialText, setInitialText] = useState('');
  const [brandName, setBrandName] = useState('Nononick');
  const [website, setWebsite] = useState('nononick.com');
  const [cta, setCta] = useState('');

  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter content types
  const filteredTypes = ALL_CONTENT_TYPES.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectType = (item: ContentTypeDefinition) => {
    setSelectedType(item);
    setTone(item.defaultTone);
    setLength(item.defaultLength);
  };

  const handleQuickHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickHeroInput.trim()) return;
    setTopic(quickHeroInput);
    handleGenerate(quickHeroInput);
  };

  const handleGenerate = async (overrideTopic?: string) => {
    const topicToUse = overrideTopic || topic;
    if (!topicToUse.trim() && !initialText.trim()) {
      setErrorMsg('لطفاً عنوان یا موضوع یا متن اولیه را وارد کنید.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType.title,
          topic: topicToUse,
          primaryKeyword,
          secondaryKeywords,
          audience,
          tone,
          length,
          goal,
          proposedTitle,
          initialText,
          brandName,
          website,
          cta,
          city,
          industry,
        }),
      });

      const data = await response.json();
      if (data.success && data.content) {
        setGeneratedOutput(data.content);
        // Save to history
        onSaveToHistory({
          id: Date.now().toString(),
          title: topicToUse || selectedType.title,
          contentType: selectedType.title,
          content: data.content,
          date: new Date().toISOString(),
          tone,
          topic: topicToUse,
          wordCount: data.content.split(/\s+/).length,
        });
      } else {
        setErrorMsg(data.error || 'خطایی در تولید محتوا پیش آمد.');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg('ارتباط با سرور برقرار نشد. لطفاً مجدداً تلاش کنید.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-[#0e1626] to-[#090d16] p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.12),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>استودیوی رسمی تولید محتوا و سئو Nononick</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.25]">
            هر چیزی که برای تولید محتوا لازم داری، <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">یکجا.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ایده بگیر، بنویس، بازنویسی کن، سئو کن و برای شبکه‌های اجتماعی آماده‌اش کن. سریع، استاندارد و متناسب با بازار ایران.
          </p>

          {/* Quick Input Bar */}
          <form onSubmit={handleQuickHeroSubmit} className="max-w-2xl mx-auto relative pt-2">
            <div className="relative flex items-center bg-[#070b13]/90 border border-slate-700/80 rounded-xl p-1.5 shadow-xl focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <input
                type="text"
                value={quickHeroInput}
                onChange={(e) => setQuickHeroInput(e.target.value)}
                placeholder="امروز چه چیزی می‌خواهی بسازی؟ (مثال: مقاله سئو درباره طراحی سایت، کپشن اینستاگرام فروشگاه...)"
                className="w-full bg-transparent px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                dir="rtl"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-lg hover:from-cyan-500 hover:to-indigo-500 active:scale-95 transition-all shadow-md shrink-0 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">شروع فوری</span>
              </button>
            </div>
          </form>

          {/* Quick Action Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 pl-2">دسترسی سریع:</span>
            <button
              onClick={() => {
                const item = ALL_CONTENT_TYPES.find((t) => t.id === 'مقاله سئو')!;
                handleSelectType(item);
                setTopic('اصول سئو در سال ۲۰۲۶');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors"
            >
              مقاله سئو
            </button>
            <button
              onClick={() => {
                const item = ALL_CONTENT_TYPES.find((t) => t.id === 'کپشن اینستاگرام')!;
                handleSelectType(item);
                setTopic('تخفیف ویژه کالکشن جدید');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors"
            >
              کپشن اینستاگرام
            </button>
            <button
              onClick={onOpenRepurpose}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors"
            >
              یک محتوا، چندین محتوا
            </button>
            <button
              onClick={onOpenCalendar}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors"
            >
              تقویم محتوایی
            </button>
            <button
              onClick={onOpenSeoMode}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 transition-colors"
            >
              پکیج جامع سئو (SEO Mode)
            </button>
          </div>
        </div>
      </section>

      {/* Main Studio Interactive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Inputs & Selection): 6 cols on lg */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 1: Content Type Selection */}
          <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-600/30 text-cyan-400 text-xs font-bold flex items-center justify-center">
                  ۱
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">انتخاب نوع تولید محتوا</h3>
              </div>
              <span className="text-xs text-slate-400">
                {ALL_CONTENT_TYPES.length} قالب آماده
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {CONTENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-cyan-600 text-white font-medium shadow-sm'
                      : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input for Types */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو بین ۳۶ قالب محتوا (مثال: ریلز، لینکدین، سئو، ایمیل...)"
                className="w-full bg-[#080c14] border border-slate-800 rounded-lg pr-9 pl-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            </div>

            {/* Compact Grid of Types */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredTypes.map((item) => {
                const isSelected = selectedType.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectType(item)}
                    className={`p-2.5 rounded-lg text-right border transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-sm shadow-cyan-950'
                        : 'bg-[#090e17] border-slate-800/90 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                        {item.title}
                      </span>
                      <div className={isSelected ? 'text-cyan-400' : 'text-slate-500'}>
                        {renderIcon(item.iconName, 'w-3.5 h-3.5')}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 line-clamp-1">
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Dynamic Smart Form */}
          <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-600/30 text-cyan-400 text-xs font-bold flex items-center justify-center">
                  ۲
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  تنظیمات هوشمند: <span className="text-cyan-400">{selectedType.title}</span>
                </h3>
              </div>
              <span className="text-xs text-slate-400">فرم اختصاصی</span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Primary Topic / Title */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  {selectedType.fields.topicLabel || 'موضوع یا عنوان اصلی'} <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="مثال: تکنیک‌های بازاریابی محتوا در سال ۲۰۲۶"
                  className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                  dir="auto"
                />
              </div>

              {/* Keyword fields if active */}
              {(selectedType.fields.showKeyword || selectedType.fields.showSecondaryKeywords) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedType.fields.showKeyword && (
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">کلمه کلیدی اصلی (Primary Keyword)</label>
                      <input
                        type="text"
                        value={primaryKeyword}
                        onChange={(e) => setPrimaryKeyword(e.target.value)}
                        placeholder="مثال: بازاریابی محتوا"
                        className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                      />
                    </div>
                  )}
                  {selectedType.fields.showSecondaryKeywords && (
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">کلمات کلیدی فرعی (جدا شده با ویرگول)</label>
                      <input
                        type="text"
                        value={secondaryKeywords}
                        onChange={(e) => setSecondaryKeywords(e.target.value)}
                        placeholder="مثال: سئو محتوا، تولید محتوا، استراتژی محتوا"
                        className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* City or Industry if active */}
              {(selectedType.fields.showCity || selectedType.fields.showIndustry) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedType.fields.showCity && (
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">شهر یا موقعیت جغرافیایی</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="مثال: اندیمشک، تهران، شیراز، اصفهان..."
                        className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                      />
                    </div>
                  )}
                  {selectedType.fields.showIndustry && (
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">حوزه یا صنعت</label>
                      <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="مثال: کلینیک دندانپزشکی، فروشگاه آنلاین، املاک..."
                        className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Audience and Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">مخاطب هدف</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="مثال: صاحبان کسب‌وکار، دانشجویان، بانوان..."
                    className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">هدف محتوا</label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="مثال: جذب لید، آموزش، خرید مستقیم، تعامل"
                    className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Tone & Length Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">لحن نگارش</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                  >
                    {TONE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">طول محتوا</label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value as any)}
                    className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                  >
                    {LENGTH_OPTIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Initial Text / Notes if applicable */}
              {selectedType.fields.showInitialText && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    {selectedType.fields.initialTextLabel || 'متن یا یادداشت اولیه'}
                  </label>
                  <textarea
                    rows={3}
                    value={initialText}
                    onChange={(e) => setInitialText(e.target.value)}
                    placeholder="متن اولیه، ویژگی‌های محصول یا نکات مهم را اینجا وارد کنید..."
                    className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                    dir="auto"
                  />
                </div>
              )}

              {/* Brand and CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">نام برند</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Nononick"
                    className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">کال تو اکشن اختصاصی (CTA)</label>
                  <input
                    type="text"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="مثال: برای مشاوره رایگان با کارشناسان تماس بگیرید"
                    className="w-full bg-[#080c14] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-[0.99] transition-all shadow-lg shadow-cyan-950/50 disabled:opacity-50 text-sm sm:text-base cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>در حال پردازش و تولید محتوا...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-cyan-200" />
                      <span>تولید محتوای هوشمند ({selectedType.title})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Content Editor: 6 cols on lg */}
        <div className="lg:col-span-6 space-y-4">
          <ContentEditor
            content={
              generatedOutput ||
              `# به استودیوی تولید محتوای Nononick خوش آمدید! 👋

نوع محتوای خود را از منوی سمت راست انتخاب کنید، موضوع و کلمه کلیدی را بنویسید و روی دکمه **«تولید محتوای هوشمند»** کلیک کنید.

### امکانات این استودیو:
- **۳۶+ قالب محتوایی آماده:** از مقالات سئو گرفته تا سناریوی ریلز، پست‌های لینکدین و تقویم محتوایی.
- **اصلاح و ویرایش هوشمند:** امکان کوتاه کردن، بسط دادن، تغییر لحن و ترجمه با یک کلیک.
- **خروجی چندکاناله:** تبدیل یک متن به ده‌ها پست اینستاگرام، توییتر و خبرنامه.
- **ویرایشگر یکپارچه:** پیش‌نمایش زنده مارک‌داون، ویرایش اختصاصی، کپی، دانلود HTML/TXT و اشتراک‌گذاری.

برای شروع، فرم سمت راست را کامل کنید و اولین قطعه محتوای خود را خلق کنید!`
            }
            onContentChange={(newContent) => setGeneratedOutput(newContent)}
            title={topic || selectedType.title}
            contentType={selectedType.title}
            onRegenerate={() => handleGenerate()}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};
