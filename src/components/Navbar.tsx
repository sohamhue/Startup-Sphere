import React from 'react';
import { Sparkles, Bookmark, Search, X } from 'lucide-react';

interface NavbarProps {
  activeView: 'home' | 'generator' | 'runway' | 'pitchdeck' | 'saved';
  onNavigate: (view: 'home' | 'generator' | 'runway' | 'pitchdeck' | 'saved') => void;
  onSelectCategory?: (category: string | null) => void;
  savedIdeasCount: number;
  bookmarkedArticlesCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSearchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  savedIdeasCount,
  bookmarkedArticlesCount,
  onOpenSearchModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-stone-700 transition-colors flex items-center gap-2"
        >
          <span className="font-editorial text-2xl tracking-normal text-stone-950 font-semibold">Startup Sphere</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-950 ${
              activeView === 'home' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 -mb-[2px] pb-5 pt-5' : ''
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => onNavigate('generator')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-950 flex items-center gap-1.5 ${
              activeView === 'generator' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 -mb-[2px] pb-5 pt-5' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            AI Idea Generator
          </button>
          <button
            onClick={() => onNavigate('runway')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-950 ${
              activeView === 'runway' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 -mb-[2px] pb-5 pt-5' : ''
            }`}
          >
            Runway Calculator
          </button>
          <button
            onClick={() => onNavigate('pitchdeck')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-950 ${
              activeView === 'pitchdeck' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 -mb-[2px] pb-5 pt-5' : ''
            }`}
          >
            Pitch Deck Guide
          </button>
          <button
            onClick={() => onNavigate('saved')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-950 flex items-center gap-1.5 ${
              activeView === 'saved' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 -mb-[2px] pb-5 pt-5' : ''
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-stone-500" />
            Saved ({bookmarkedArticlesCount + savedIdeasCount})
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSearchModal}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors"
            title="Search articles"
            aria-label="Search articles"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('generator')}
            className="px-4 py-2 text-xs font-semibold tracking-wide text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            Generate Business Idea
          </button>
        </div>
      </div>
    </header>
  );
};
