import React, { useState } from 'react';
import { GeneratedIdea } from '../types/blog';
import {
  Sparkles,
  Zap,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  Bookmark,
  Check,
  Copy,
  Download,
  RotateCcw,
  ShieldAlert,
  Calendar,
  Clock,
  Code2,
} from 'lucide-react';

interface IdeaGeneratorProps {
  onSaveIdea: (idea: GeneratedIdea) => void;
  savedIdeas: GeneratedIdea[];
}

const INTERESTS = [
  'B2B SaaS & Automation',
  'AI & Developer Tooling',
  'FinTech & Payment Workflows',
  'Boring & Offline Services',
  'E-Commerce & DTC Operations',
  'HealthTech & Wellness Clinics',
  'CleanTech & Energy Efficiency',
  'Creator Economy & Micro-Media',
  'Education & EdTech for Pros',
  'Logistics & Trade Subcontractors',
];

const BUDGETS = [
  { label: 'Bootstrapped ($0 – $500)', value: '$0 - $500 (Lean sweat equity)' },
  { label: 'Seed Capital ($500 – $5,000)', value: '$500 - $5,000 (Low risk initial pilot)' },
  { label: 'Growth Budget ($5,000 – $25,000)', value: '$5,000 - $25,000 (Serious MVP runway)' },
  { label: 'Venture Scale ($25,000+)', value: '$25,000+ (Full-time capital deployment)' },
];

const SKILL_SETS = [
  'Full-Stack Web/Mobile Coding',
  'Growth & Performance Marketing',
  'UI/UX Product Design',
  'Operations, Logistics & Systems',
  'Enterprise Sales & Cold Outreach',
  'Industry Domain Expertise (Non-technical)',
];

const AUDIENCES = [
  'College Students & Campus Operators',
  'Solo Builders & Indie Hackers',
  'Established Small Business Owners',
  'Venture-Scale Founders',
  'Side Hustlers (10h/week)',
];

