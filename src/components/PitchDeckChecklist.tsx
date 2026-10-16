import React, { useState } from 'react';
import { CheckSquare, Square, CheckCircle, HelpCircle, FileText, Download } from 'lucide-react';

interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  keyElements: string[];
  investorFilter: string;
  pitfallToAvoid: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    title: 'Slide 01: The Problem & Catalyst',
    subtitle: 'Clarify the specific economic pain, who feels it, and why current solutions fail.',
    keyElements: [
      'Quantified annual loss or wasted hours experienced by target buyer',
      'The specific reason legacy tools fail (outdated tech, regulatory shift)',
      'Why now: what changed in 2026 that makes this solvable today?',
    ],
    investorFilter: 'Is this an urgent haircut problem or a cosmetic "nice-to-have"?',
    pitfallToAvoid: 'Describing an abstract industry trend rather than a tangible human or company pain point.',
  },
  {
    id: 2,
    title: 'Slide 02: The Solution & The 10x Wedge',
    subtitle: 'Show the immediate unfair advantage and simple user workflow.',
    keyElements: [
      'Single-sentence value proposition (no buzzwords)',
      'How the user goes from pain to relief in under 5 minutes',
      'The initial wedge: the single sharp feature that earns customer trust',
    ],
    investorFilter: 'Can a customer explain this product to their colleague in one breath?',
    pitfallToAvoid: 'Boasting an "all-in-one platform" before proving product-market fit on one feature.',
  },
  {
    id: 3,
    title: 'Slide 03: Market Sizing (Bottom-Up)',
    subtitle: 'Demonstrate bottom-up TAM/SAM/SOM based on real customer willingness to pay.',
    keyElements: [
      'Bottom-up math: (# of verifiable target accounts) × (Annual Contract Value)',
      'Serviceable Obtainable Market (SOM) reachable in the next 24 months',
      'Market expansion vectors after conquering the initial wedge',
    ],
    investorFilter: 'Did the founder pull a top-down Gartner $100B statistic or calculate unit accounts?',
    pitfallToAvoid: 'Claiming "If we just capture 1% of China or the US, we are a billionaire."',
  },
  {
    id: 4,
    title: 'Slide 04: Product Walkthrough & UX Proof',
    subtitle: 'Visual proof of software execution and tactile user experience.',
    keyElements: [
      'Crisp high-resolution UI screenshots or 15-second Loom gif',
      'Highlighting zero-friction onboarding moments',
      'Core architectural differentiation (e.g. proprietary workflows or APIs)',
    ],
    investorFilter: 'Has this product actually been engineered or is it purely Figma wireframes?',
    pitfallToAvoid: 'Overcrowded slides with 12 tiny unlabeled screenshots.',
  },
  {
    id: 5,
    title: 'Slide 05: Traction, Retention & Cohorts',
    subtitle: 'Data proving that users love the product and keep returning.',
    keyElements: [
      'Month-over-month MRR/ARR growth graph with actual dollar figures',
      'Net Revenue Retention (NRR) or user retention cohort curves',
      'Quotes or signed letters of intent (LOIs) from recognized customers',
    ],
    investorFilter: 'Are customers sticking around or is this a leaky bucket?',
    pitfallToAvoid: 'Cumulative graphs designed to hide declining active users.',
  },
  {
    id: 6,
    title: 'Slide 06: Business Model & Unit Economics',
    subtitle: 'How you capture value and scale gross margins.',
    keyElements: [
      'Pricing model (Subscription tiers, usage-based, or take-rate percentage)',
      'Target Gross Margin (Software targets 75%+)',
      'Customer Acquisition Cost (CAC) vs Lifetime Value (LTV) estimates',
    ],
    investorFilter: 'Does this company make real gross profit or subsidize customer growth with venture capital?',
    pitfallToAvoid: 'Undercutting prices so severely that customer support makes each account unprofitable.',
  },
  {
    id: 7,
    title: 'Slide 07: Go-To-Market & Distribution Engine',
    subtitle: 'The repeatable channel that acquires customers without infinite ad spend.',
    keyElements: [
      'Primary unfair distribution channel (Programmatic SEO, cold outbound, viral loops)',
      'Proven CAC payback timeline (under 6 months is gold standard)',
      'Sales cycle length (days for self-serve, weeks for enterprise)',
    ],
    investorFilter: 'If we give you $1M, do you know exactly which channel turns $1 into $4?',
    pitfallToAvoid: 'Listing "PR, SEO, Influencer Marketing, Conferences, and Ads" without testing any.',
  },
  {
    id: 8,
    title: 'Slide 08: Competitive Moat & Why Now',
    subtitle: 'Why incumbents cannot easily copy this in one quarterly sprint.',
    keyElements: [
      '2x2 positioning matrix comparing key capabilities',
      'Structural moat: proprietary data flywheel, switching costs, or network effects',
      'Why slow incumbents won’t prioritize this niche until it is too late',
    ],
    investorFilter: 'Why can’t Microsoft, Salesforce, or Stripe build this on a hackathon Friday?',
    pitfallToAvoid: 'Putting red X marks next to competitors and green checkmarks next to everything you do.',
  },
  {
    id: 9,
    title: 'Slide 09: Founding Team & Market Fit',
    subtitle: 'Why this specific group of founders is destined to win this market.',
    keyElements: [
      'Key operators, domain insiders, and engineering pedigree',
      'Previous exits, patents, or 10,000 hours in the specific problem space',
      'Complementary split (Technical builder + Commercial distribution leader)',
    ],
    investorFilter: 'Do these founders have genuine obsessive obsession with this problem?',
    pitfallToAvoid: 'Listing five advisory board members who only spend 15 minutes a quarter on a Zoom call.',
  },
  {
    id: 10,
    title: 'Slide 10: The Ask, Use of Funds & Milestones',
    subtitle: 'The explicit fundraising goal and the concrete milestones it finances.',
    keyElements: [
      'Target round size (e.g., $1.5M Seed on post-money SAFE)',
      'Runway duration purchased (target 18 to 24 months)',
      'Explicit operational milestones unlocked by month 18 (e.g., Reach $1.2M ARR, 40 enterprise logos)',
    ],
    investorFilter: 'Will this round get the company cleanly to Series A or profitability without a bridge crisis?',
    pitfallToAvoid: 'Vague budget splits like "Marketing 40%, Product 40%, Misc 20%".',
  },
];

