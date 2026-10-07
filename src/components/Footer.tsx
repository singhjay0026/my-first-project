import React from 'react';
import { Leaf, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-stone-100 border-t border-stone-200 mt-12 py-8 px-4 text-stone-600 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shadow-2xs">
            <Leaf className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="font-extrabold text-stone-900 text-sm">EcoSnap Campus Guide</div>
            <div className="text-[11px] text-stone-500 font-medium">Smart Waste Disposal Decision Assistant</div>
          </div>
        </div>

        {/* Hackathon Disclaimer */}
        <div className="text-center md:text-right space-y-1">
          <div className="flex items-center justify-center md:justify-end gap-1.5 font-bold text-stone-800">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Campus Sustainability Initiative • College Edition</span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Point. Know. Dispose better. Built with React, Vite & Multimodal Vision AI.
          </p>
        </div>
      </div>
    </footer>
  );
};