export const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ onSaveIdea, savedIdeas }) => {
  const [selectedInterest, setSelectedInterest] = useState(INTERESTS[0]);
  const [selectedBudget, setSelectedBudget] = useState(BUDGETS[0].value);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([SKILL_SETS[0]]);
  const [selectedAudience, setSelectedAudience] = useState(AUDIENCES[0]);
  const [commitment, setCommitment] = useState('Full-Time Blitz');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<GeneratedIdea | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/generate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interest: selectedInterest,
          budget: selectedBudget,
          skills: selectedSkills.join(', '),
          audience: selectedAudience,
          commitment,
          additionalNotes: additionalNotes.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data && data.idea) {
        const fullIdea: GeneratedIdea = {
          ...data.idea,
          dateGenerated: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        };
        setCurrentIdea(fullIdea);
      } else {
        throw new Error('Malformed idea payload');
      }
    } catch (err: any) {
      console.error('Idea generation error:', err);
      setErrorMessage('Could not generate idea from server. Falling back to local idea engine.');
      // Fallback local generator
      const fallback: GeneratedIdea = {
        conceptName: 'AuditSync AI',
        tagline: 'Autonomous Contract & Vendor Renewal Guardian for Lean Startups',
        problemStatement: 'Early-stage founders lose thousands each quarter to unreviewed software seats, missed cancellation notices, and hidden price hikes.',
        targetCustomer: `${selectedAudience} with a focus on ${selectedInterest}`,
        valueProposition: 'Direct-to-email webhook listener that parses invoices, calculates duplicate tool usage, and drafts cancellation letters in one click.',
        monetizationModel: 'Free tier up to 5 subscriptions; $29/mo flat rate for teams.',
        expectedGrossMargin: '86%',
        mvpLaunchPlan: [
          { week: 'Week 1', goal: 'Build landing page with interactive vendor savings calculator and waitlist.' },
          { week: 'Week 2', goal: 'Deploy email parser for Stripe and PayPal renewal notices.' },
          { week: 'Week 3', goal: 'Assemble dashboard with 30-day cancellation alert notifications.' },
          { week: 'Week 4', goal: 'Onboard 10 founders from startup communities and convert 3 paid users.' },
        ],
        recommendedTechStack: ['React / Vite', 'Node.js Express', 'Gemini Flash API', 'Stripe Payments'],
        unfairAdvantage: `Tailored for your budget of ${selectedBudget} and ${selectedSkills.join(', ')} skills.`,
        potentialRisksAndMitigations: 'Privacy considerations: resolve by operating zero data persistence for full raw email bodies.',
        dateGenerated: new Date().toLocaleDateString('en-US'),
      };
      setCurrentIdea(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!currentIdea) return;
    const text = `
STARTUP CONCEPT: ${currentIdea.conceptName}
Tagline: ${currentIdea.tagline}
Target Customer: ${currentIdea.targetCustomer}
Problem: ${currentIdea.problemStatement}
Value Proposition: ${currentIdea.valueProposition}
Monetization: ${currentIdea.monetizationModel} (Gross Margin: ${currentIdea.expectedGrossMargin})

4-WEEK MVP PLAN:
${currentIdea.mvpLaunchPlan.map((p) => `- ${p.week}: ${p.goal}`).join('\n')}

Tech Stack: ${currentIdea.recommendedTechStack.join(', ')}
Unfair Advantage: ${currentIdea.unfairAdvantage}
Risks & Mitigations: ${currentIdea.potentialRisksAndMitigations}
    `.trim();

    navigator.clipboard?.writeText(text);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  const handleSave = () => {
    if (!currentIdea) return;
    onSaveIdea(currentIdea);
    setIsSaved(true);
  };

  const handleDownloadCanvas = () => {
    if (!currentIdea) return;
    const content = `=====================================================
STARTUP SPHERE — FOUNDER LAUNCH CANVAS
Generated: ${currentIdea.dateGenerated || new Date().toLocaleDateString()}
=====================================================

1. CONCEPT NAME: ${currentIdea.conceptName}
2. TAGLINE: ${currentIdea.tagline}

3. PROBLEM STATEMENT:
${currentIdea.problemStatement}

4. TARGET CUSTOMER:
${currentIdea.targetCustomer}

5. CORE VALUE PROPOSITION:
${currentIdea.valueProposition}

6. MONETIZATION & UNIT ECONOMICS:
Model: ${currentIdea.monetizationModel}
Estimated Gross Margin: ${currentIdea.expectedGrossMargin}

7. 30-DAY MVP LAUNCH ROADMAP:
${currentIdea.mvpLaunchPlan.map((step) => `[${step.week}] ${step.goal}`).join('\n')}

8. RECOMMENDED TECH STACK & TOOLS:
${currentIdea.recommendedTechStack.join(' • ')}

9. UNFAIR ADVANTAGE:
${currentIdea.unfairAdvantage}

10. RISKS & OPERATIONAL MITIGATION:
${currentIdea.potentialRisksAndMitigations}

-----------------------------------------------------
Powered by Startup Sphere Intelligence Studio
-----------------------------------------------------`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentIdea.conceptName.toLowerCase().replace(/\s+/g, '-')}-launch-canvas.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header section */}
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Interactive Founder Feature</span>
          <span aria-hidden="true">·</span>
          <span>Powered by Gemini AI</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 leading-tight mb-4">
          AI Business Idea Generator
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          Suggests high-leverage, commercially viable business concepts tailored precisely to your domain interests, available budget, and personal skill stack.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between mb-5">
            <span>Founder Parameters</span>
            <span className="text-xs font-normal text-stone-500">Step 1 of 1</span>
          </h2>

          <div className="space-y-6">
            
            {/* Interest Area */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                1. Industry / Problem Space
              </label>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                {INTERESTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                2. Available Upfront Budget
              </label>
              <div className="space-y-2">
                {BUDGETS.map((b) => (
                  <label
                    key={b.value}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      selectedBudget === b.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="budget"
                      value={b.value}
                      checked={selectedBudget === b.value}
                      onChange={() => setSelectedBudget(b.value)}
                      className="sr-only"
                    />
                    <DollarSign className={`w-3.5 h-3.5 ${selectedBudget === b.value ? 'text-amber-300' : 'text-stone-400'}`} />
                    <span className="font-medium">{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Core Skills (Multi-select) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                3. Your Core Skills (Select up to 3)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_SETS.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all text-left ${
                        active
                          ? 'bg-amber-100/80 border-amber-300 text-amber-950 font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audience Persona */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                4. Founder Profile
              </label>
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                {AUDIENCES.map((aud) => (
                  <option key={aud} value={aud}>
                    {aud}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Commitment */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                5. Weekly Time Commitment
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Side Hustle (10-15h)', 'Full-Time Blitz (40h+)'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setCommitment(opt)}
                    className={`py-2 px-3 rounded-lg border font-medium transition-colors ${
                      commitment === opt
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Additional Constraints (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Must generate cash within 30 days, No-code preferred"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Submit Action */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 px-4 text-xs font-semibold tracking-wide text-white bg-stone-900 rounded-xl hover:bg-stone-800 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Synthesizing Market Intelligence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Business Concept</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Generated Output or Empty State (7 cols) */}
        <div className="lg:col-span-7">
          {errorMessage && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[480px]">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-amber-700 animate-pulse" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
                Architecting Venture Proposal
              </h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                Analyzing competitive whitespace in {selectedInterest}, calculating target unit economics for {selectedBudget}, and assembling 4-week MVP milestones...
              </p>
            </div>
          ) : currentIdea ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
              
              {/* Concept Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                    <span className="text-amber-800">Generated Proposition</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentIdea.dateGenerated}</span>
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950">
                    {currentIdea.conceptName}
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-stone-700 mt-1">
                    {currentIdea.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 border border-stone-200 rounded-lg hover:border-stone-400 bg-white text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    title="Copy brief to clipboard"
                  >
                    {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBrief ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className={`p-2 border rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      isSaved
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'border-stone-200 hover:border-stone-400 text-stone-700'
                    }`}
                    title="Save to My Ideas"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={handleDownloadCanvas}
                    className="p-2 border border-stone-200 rounded-lg hover:border-stone-400 bg-white text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    title="Download complete Launch Canvas TXT"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>

              {/* Problem & Value Prop Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                    Market Pain Point
                  </span>
                  <p className="text-sm text-stone-800 leading-relaxed">
                    {currentIdea.problemStatement}
                  </p>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 block mb-1">
                    Value Proposition & Wedge
                  </span>
                  <p className="text-sm text-stone-800 leading-relaxed">
                    {currentIdea.valueProposition}
                  </p>
                </div>
              </div>

              {/* Target Customer & Economics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                    Target Initial Buyer
                  </span>
                  <p className="text-sm font-medium text-stone-900">
                    {currentIdea.targetCustomer}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                    Monetization & Estimated Gross Margin
                  </span>
                  <p className="text-sm font-medium text-stone-900">
                    {currentIdea.monetizationModel} <span className="text-emerald-700 font-mono-num font-bold">({currentIdea.expectedGrossMargin} Margin)</span>
                  </p>
                </div>
              </div>

              {/* 30-Day MVP Milestone Roadmap */}
              <div className="pt-4 border-t border-stone-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  30-Day Lean MVP Launch Plan
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentIdea.mvpLaunchPlan.map((step, idx) => (
                    <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200/70 text-xs">
                      <span className="font-mono font-bold text-stone-900 block mb-1 uppercase tracking-wider">
                        {step.week}
                      </span>
                      <p className="text-stone-700 leading-relaxed">{step.goal}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack & Unfair Advantage */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-stone-400" />
                    Recommended Tech Stack & APIs
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {currentIdea.recommendedTechStack.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-stone-100 border border-stone-200 rounded text-stone-800 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                  <span className="font-semibold text-stone-900 block mb-0.5">Your Unfair Advantage:</span>
                  <p className="text-stone-700 leading-relaxed">{currentIdea.unfairAdvantage}</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                  <span className="font-semibold text-stone-900 block mb-0.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                    Key Risk & Mitigation Protocol:
                  </span>
                  <p className="text-stone-700 leading-relaxed">{currentIdea.potentialRisksAndMitigations}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 border border-stone-300 hover:border-stone-400 rounded-lg bg-white flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Generate Alternative Angle
                </button>
              </div>

            </div>
          ) : (
            /* Default Ready State: Curated Startup Archetypes */
            <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 block mb-1">
                  Ready-to-Explore Ideas
                </span>
                <h3 className="font-editorial text-2xl font-bold text-stone-950 mb-2">
                  Curated Breakthrough Concepts
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Select parameters on the left and click Generate, or click any archetype below to preview an instant launch blueprint.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: 'SubContractor PayGate',
                    cat: 'Logistics & Trade Subcontractors',
                    budget: '$500',
                    margin: '82%',
                    desc: 'SMS-based lien waiver notarization & instant milestone deposit release for trade contractors.',
                  },
                  {
                    name: 'VendorPulse AI',
                    cat: 'B2B SaaS & Automation',
                    budget: '$1,200',
                    margin: '88%',
                    desc: 'Autonomous contract renewal auditor flagging auto-rebills 45 days early with negotiation scripts.',
                  },
                  {
                    name: 'ClinicWaste Audit',
                    cat: 'HealthTech & Wellness Clinics',
                    budget: '$450',
                    margin: '79%',
                    desc: 'Chain-of-custody bio-waste regulatory compliance PDF generator for dental & veterinary clinics.',
                  },
                  {
                    name: 'ZoningAlert Pro',
                    cat: 'Boring & Offline Services',
                    budget: '$800',
                    margin: '85%',
                    desc: 'Automated municipality meeting scraper alerting commercial real estate developers of rezoning filings.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedInterest(item.cat);
                      handleGenerate();
                    }}
                    className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                        <span className="font-semibold text-stone-800">{item.cat}</span>
                        <span className="font-mono-num text-emerald-700 font-bold">{item.margin} Margin</span>
                      </div>
                      <h4 className="font-editorial text-base font-bold text-stone-950 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
                      <span>Est. Budget: {item.budget}</span>
                      <span className="font-semibold text-stone-900 flex items-center gap-1">
                        Load Blueprint <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
