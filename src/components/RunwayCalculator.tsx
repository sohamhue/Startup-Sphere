import React, { useState } from 'react';
import { DollarSign, Clock, AlertTriangle, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';

export const RunwayCalculator: React.FC = () => {
  const [cashBalance, setCashBalance] = useState<number>(150000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(12000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(26000);
  const [momGrowth, setMomGrowth] = useState<number>(8);

  const netBurn = Math.max(0, monthlyExpenses - monthlyRevenue);
  const isDefaultAlive = monthlyRevenue >= monthlyExpenses;

  // Calculate runway months without growth
  const simpleRunwayMonths = netBurn > 0 ? cashBalance / netBurn : 999;

  // Calculate dynamic runway with MoM revenue growth
  let simulatedCash = cashBalance;
  let simulatedRev = monthlyRevenue;
  let dynamicMonths = 0;
  const maxSimulation = 60; // 5 years cap

  while (simulatedCash > 0 && dynamicMonths < maxSimulation) {
    const currentBurn = Math.max(0, monthlyExpenses - simulatedRev);
    if (currentBurn === 0) {
      dynamicMonths = 999; // Default Alive!
      break;
    }
    simulatedCash -= currentBurn;
    simulatedRev *= 1 + momGrowth / 100;
    dynamicMonths++;
  }

  const effectiveMonths = dynamicMonths === 999 ? 'Infinite (Default Alive)' : dynamicMonths.toFixed(1);

  // Calculate Zero Cash Date
  const calculateZeroDate = (months: number) => {
    if (months >= 999) return 'Self-Sustaining';
    const date = new Date();
    date.setMonth(date.getMonth() + Math.floor(months));
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const zeroCashDate = calculateZeroDate(dynamicMonths);

  const getStatus = () => {
    if (isDefaultAlive || dynamicMonths >= 999) {
      return {
        label: 'Default Alive',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        advice: 'Your revenue growth outpaces your expenses. You have control over your own destiny without being forced to raise dilutive capital.',
      };
    }
    if (dynamicMonths < 6) {
      return {
        label: 'Critical Runway (< 6 Months)',
        color: 'text-red-700 bg-red-50 border-red-200',
        advice: 'Immediately institute headcount freezes, renegotiate vendor contracts, or launch a bridge fundraising note. You have less than 180 days to reach cash neutrality.',
      };
    }
    if (dynamicMonths < 12) {
      return {
        label: 'Caution Runway (6 – 12 Months)',
        color: 'text-amber-800 bg-amber-50 border-amber-200',
        advice: 'Begin preparing your Series Seed or Series A data room now. Institutional fundraising takes 3 to 5 months from initial pitch to wire transfer.',
      };
    }
    return {
      label: 'Healthy Runway (12+ Months)',
      color: 'text-stone-800 bg-stone-100 border-stone-200',
      advice: 'You have sufficient breathing room to experiment with product iterations and new distribution channels without immediate existential pressure.',
    };
  };

  const status = getStatus();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 block mb-1">
          Founder Financial Toolkit
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-950 mb-3">
          Startup Runway & Burn Rate Calculator
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-normal">
          Model your capital depletion, net monthly burn, and projected zero-cash horizon with compounding revenue growth.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Cash Balance */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              <span>Cash Balance in Bank</span>
              <span className="font-mono-num text-stone-900 font-bold">${cashBalance.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={1000000}
              step={5000}
              value={cashBalance}
              onChange={(e) => setCashBalance(Number(e.target.value))}
              className="w-full accent-stone-900"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono-num mt-1">
              <span>$5k</span>
              <span>$500k</span>
              <span>$1M+</span>
            </div>
          </div>

          {/* Monthly Gross Expenses */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              <span>Monthly Gross Expenses (Payroll + Ops)</span>
              <span className="font-mono-num text-stone-900 font-bold">${monthlyExpenses.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min={2000}
              max={150000}
              step={1000}
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="w-full accent-stone-900"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono-num mt-1">
              <span>$2k</span>
              <span>$75k</span>
              <span>$150k</span>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              <span>Current Monthly Revenue (MRR)</span>
              <span className="font-mono-num text-stone-900 font-bold">${monthlyRevenue.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min={0}
              max={100000}
              step={1000}
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="w-full accent-stone-900"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono-num mt-1">
              <span>$0</span>
              <span>$50k</span>
              <span>$100k</span>
            </div>
          </div>

          {/* MoM Revenue Growth */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              <span>Expected MoM Revenue Growth</span>
              <span className="font-mono-num text-stone-900 font-bold">{momGrowth}% / month</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={momGrowth}
              onChange={(e) => setMomGrowth(Number(e.target.value))}
              className="w-full accent-stone-900"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono-num mt-1">
              <span>0%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
          </div>

        </div>

        {/* Calculation Output Cards */}
        <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
              Net Monthly Burn
            </span>
            <span className="font-editorial text-2xl font-bold text-stone-950 font-mono-num mt-1 block">
              ${netBurn.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500 mt-0.5 block">Expenses minus revenue</span>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
              Projected Runway
            </span>
            <span className="font-editorial text-2xl font-bold text-stone-950 font-mono-num mt-1 block">
              {effectiveMonths} {dynamicMonths !== 999 && 'Months'}
            </span>
            <span className="text-xs text-stone-500 mt-0.5 block">Factoring {momGrowth}% MoM growth</span>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
              Zero-Cash Date
            </span>
            <span className="font-editorial text-2xl font-bold text-stone-950 mt-1 block">
              {zeroCashDate}
            </span>
            <span className="text-xs text-stone-500 mt-0.5 block">Estimated depletion point</span>
          </div>
        </div>

        {/* Status Callout */}
        <div className={`p-5 rounded-xl border ${status.color}`}>
          <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
            {isDefaultAlive ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>Runway Assessment: {status.label}</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">{status.advice}</p>
        </div>

      </div>
    </div>
  );
};
