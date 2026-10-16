import React, { useState, useEffect } from 'react';
import { Article, GeneratedIdea, Category } from './types/blog';
import { ARTICLES, CATEGORIES } from './data/articles';
import { Navbar } from './components/Navbar';
import { HeroFeatured } from './components/HeroFeatured';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { IdeaGenerator } from './components/IdeaGenerator';
import { RunwayCalculator } from './components/RunwayCalculator';
import { PitchDeckChecklist } from './components/PitchDeckChecklist';
import { SavedView } from './components/SavedView';
import { SearchModal } from './components/SearchModal';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { Sparkles, Filter, ArrowRight, Layers, Flame } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'generator' | 'runway' | 'pitchdeck' | 'saved'>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Persistence: Bookmarked Article IDs
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('startup_sphere_bookmarks');
      return stored ? JSON.parse(stored) : ['art-01', 'art-03'];
    } catch {
      return ['art-01', 'art-03'];
    }
  });

  // Persistence: Saved Business Ideas
  const [savedIdeas, setSavedIdeas] = useState<GeneratedIdea[]>(() => {
    try {
      const stored = localStorage.getItem('startup_sphere_saved_ideas');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('startup_sphere_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('startup_sphere_saved_ideas', JSON.stringify(savedIdeas));
    } catch (e) {
      console.error(e);
    }
  }, [savedIdeas]);

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleBookmark = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  const handleSaveIdea = (newIdea: GeneratedIdea) => {
    setSavedIdeas((prev) => [newIdea, ...prev]);
  };

  const handleRemoveIdea = (index: number) => {
    setSavedIdeas((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToArticles = () => {
    setSelectedArticle(null);
  };

  const bookmarkedArticles = ARTICLES.filter((a) => bookmarkedIds.includes(a.id));

  // Lead story is the first featured article
  const leadStory = ARTICLES.find((a) => a.featured) || ARTICLES[0];

  // Filtered articles list
  const filteredArticles = ARTICLES.filter((a) => {
    if (selectedCategory === 'All') return true;
    return a.category === selectedCategory;
  });

  // Trending ranked list
  const trendingArticles = [...ARTICLES].sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99)).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 flex flex-col selection:bg-amber-100 selection:text-stone-950">
      
      {/* 3-Zone Top Bar Navigation */}
      <Navbar
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          setSelectedArticle(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedIdeasCount={savedIdeas.length}
        bookmarkedArticlesCount={bookmarkedIds.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSearchModal={() => setIsSearchOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* Article Long-Form Reading View */}
        {selectedArticle ? (
          <ArticleDetail
            article={selectedArticle}
            onBack={handleBackToArticles}
            isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
            onToggleBookmark={handleToggleBookmark}
            allArticles={ARTICLES}
            onSelectArticle={handleSelectArticle}
            onOpenGenerator={() => {
              setSelectedArticle(null);
              setActiveView('generator');
            }}
          />
        ) : activeView === 'generator' ? (
          /* Unique Feature: AI Business Idea Generator */
          <IdeaGenerator onSaveIdea={handleSaveIdea} savedIdeas={savedIdeas} />
        ) : activeView === 'runway' ? (
          /* Founder Runway Tool */
          <RunwayCalculator />
        ) : activeView === 'pitchdeck' ? (
          /* 10-Slide Pitch Deck Checklist */
          <PitchDeckChecklist />
        ) : activeView === 'saved' ? (
          /* Saved Portfolio View */
          <SavedView
            bookmarkedArticles={bookmarkedArticles}
            savedIdeas={savedIdeas}
            onSelectArticle={handleSelectArticle}
            onRemoveBookmark={(id) => setBookmarkedIds((prev) => prev.filter((i) => i !== id))}
            onRemoveIdea={handleRemoveIdea}
            onOpenGenerator={() => setActiveView('generator')}
          />
        ) : (
          /* Publication Home View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            
            {/* Lead Story Marquee Hero */}
            <HeroFeatured
              article={leadStory}
              onSelect={handleSelectArticle}
              isBookmarked={bookmarkedIds.includes(leadStory.id)}
              onToggleBookmark={handleToggleBookmark}
              onOpenGenerator={() => setActiveView('generator')}
            />

            {/* Publication Filter & Section Rhythm */}
            <div className="mt-14 mb-8">
              
              {/* Filter controls row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950">
                    Latest Dispatches & Analyses
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    10 verified business breakdowns across 6 core founder categories
                  </p>
                </div>

                {/* Filter buttons bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      selectedCategory === 'All'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white text-stone-600 hover:text-stone-950 border border-stone-200'
                    }`}
                  >
                    All ({ARTICLES.length})
                  </button>

                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-stone-900 text-white shadow-xs font-semibold'
                          : 'bg-white text-stone-600 hover:text-stone-950 border border-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Articles (Tier 2 & 3 Salience) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
                {filteredArticles.map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onSelect={handleSelectArticle}
                    isBookmarked={bookmarkedIds.includes(art.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="py-16 text-center text-stone-500 bg-white rounded-xl border border-stone-200 my-8">
                  <p>No articles found for category “{selectedCategory}”.</p>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="mt-3 text-xs font-semibold text-stone-900 underline"
                  >
                    Show all dispatches
                  </button>
                </div>
              )}

            </div>

            {/* Asymmetric Split: Trending Stories & AI Generator Spotlight */}
            <div className="mt-16 pt-12 border-t border-stone-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Trending Founder Reads (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 mb-6">
                  <Flame className="w-4 h-4 text-amber-700" />
                  <h3 className="font-editorial text-2xl font-bold text-stone-950">
                    Highest-Impact Readership
                  </h3>
                </div>

                <div className="divide-y divide-stone-100 space-y-4">
                  {trendingArticles.map((art, idx) => (
                    <div
                      key={art.id}
                      onClick={() => handleSelectArticle(art)}
                      className="pt-4 first:pt-0 cursor-pointer group flex items-start gap-4"
                    >
                      <span className="font-editorial text-3xl font-bold text-stone-300 group-hover:text-amber-800 transition-colors w-8 shrink-0">
                        0{idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                          <span className="font-semibold text-stone-900">{art.category}</span>
                          <span>·</span>
                          <span>{art.readTime}</span>
                        </div>
                        <h4 className="font-editorial text-base sm:text-lg font-bold text-stone-950 group-hover:text-stone-800 leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-xs text-stone-600 line-clamp-1 mt-1 font-normal">
                          {art.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Idea Generator Launch Widget (5 cols) */}
              <div className="lg:col-span-5 bg-stone-900 text-white p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Founder Feature</span>
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white mb-3">
                    Stuck on What to Build Next?
                  </h3>
                  <p className="text-sm text-stone-300 leading-relaxed mb-6 font-normal">
                    Our AI Business Idea Generator analyzes your specific skills, available starting capital, and domain interest to formulate a viable commercial thesis and 30-day MVP plan.
                  </p>

                  <div className="space-y-2.5 text-xs text-stone-300 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Customized to your exact budget ($0 to $25k+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>4-week lean MVP launch milestones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Exportable Founder Launch Canvas</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('generator')}
                  className="w-full py-3 px-4 bg-white text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Launch Idea Generator</span>
                </button>
              </div>

            </div>

            {/* Newsletter Dispatch Component */}
            <NewsletterSection />

          </div>
        )}

      </main>

      {/* Global Institutional Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat as any);
          setSelectedArticle(null);
        }}
        onNavigate={(view) => {
          setActiveView(view);
          setSelectedArticle(null);
        }}
      />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={ARTICLES}
        onSelectArticle={handleSelectArticle}
      />

    </div>
  );
}
