import React from 'react';
import { Award, Flame, Leaf, CheckCircle2, RotateCcw, Sparkles, TrendingUp, Camera } from 'lucide-react';
import type { UserStats, HistoryRecord } from '../types';
import { IMPACT_METHODOLOGY_NOTE } from '../data/wasteDatabase';

interface DashboardViewProps {
  userStats: UserStats;
  scanHistory: HistoryRecord[];
  onStartNewScan: () => void;
  onResetStats: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userStats,
  scanHistory: _scanHistory,
  onStartNewScan,
  onResetStats
}) => {
  const totalCo2Kg = (userStats.totalImpactCo2eGrams / 1000).toFixed(2);

  const categories = [
    { key: 'recyclable', label: 'Recyclable Plastic & Paper', color: 'bg-blue-600', text: 'text-blue-800' },
    { key: 'wet', label: 'Wet / Organic Composting', color: 'bg-emerald-600', text: 'text-emerald-800' },
    { key: 'dry', label: 'Dry Packaging', color: 'bg-amber-600', text: 'text-amber-800' },
    { key: 'ewaste', label: 'Toxic E-Waste Drop Box', color: 'bg-purple-600', text: 'text-purple-800' }
  ] as const;

  const totalCategoryScans = Object.values(userStats.categoryCounts).reduce((a, b) => a + b, 0) || 1;

  const getPersonalizedInsight = () => {
    if (userStats.totalScans === 0) {
      return `Welcome to EcoSnap! Point your camera at any trash item to get instant AI disposal guidance and start earning Eco Points.`;
    }
    const recyclableCount = userStats.categoryCounts['recyclable'] || 0;
    const ewasteCount = userStats.categoryCounts['ewaste'] || 0;
    if (ewasteCount > 0) {
      return `Awesome work! You've safely diverted ${ewasteCount} toxic e-waste item(s) from municipal landfills to the Library Drop Point.`;
    }
    if (recyclableCount > 0) {
      return `You're on a roll! You've correctly segregated ${recyclableCount} PET & paper recyclables on campus.`;
    }
    return `Building sustainable habits: Scan your canteen waste after every meal to build your streak and earn Eco Points.`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Top Header */}
      <div className="rounded-3xl paper-card border border-stone-300 p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm bg-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>YOUR CAMPUS IMPACT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Campus Sustainability Profile
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
            Personalized waste reduction stats, habit streaks, and carbon offset tracking.
          </p>
        </div>

        <button
          onClick={onStartNewScan}
          className="px-5 py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-xs shadow-sm flex items-center gap-2 shrink-0 transition-all min-h-[44px] cursor-pointer"
        >
          <Camera className="w-4 h-4 text-emerald-300" />
          <span>Scan New Item</span>
        </button>
      </div>

      {/* Personalized AI Insight Callout Card */}
      <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-300 space-y-2">
        <div className="flex items-center gap-2 text-xs font-black text-emerald-900 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>SUSTAINABILITY INSIGHT</span>
        </div>
        <p className="text-sm font-bold text-emerald-950 leading-relaxed">
          "{getPersonalizedInsight()}"
        </p>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl paper-card border border-stone-300 space-y-2 bg-white">
          <div className="flex items-center justify-between text-xs font-black text-emerald-800 uppercase tracking-wider">
            <span>Eco Points</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-black text-stone-900">{userStats.ecoPoints}</div>
          <div className="text-[11px] text-stone-500 font-medium">+10 to +25 pts per item</div>
        </div>

        <div className="p-5 rounded-2xl paper-card border border-stone-300 space-y-2 bg-white">
          <div className="flex items-center justify-between text-xs font-black text-amber-800 uppercase tracking-wider">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-stone-900">{userStats.currentStreakDays} Days</div>
          <div className="text-[11px] text-stone-500 font-medium">Daily campus segregation</div>
        </div>

        <div className="p-5 rounded-2xl paper-card border border-stone-300 space-y-2 bg-white">
          <div className="flex items-center justify-between text-xs font-black text-teal-800 uppercase tracking-wider">
            <span>Disposals</span>
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-3xl font-black text-stone-900">{userStats.confirmedDisposals}</div>
          <div className="text-[11px] text-stone-500 font-medium">Items correctly binned</div>
        </div>

        <div className="p-5 rounded-2xl paper-card border border-stone-300 space-y-2 bg-white">
          <div className="flex items-center justify-between text-xs font-black text-stone-800 uppercase tracking-wider">
            <span>CO₂e Avoided</span>
            <Leaf className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-black text-stone-900">{totalCo2Kg} kg</div>
          <div className="text-[11px] text-stone-500 font-medium">Estimated carbon offset*</div>
        </div>
      </div>

      {/* Category Stream Breakdown Bar */}
      <div className="p-6 rounded-3xl paper-card border border-stone-300 space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Category Disposal Stream Breakdown</span>
          </div>
          <span className="text-xs text-stone-500 font-bold">{userStats.totalScans} Total Scans</span>
        </div>

        {userStats.totalScans === 0 ? (
          <div className="p-6 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-2">
            <p className="text-xs font-bold text-stone-700">No Waste Categorized Yet</p>
            <p className="text-[11px] text-stone-500">
              Scanned waste items will automatically populate your stream breakdown chart.
            </p>
          </div>
        ) : (
          <>
            {/* Stacked Percentage Bar */}
            <div className="h-4 w-full rounded-full bg-stone-100 overflow-hidden flex shadow-inner">
              {categories.map((cat) => {
                const count = userStats.categoryCounts[cat.key] || 0;
                const pct = Math.round((count / totalCategoryScans) * 100);
                if (pct === 0) return null;
                return (
                  <div
                    key={cat.key}
                    style={{ width: `${pct}%` }}
                    className={`${cat.color} h-full transition-all`}
                    title={`${cat.label}: ${count} items (${pct}%)`}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {categories.map((cat) => {
                const count = userStats.categoryCounts[cat.key] || 0;
                const pct = Math.round((count / totalCategoryScans) * 100);
                return (
                  <div key={cat.key} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${cat.color}`} />
                      <span className="text-xs font-bold text-stone-900">{cat.label}</span>
                    </div>
                    <span className="text-xs font-extrabold text-stone-700">{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <p className="text-[11px] text-stone-500 italic leading-snug">
        {IMPACT_METHODOLOGY_NOTE}
      </p>

      {/* Reset Stats Control */}
      {userStats.totalScans > 0 && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              if (window.confirm('Reset local Eco Points and scan history?')) {
                onResetStats();
              }
            }}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-700" />
            <span>Reset Statistics</span>
          </button>
        </div>
      )}
    </div>
  );
};
