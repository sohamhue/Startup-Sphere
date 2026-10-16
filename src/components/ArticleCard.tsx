import React from 'react';
import { Article } from '../types/blog';
import { Bookmark, Clock, ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent, articleId: string) => void;
  compact?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  compact = false,
}) => {
  return (
    <article
      onClick={() => onSelect(article)}
      className="group cursor-pointer flex flex-col justify-between bg-white border border-stone-200 hover:border-stone-400 transition-all duration-200 overflow-hidden rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
    >
      <div>
        {/* Visual asset container */}
        <div className={`relative overflow-hidden bg-stone-100 ${compact ? 'aspect-[16/10]' : 'aspect-[16/10]'}`}>
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              // Fallback for image load failure
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-stone-100 p-6 text-stone-400">
                    <span class="text-xs uppercase tracking-widest font-mono">${article.category}</span>
                  </div>
                `;
              }
            }}
          />
          <button
            onClick={(e) => onToggleBookmark(e, article.id)}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            className="absolute top-3 right-3 p-2 rounded-md bg-stone-900/60 backdrop-blur-md text-white hover:bg-stone-900 transition-colors"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Card content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Metadata: Clean unboxed text with middle-dot separators (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-2.5">
            <span className="text-stone-900 font-semibold">{article.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{article.readTime}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{article.publishedDate}</span>
          </div>

          {/* Title */}
          <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-950 leading-snug group-hover:text-stone-800 transition-colors mb-2.5 line-clamp-2">
            {article.title}
          </h3>

          {/* Subtitle / summary */}
          <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {article.subtitle}
          </p>
        </div>
      </div>

      {/* Author and read action footer */}
      <div className="px-5 sm:px-6 pb-5 pt-0 mt-auto border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-2.5 pt-3">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-6 h-6 rounded-full object-cover border border-stone-200"
          />
          <span className="font-medium text-stone-800">{article.author.name}</span>
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-stone-900 group-hover:translate-x-0.5 transition-transform pt-3">
          Read Story <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
