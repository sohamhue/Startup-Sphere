import React from 'react';
import { Article } from '../types/blog';
import { ArrowRight, Bookmark, Sparkles, TrendingUp } from 'lucide-react';

interface HeroFeaturedProps {
  article: Article;
  onSelect: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent, articleId: string) => void;
  onOpenGenerator: () => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  article,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  onOpenGenerator,
}) => {
  return (
    <section className="mb-14">
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] grid grid-cols-1 lg:grid-cols-12 items-stretch">
        
        {/* Left Column: Lead Story Narrative (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Unboxed Kicker and Metadata */}
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-4 tracking-wide uppercase">
              <span className="text-amber-800">Editor’s Lead Story</span>
              <span aria-hidden="true" className="text-stone-300">/</span>
              <span>{article.category}</span>
              <span aria-hidden="true" className="text-stone-300">/</span>
              <span className="text-stone-600">{article.readTime}</span>
            </div>

            {/* Display Headline */}
            <h1
              onClick={() => onSelect(article)}
              className="cursor-pointer font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 leading-[1.15] hover:text-stone-800 transition-colors mb-5"
              style={{ textWrap: 'balance' }}
            >
              {article.title}
            </h1>

            {/* Subtitle Deck */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed mb-6 font-normal">
              {article.subtitle}
            </p>

            {/* Key takeaway snippet */}
            {article.sections[1]?.keyTakeaway && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 mb-6 text-sm text-stone-700">
                <span className="font-semibold text-stone-900 block mb-1">Key Strategic Principle:</span>
                <p className="italic text-stone-600">{article.sections[1].keyTakeaway}</p>
              </div>
            )}
          </div>

          {/* Action & Author Bar */}
          <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover border border-stone-200"
              />
              <div>
                <p className="text-sm font-semibold text-stone-900 leading-tight">{article.author.name}</p>
                <p className="text-xs text-stone-500">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => onToggleBookmark(e, article.id)}
                className="p-2.5 rounded-lg border border-stone-200 hover:border-stone-400 text-stone-700 hover:text-stone-900 transition-colors"
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>

              <button
                onClick={() => onSelect(article)}
                className="px-5 py-2.5 text-xs font-semibold tracking-wide text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm"
              >
                Read Deep Dive <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Lead Visual Asset (5 cols) */}
        <div className="lg:col-span-5 relative bg-stone-100 min-h-[300px] lg:min-h-full overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover cursor-pointer hover:scale-102 transition-transform duration-700 ease-out"
            onClick={() => onSelect(article)}
          />
          {article.coverCaption && (
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-xs">
              <p className="font-sans opacity-90 line-clamp-2">{article.coverCaption}</p>
            </div>
          )}
        </div>

      </div>

      {/* Operational Utility Strip directly below Hero (KPIs & Quick Action) */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 flex flex-col justify-between">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Curated Articles</span>
          <span className="text-xl font-bold font-mono-num text-stone-900 mt-1">10 In-Depth</span>
          <span className="text-xs text-stone-500 mt-1">Zero sponsored fluff</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 flex flex-col justify-between">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Audience Focus</span>
          <span className="text-xl font-bold font-editorial text-stone-900 mt-1">Founders & SMBs</span>
          <span className="text-xs text-stone-500 mt-1">Students to Series A</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 flex flex-col justify-between">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Unique Engine</span>
          <span className="text-xl font-bold text-stone-900 mt-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" /> AI Idea Studio
          </span>
          <span className="text-xs text-stone-500 mt-1">Custom business plans</span>
        </div>

        <button
          onClick={onOpenGenerator}
          className="group bg-stone-900 hover:bg-stone-800 text-white p-4 rounded-xl border border-stone-900 transition-colors flex flex-col justify-between text-left"
        >
          <span className="text-xs font-medium text-amber-300 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Launch Tool
          </span>
          <span className="text-sm font-semibold text-white mt-1 group-hover:translate-x-0.5 transition-transform flex items-center justify-between">
            Generate Your Concept <ArrowRight className="w-4 h-4 text-amber-300" />
          </span>
          <span className="text-xs text-stone-400 mt-1">Tailored to your skills & budget</span>
        </button>
      </div>
    </section>
  );
};
