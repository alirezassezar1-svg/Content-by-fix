export * from './media';

export type NavigationTab =
  | 'studio'        // Unified Image, Video & Animation Studio
  | 'canvas'        // Ultra-Detail Inspector & 8K Loupe Viewer (Passes, A/B Split)
  | 'architecture'  // System Architecture & Technical Stack Blueprint
  | 'specification' // Product Specification, Benchmarks vs Midjourney/Kling/Luma & Roadmap
  | 'motion_brush'  // Interactive Physics & Motion Vector Sandbox
  | 'gallery'       // Masterpiece Showcase & Director Presets
  | 'history'       // Render Archive & Production Vault
  | 'workspace'
  | 'seo'
  | 'repurpose'
  | 'calendar'
  | 'workflow'
  | 'prompt_builder'
  | 'free_tools'
  | 'resources';


export interface GeneratedHistoryItem {
  id: string;
  title: string;
  contentType: string;
  content: string;
  date: string; // ISO string
  tone?: string;
  topic?: string;
  wordCount: number;
  metadata?: any;
}

export interface ContentTypeDefinition {
  id: string;
  title: string;
  category: 'blog_seo' | 'social' | 'sales' | 'edit_transform' | 'ideas' | 'business_local';
  description: string;
  iconName: string;
  defaultTone: string;
  defaultLength: 'کوتاه' | 'متوسط' | 'بلند' | 'خیلی بلند';
  fields: {
    topicLabel?: string;
    showKeyword?: boolean;
    showSecondaryKeywords?: boolean;
    showAudience?: boolean;
    showGoal?: boolean;
    showCity?: boolean;
    showIndustry?: boolean;
    showInitialText?: boolean;
    initialTextLabel?: string;
    showProposedTitle?: boolean;
    showCta?: boolean;
  };
}

export interface SeoPackageData {
  seoTitle: string;
  metaDescription: string;
  slug: string;
  searchIntent: string;
  h1: string;
  h2List: string[];
  h3List: string[];
  articleContent: string;
  faq: { question: string; answer: string }[];
  relatedKeywords: string[];
  cta: string;
  internalLinks: { title: string; url: string }[];
  externalLinks: { title: string; url: string }[];
  ogTitle: string;
  ogDescription: string;
  imageAlt: string;
  seoScore: number;
}

export interface RepurposeData {
  instagramCaptions: string[];
  linkedinPosts: string[];
  xPosts: string[];
  reelsScript: {
    title: string;
    duration: string;
    hook: string;
    body: string;
    captionText: string;
  };
  youtubeScript: {
    title: string;
    hookSeconds: string;
    outline: string[];
    description: string;
  };
  hooks: string[];
  headlines: string[];
  ctas: string[];
  newsletter: {
    subject: string;
    previewText: string;
    bodyMarkdown: string;
    buttonCta: string;
  };
}

export interface CalendarDayItem {
  dayNumber: number;
  dayName: string;
  platform: string;
  contentType: string;
  topic: string;
  title: string;
  hook: string;
  cta: string;
  targetKeyword: string;
  rationale: string;
}

export interface FreeToolInfo {
  slug: string;
  name: string;
  category: string;
  h1: string;
  description: string;
  inputPlaceholder: string;
  inputType: 'text' | 'textarea' | 'counter';
  howToUse: string[];
  benefits: string[];
  examples: string[];
  faq: { q: string; a: string }[];
}
