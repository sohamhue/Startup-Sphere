import React, { useState } from 'react';
import { Mail, CheckCircle2, Download, ArrowRight, ShieldCheck } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
  };

  const handleDownloadToolkit = () => {
    const text = `=====================================================
STARTUP SPHERE — 2026 FOUNDER LAUNCH TOOLKIT
=====================================================

Included Playbooks:
1. Zero-CAC Distribution Protocol
   - Programmatic interactive calculators
   - SEO intent mapping
   - Subreddit & forum organic seeding

2. Cap Table Defense Checklist
   - Avoiding pre-money option pool traps
   - Post-money SAFE stacking math
   - 1x non-participating liquidation preference terms

3. Lean Micro-SaaS Tech Stack Recommendations
   - Framework: React / Vite + Tailwind CSS
   - Database & Auth: Supabase or Firebase
   - Model Inference: Gemini Flash API
   - Payments: Stripe Billing & Customer Portal

4. Cold Outreach Framework for First 20 Customer Calls
   - 140-character problem-specific cold email template
   - The "Advice vs Sales" conversation pivot script

=====================================================
Published by Startup Sphere Editorial
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'startup-sphere-founder-toolkit.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="my-16 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>The Founder’s Dispatch</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Tactical Business Intelligence Delivered Weekly
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            No sponsored buzzwords. Just actionable case studies, cap table architectures, unsexy business teardowns, and vetted startup ideas in your inbox every Thursday.
          </p>

          {isSubscribed ? (
            <div className="p-4 bg-stone-800 border border-stone-700 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>You’re subscribed to The Founder’s Dispatch!</span>
              </div>
              <p className="text-xs text-stone-300">
                Check your inbox for this week's issue. You can also download the immediate companion toolkit below:
              </p>
              <button
                onClick={handleDownloadToolkit}
                className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download 2026 Founder Launch Toolkit
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your founder email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-300 flex-1"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-xs font-bold text-stone-950 bg-white hover:bg-stone-200 transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <span>Join 24,000+ Founders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <div className="flex items-center gap-4 mt-4 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" /> Instant free download
            </span>
            <span>·</span>
            <span>Unsubscribe with 1 click anytime</span>
          </div>
        </div>

        {/* Subtle decorative typography watermark or geometric line */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden lg:flex items-center justify-center font-editorial text-9xl font-bold select-none text-white">
          S
        </div>
      </div>
    </section>
  );
};
