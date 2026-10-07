import React from 'react';
import { Camera, LayoutDashboard, MapPin, History, Flame, Award, Leaf } from 'lucide-react';
import type { UserStats } from '../types';

interface NavbarProps {
  activeTab: 'scan' | 'dashboard' | 'campus' | 'history';
  setActiveTab: (tab: 'scan' | 'dashboard' | 'campus' | 'history') => void;
  userStats: UserStats;
  onOpenScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userStats,
  onOpenScanner
}) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#fbf9f5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('scan')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1b4332] text-white shadow-sm group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-stone-900">
                  EcoSnap
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Campus Guide
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">Point. Know. Dispose better.</p>
            </div>
          </div>

          {/* User Gamification Pills & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Badge */}
            <div
              title={`${userStats.currentStreakDays}-day active recycling streak!`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs"
            >
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>{userStats.currentStreakDays}d Streak</span>
            </div>

            {/* Eco Points Badge */}
            <div
              onClick={() => setActiveTab('dashboard')}
              title="Click to view Eco Dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold cursor-pointer hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <Award className="w-4 h-4 text-emerald-700" />
              <span>{userStats.ecoPoints} Eco Points</span>
            </div>

            {/* Quick Primary Scan CTA Button */}
            <button
              onClick={onOpenScanner}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-xs tracking-wide shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span>Scan your item</span>
            </button>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center justify-center gap-2 mt-2 pt-2 border-t border-stone-200/60 max-w-xl mx-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Your Impact</span>
          </button>

          <button
            onClick={() => setActiveTab('campus')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'campus'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Campus Points</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Scan History</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === 'scan'
              ? 'text-[#1b4332] bg-emerald-100/70 font-extrabold'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px]">Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === 'dashboard'
              ? 'text-[#1b4332] bg-emerald-100/70 font-extrabold'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Impact</span>
        </button>

        <button
          onClick={() => setActiveTab('campus')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === 'campus'
              ? 'text-[#1b4332] bg-emerald-100/70 font-extrabold'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px]">Campus</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'text-[#1b4332] bg-emerald-100/70 font-extrabold'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px]">History</span>
        </button>
      </nav>
    </>
  );
};
