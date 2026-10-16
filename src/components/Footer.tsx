import React from 'react';
import { CATEGORIES } from '../data/articles';

interface FooterProps {
  onSelectCategory: (cat: string | null) => void;
  onNavigate: (view: 'home' | 'generator' | 'runway' | 'pitchdeck' | 'saved') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-editorial text-2xl font-bold text-white tracking-normal block">
              Startup Sphere
            </span>
            <p className="text-xs text-stone-400 leading-relaxed font-normal">
              An independent editorial publication covering startup success stories, business strategies, founder playbooks, and modern venture tools.
            </p>
            <div className="text-xs text-stone-500 font-mono">
              Volume IV · Spring 2026 Edition
            </div>
          </div>

          {/* Col 2: Publication Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      onNavigate('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-stone-400 hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Interactive Founder Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Founder Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('generator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  AI Business Idea Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('runway');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Startup Runway & Burn Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('pitchdeck');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  10-Slide Pitch Deck Checklist
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('saved');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  My Saved Briefs & Ideas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Editorial Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Editorial Standards
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Every breakdown on Startup Sphere is rigorously verified against real public SEC filings, verified founder interviews, and unit economic balance sheets.
            </p>
            <p className="text-xs text-stone-500">
              Target Audience: Aspiring founders, college builders, and small business operators.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Startup Sphere. All rights reserved. Made for ambitious founders.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Editorial Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
