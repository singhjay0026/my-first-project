import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { ResultCard } from './components/ResultCard';
import { CampusView } from './components/CampusView';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { Footer } from './components/Footer';

import type { ClassificationResult, HistoryRecord, UserStats, WasteCategory } from './types';
import { getUserStats, getScanHistory, recordScanAndDisposal, clearAllHistoryAndStats } from './services/storageService';
import { preloadAIModel } from './services/aiClassifier';

export function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'dashboard' | 'campus' | 'history'>('scan');
  const [userStats, setUserStats] = useState<UserStats>(getUserStats());
  const [scanHistory, setScanHistory] = useState<HistoryRecord[]>(getScanHistory());

  const [activeResult, setActiveResult] = useState<ClassificationResult | null>(null);
  const [selectedDemoPresetKey, setSelectedDemoPresetKey] = useState<string | null>(null);
  const [targetCampusLocationId, setTargetCampusLocationId] = useState<string | null>(null);
  const [scannedCategoryForCampus, setScannedCategoryForCampus] = useState<WasteCategory | null>(null);

  // Preload browser AI model on startup
  useEffect(() => {
    preloadAIModel();
  }, []);

  // Handle classification output
  const handleClassificationComplete = (result: ClassificationResult) => {
    setActiveResult(result);
    setScannedCategoryForCampus(result.item.category);
    setActiveTab('scan');
  };

  // Confirm disposal & award points
  const handleConfirmDisposal = (result: ClassificationResult) => {
    const { updatedStats } = recordScanAndDisposal(result);
    setUserStats(updatedStats);
    setScanHistory(getScanHistory());
  };

  const handleResetScanner = () => {
    setSelectedDemoPresetKey(null);
    setActiveResult(null);
    setActiveTab('scan');
  };

  const handleClearHistory = () => {
    clearAllHistoryAndStats();
    setUserStats(getUserStats());
    setScanHistory([]);
    setActiveResult(null);
    setScannedCategoryForCampus(null);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Primary Responsive Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userStats={userStats}
        onOpenScanner={handleResetScanner}
      />

      {/* Main Page Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* TAB 1: SCANNER & RESULT DECISION ENGINE */}
        {activeTab === 'scan' && (
          <div className="space-y-6">
            {!activeResult ? (
              <LandingHero
                onClassificationComplete={handleClassificationComplete}
                selectedDemoKey={selectedDemoPresetKey}
                onExploreCampus={() => setActiveTab('campus')}
              />
            ) : (
              <ResultCard
                result={activeResult}
                onRescan={handleResetScanner}
                onConfirmDisposal={handleConfirmDisposal}
                onExploreCampusLocation={(locId: string) => {
                  setTargetCampusLocationId(locId);
                  setActiveTab('campus');
                }}
              />
            )}
          </div>
        )}

        {/* TAB 2: ECO DASHBOARD / YOUR IMPACT */}
        {activeTab === 'dashboard' && (
          <DashboardView
            userStats={userStats}
            scanHistory={scanHistory}
            onStartNewScan={handleResetScanner}
            onResetStats={handleClearHistory}
          />
        )}

        {/* TAB 3: CAMPUS COLLECTION FINDER */}
        {activeTab === 'campus' && (
          <CampusView
            initialSelectedId={targetCampusLocationId}
            scannedCategory={scannedCategoryForCampus}
            onSelectLocationForScan={handleResetScanner}
          />
        )}

        {/* TAB 4: SCAN HISTORY */}
        {activeTab === 'history' && (
          <HistoryView
            scanHistory={scanHistory}
            onClearHistory={handleClearHistory}
            onSelectRecord={(record: HistoryRecord) => {
              setActiveResult(record.result);
              setScannedCategoryForCampus(record.result.item.category);
              setActiveTab('scan');
            }}
          />
        )}
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}

export default App;
