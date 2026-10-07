import React from 'react';
import { MapPin, Leaf } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import type { ClassificationResult } from '../types';

interface LandingHeroProps {
  onClassificationComplete: (result: ClassificationResult) => void;
  selectedDemoKey?: string | null;
  onExploreCampus?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onClassificationComplete,
  selectedDemoKey,
  onExploreCampus
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* ==================================================
          1. HERO SECTION WITH EMBEDDED LIVE CAMERA SCANNER
      ================================================== */}
      <section className="relative overflow-hidden rounded-3xl paper-card border border-stone-300 p-5 sm:p-8 shadow-lg bg-[#fcfbfa]">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold tracking-wide">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>CAMPUS WASTE DISPOSAL ASSISTANT</span>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              Not sure where it goes?
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-medium">
              Point your camera at an item. EcoSnap tells you what it is, where it belongs, and what to do before you bin it.
            </p>
          </div>

          {/* CORE PRODUCT: EMBEDDED LIVE CAMERA SCANNER */}
          <div className="pt-2">
            <CameraScanner
              onClassificationComplete={onClassificationComplete}
              selectedDemoKey={selectedDemoKey}
            />
          </div>

          <p className="text-xs text-stone-500 font-medium italic">
            Works with everyday campus waste (notebooks, pens, plastic bottles, snack packets, batteries, food scraps).
          </p>
        </div>
      </section>

      {/* ==================================================
          2. HOW IT WORKS (4 SIMPLE HUMAN STEPS)
      ================================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
            SIMPLE DISPOSAL GUIDANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            How EcoSnap works in 4 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 01 */}
          <div className="p-5 rounded-2xl paper-card border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-emerald-300 font-black text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="text-base font-bold text-stone-900">Point</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Hold any waste item in front of your camera or upload a quick photo.
            </p>
          </div>

          {/* Step 02 */}
          <div className="p-5 rounded-2xl paper-card border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-emerald-300 font-black text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="text-base font-bold text-stone-900">Identify</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Multimodal AI vision identifies the object and underlying material composition.
            </p>
          </div>

          {/* Step 03 */}
          <div className="p-5 rounded-2xl paper-card border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-emerald-300 font-black text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="text-base font-bold text-stone-900">Dispose</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Get immediate visual guidance: Wet, Dry, Recyclable, or E-Waste.
            </p>
          </div>

          {/* Step 04 */}
          <div className="p-5 rounded-2xl paper-card border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-emerald-300 font-black text-sm flex items-center justify-center">
              04
            </div>
            <h3 className="text-base font-bold text-stone-900">Make an impact</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Earn Eco Points, build active streaks, and estimate CO₂e saved on campus.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. FOUR STREAM DISPOSAL GUIDANCE MATRIX
      ================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl paper-card border border-stone-300 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
            ORGANIZER DISPOSAL RULES
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900">
            Recognized Campus Stream Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recyclable Stream */}
          <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900">RECYCLABLE</span>
              <span className="text-xl">♻️</span>
            </div>
            <div className="text-sm font-bold text-blue-950">Blue Recycling Bin</div>
            <p className="text-xs text-blue-800/90 leading-snug">
              Clean PET bottles, paper, notebooks, cardboard, aluminum cans, glass.
            </p>
          </div>

          {/* Wet Organic Stream */}
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900">WET WASTE</span>
              <span className="text-xl">🌱</span>
            </div>
            <div className="text-sm font-bold text-emerald-950">Green Organic Bin</div>
            <p className="text-xs text-emerald-800/90 leading-snug">
              Banana peels, food scraps, fruit waste, tea bags, compostable items.
            </p>
          </div>

          {/* Dry Stream */}
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-red-900">DRY WASTE</span>
              <span className="text-xl">🗑️</span>
            </div>
            <div className="text-sm font-bold text-red-950">Red / Black Dry Bin</div>
            <p className="text-xs text-red-800/90 leading-snug">
              Pens, chocolate wrappers, chips packets, soiled napkins, plastic spoons.
            </p>
          </div>

          {/* E-Waste Stream */}
          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900">E-WASTE</span>
              <span className="text-xl">⚡</span>
            </div>
            <div className="text-sm font-bold text-purple-950">E-Waste Drop Point</div>
            <p className="text-xs text-purple-800/90 leading-snug">
              Batteries, chargers, cables, earphones, mouse, small electronics.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. YOUR CAMPUS IMPACT PREVIEW
      ================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#1b4332] text-white space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              YOUR IMPACT
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Habit Tracker & Campus Gamification
            </h2>
          </div>

          {onExploreCampus && (
            <button
              onClick={onExploreCampus}
              className="px-4 py-2.5 rounded-xl bg-white text-stone-900 font-extrabold text-xs flex items-center gap-2 hover:bg-stone-100 transition-colors shadow-xs cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Find Drop-Off Point</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-1">
            <div className="text-xs text-emerald-200 font-bold uppercase">Eco Points</div>
            <div className="text-3xl font-black text-white">+12 / scan</div>
            <div className="text-[11px] text-emerald-200/80">Earn points for correct campus binning</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-1">
            <div className="text-xs text-emerald-200 font-bold uppercase">Streak System</div>
            <div className="text-3xl font-black text-white">Daily Streak</div>
            <div className="text-[11px] text-emerald-200/80">Build sustainable disposal habits</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-1">
            <div className="text-xs text-emerald-200 font-bold uppercase">Estimated CO₂e</div>
            <div className="text-3xl font-black text-white">~18 g saved</div>
            <div className="text-[11px] text-emerald-200/80">Estimated carbon offset per item</div>
          </div>
        </div>
      </section>
    </div>
  );
};
