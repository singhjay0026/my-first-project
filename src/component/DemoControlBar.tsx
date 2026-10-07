import React from 'react';
import { Terminal } from 'lucide-react';

interface DemoControlBarProps {
  onSelectDemoItem: (itemKey: string) => void;
  selectedDemoKey?: string | null;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  onSelectDemoItem,
  selectedDemoKey
}) => {
  const demoPresets = [
    { key: 'plastic-water-bottle', label: '🥤 Plastic Bottle', category: 'Recyclable' },
    { key: 'aa-battery', label: '🔋 AA Battery', category: 'E-Waste Alert!' },
    { key: 'canteen-food-scraps', label: '🍎 Food Waste', category: 'Wet Organic' },
    { key: 'electronic-accessory', label: '🔌 Earbuds & Cable', category: 'E-Waste' },
    { key: 'paper-cardboard-box', label: '📦 Cardboard Box', category: 'Paper' },
    { key: 'uncertain-mixed-item', label: '❓ Low Confidence Item', category: 'Safety Test' }
  ];

  return (
    <div className="w-full bg-[#1c1917] text-white border-b border-stone-700 px-3 py-2 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Title */}
        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 shrink-0">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>JUDGE DEMO CONSOLE:</span>
          <span className="hidden lg:inline text-[11px] text-stone-300 font-medium">
            (Controlled Evaluation Scenarios)
          </span>
        </div>

        {/* Preset Triggers */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full md:w-auto">
          {demoPresets.map((preset) => {
            const isSelected = selectedDemoKey === preset.key;
            const isEwaste = preset.key === 'aa-battery';
            const isLowConf = preset.key === 'uncertain-mixed-item';

            return (
              <button
                key={preset.key}
                onClick={() => onSelectDemoItem(preset.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all min-h-[34px] cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-stone-950 font-black shadow-md scale-105'
                    : isEwaste
                    ? 'bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500/50'
                    : isLowConf
                    ? 'bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-500/50'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600'
                }`}
              >
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
