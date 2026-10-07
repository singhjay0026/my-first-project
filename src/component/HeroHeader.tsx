import React from 'react';
import { Camera, Upload, MapPin, Sparkles, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';

interface HeroHeaderProps {
  onStartScan: () => void;
  onUploadClick: () => void;
  onExploreCampus: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onStartScan,
  onUploadClick,
  onExploreCampus
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-emerald-500/20 p-6 md:p-10 mb-8 shadow-2xl">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Product Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>AI-POWERED CAMPUS DISPOSAL DECISION ASSISTANT</span>
        </div>

        {/* Hero Headline (Communicates in 3 seconds) */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Scan it. Know it.{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Dispose right.
          </span>
        </h1>

        {/* Supporting Paragraph */}
        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Don't guess which bin to use. EcoSnap analyzes campus waste, provides exact pre-disposal preparation steps, warns about hazardous e-waste, and guides you to nearby campus drop-off points.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          {/* Main Scan Button */}
          <button
            onClick={onStartScan}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-base tracking-wide shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-3 active:scale-95 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-950/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
            </div>
            <span>Scan Waste Item</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Upload Fallback Button */}
          <button
            onClick={onUploadClick}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Upload Photo</span>
          </button>

          {/* Campus Points Button */}
          <button
            onClick={onExploreCampus}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Campus Collection</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-left">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-200">Confidence Safe</div>
              <div className="text-[11px] text-slate-400">Prevents wrong advice</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5">
            <Leaf className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-200">Pre-Disposal Steps</div>
              <div className="text-[11px] text-slate-400">Rinse, separate & crush</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-200">Campus Hub Mode</div>
              <div className="text-[11px] text-slate-400">Location drop-off advice</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-200">Toxic E-Waste Alert</div>
              <div className="text-[11px] text-slate-400">Special bin protection</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