export const PitchDeckChecklist: React.FC = () => {
  const [checkedSlides, setCheckedSlides] = useState<number[]>([1, 2]);

  const toggleSlide = (id: number) => {
    if (checkedSlides.includes(id)) {
      setCheckedSlides(checkedSlides.filter((item) => item !== id));
    } else {
      setCheckedSlides([...checkedSlides, id]);
    }
  };

  const progressPercentage = Math.round((checkedSlides.length / SLIDES.length) * 100);

  const handleExportChecklist = () => {
    const text = SLIDES.map((s) => {
      const isDone = checkedSlides.includes(s.id);
      return `[${isDone ? 'X' : ' '}] ${s.title}\n    ${s.subtitle}\n    Avoid: ${s.pitfallToAvoid}\n`;
    }).join('\n');

    const blob = new Blob([`STARTUP SPHERE — 10-SLIDE PITCH DECK READINESS CHECKLIST\nReadiness: ${progressPercentage}%\n\n${text}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pitch-deck-readiness-checklist.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 block mb-1">
            Fundraising Intelligence
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-950 mb-2">
            The 10-Slide Venture Pitch Deck Guide
          </h1>
          <p className="text-base text-stone-600 leading-relaxed font-normal">
            The canonical slide architecture used by tier-one founders to raise angel, seed, and Series A rounds.
          </p>
        </div>

        <button
          onClick={handleExportChecklist}
          className="px-4 py-2 text-xs font-semibold text-stone-800 border border-stone-300 rounded-lg bg-white hover:border-stone-400 flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" /> Export Checklist
        </button>
      </div>

      {/* Readiness Progress Bar */}
      <div className="p-5 bg-white border border-stone-200 rounded-xl mb-8 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
          <span>Deck Readiness Score</span>
          <span className="font-mono-num text-stone-900 font-bold text-sm">
            {checkedSlides.length} of 10 Slides Complete ({progressPercentage}%)
          </span>
        </div>
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-stone-900 h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Slide Cards Accordion/List */}
      <div className="space-y-4">
        {SLIDES.map((slide) => {
          const isDone = checkedSlides.includes(slide.id);
          return (
            <div
              key={slide.id}
              className={`p-5 rounded-xl border transition-all ${
                isDone ? 'bg-white border-stone-300' : 'bg-stone-50/70 border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleSlide(slide.id)}
                    className="mt-1 text-stone-700 hover:text-stone-950 transition-colors"
                    aria-label={`Toggle ${slide.title}`}
                  >
                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-300" />
                    )}
                  </button>
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-stone-950">
                      {slide.title}
                    </h3>
                    <p className="text-sm text-stone-600 mt-0.5 leading-relaxed">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-medium text-stone-400 shrink-0">
                  Slide {slide.id < 10 ? `0${slide.id}` : slide.id}
                </span>
              </div>

              {/* Slide Detail Expanded Content */}
              <div className="mt-4 pt-4 border-t border-stone-100 pl-8 space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-stone-900 block mb-1">Essential Slide Inclusions:</span>
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    {slide.keyElements.map((el, idx) => (
                      <li key={idx}>{el}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-stone-100/70 rounded-lg text-xs">
                    <span className="font-semibold text-stone-900 block mb-0.5">The Investor Filter:</span>
                    <p className="text-stone-600 italic">“{slide.investorFilter}”</p>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-lg text-xs border border-amber-200/60">
                    <span className="font-semibold text-amber-900 block mb-0.5">Critical Pitfall to Avoid:</span>
                    <p className="text-amber-800">{slide.pitfallToAvoid}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
