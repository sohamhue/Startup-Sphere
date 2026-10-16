import React from 'react';
import { Article, GeneratedIdea } from '../types/blog';
import { Bookmark, Sparkles, Trash2, ArrowRight, ExternalLink } from 'lucide-react';

interface SavedViewProps {
  bookmarkedArticles: Article[];
  savedIdeas: GeneratedIdea[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (articleId: string) => void;
  onRemoveIdea: (index: number) => void;
  onOpenGenerator: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  bookmarkedArticles,
  savedIdeas,
  onSelectArticle,
  onRemoveBookmark,
  onRemoveIdea,
  onOpenGenerator,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 block mb-1">
          Founder Portfolio
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-950 mb-2">
          Saved Stories & Business Concepts
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-normal">
          Your personal library of bookmarked case studies and generated business launch canvases.
        </p>
      </div>

      <div className="space-y-12">
        {/* Saved Business Ideas Section */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-6">
            <h2 className="font-editorial text-2xl font-bold text-stone-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              Saved Business Concepts ({savedIdeas.length})
            </h2>
            <button
              onClick={onOpenGenerator}
              className="text-xs font-semibold text-stone-900 hover:underline flex items-center gap-1"
            >
              Generate New Idea <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {savedIdeas.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
              <p className="text-sm text-stone-500 mb-3">You haven’t saved any generated business ideas yet.</p>
              <button
                onClick={onOpenGenerator}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors"
              >
                Open Idea Generator
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedIdeas.map((idea, idx) => (
                <div key={idx} className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-xs font-mono text-stone-400 block">{idea.dateGenerated || 'Concept'}</span>
                        <h3 className="font-editorial text-xl font-bold text-stone-950 mt-0.5">{idea.conceptName}</h3>
                        <p className="text-xs font-medium text-stone-600 italic mt-0.5">{idea.tagline}</p>
                      </div>
                      <button
                        onClick={() => onRemoveIdea(idx)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        title="Delete saved idea"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed line-clamp-3 mb-3">
                      {idea.valueProposition}
                    </p>

                    <div className="text-xs text-stone-500 space-y-1 pt-2 border-t border-stone-100">
                      <p><span className="font-semibold text-stone-700">Monetization:</span> {idea.monetizationModel}</p>
                      <p><span className="font-semibold text-stone-700">Margin:</span> {idea.expectedGrossMargin}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap gap-1">
                    {idea.recommendedTechStack.slice(0, 3).map((t, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[11px] rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarked Articles Section */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-6">
            <h2 className="font-editorial text-2xl font-bold text-stone-950 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-stone-700" />
              Bookmarked Articles ({bookmarkedArticles.length})
            </h2>
          </div>

          {bookmarkedArticles.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
              <p className="text-sm text-stone-500">No bookmarked articles yet. Click the bookmark icon on any story to save it for offline reading.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200 bg-white border border-stone-200 rounded-xl overflow-hidden">
              {bookmarkedArticles.map((art) => (
                <div key={art.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                  <div className="flex-1 cursor-pointer" onClick={() => onSelectArticle(art)}>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                      <span className="font-semibold text-stone-900">{art.category}</span>
                      <span>·</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="font-editorial text-lg font-bold text-stone-950 hover:underline">
                      {art.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">{art.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => onSelectArticle(art)}
                      className="px-3 py-1.5 text-xs font-semibold text-stone-900 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
                    >
                      Read Now
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(art.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
