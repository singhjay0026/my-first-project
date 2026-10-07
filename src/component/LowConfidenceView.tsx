import React from 'react';
import { RefreshCw, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import type { ClassificationResult, WasteItem } from '../types';
import { WASTE_ITEMS } from '../data/wasteDatabase';

interface LowConfidenceViewProps {
  result: ClassificationResult;
  onRescan: () => void;
  onSelectManualItem: (item: WasteItem) => void;
}

export const LowConfidenceView: React.FC<LowConfidenceViewProps> = ({
  result,
  onRescan,
  onSelectManualItem
}) => {
  return (
    <div className="max-w-xl mx-auto rounded-3xl paper-card border border-stone-300 p-6 sm:p-8 space-y-6 bg-white shadow-xl">
      {/* Safety & Trust Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center shrink-0 mt-1">
          <ShieldAlert className="w-6 h-6 text-amber-700" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold mb-1">
            <span>{result.confidence}% Confidence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">Not quite sure what I'm seeing</h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1 leading-relaxed">
            Try moving the item closer or improving the lighting. EcoSnap avoids guessing when confidence is below 70% to ensure correct disposal.
          </p>
        </div>
      </div>

      {/* Verification Hints */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
        <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Tips for Better Recognition:</span>
        </h4>
        <ul className="text-xs text-stone-700 font-medium space-y-1.5 list-disc list-inside">
          <li>Keep the entire item centered within the scanner frame.</li>
          <li>Improve room lighting or turn item toward camera.</li>
          <li>Show recognizable branding, texture, cap, or material label.</li>
        </ul>
      </div>

      {/* Suggested Categories / Manual Select */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
          Or select category manually below:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {WASTE_ITEMS.slice(0, 6).map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectManualItem(item)}
              className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-left border border-stone-200 hover:border-emerald-600 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-extrabold text-stone-900 group-hover:text-emerald-900 transition-colors">
                  {item.name}
                </div>
                <div className="text-[11px] text-stone-500 font-medium">{item.binType}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-900 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onRescan}
          className="flex-1 py-3.5 px-6 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-emerald-300" />
          <span>Scan Again</span>
        </button>
      </div>
    </div>
  );
};
