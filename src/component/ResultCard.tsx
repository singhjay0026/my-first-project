import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Award,
  Leaf,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Recycle,
  Layers,
  HelpCircle
} from 'lucide-react';
import type { ClassificationResult, WasteItem } from '../types';
import { getBestCampusLocationForCategory } from '../data/campusLocations';
import { IMPACT_METHODOLOGY_NOTE } from '../data/wasteDatabase';
import { LowConfidenceView } from './LowConfidenceView';

interface ResultCardProps {
  result: ClassificationResult;
  onRescan: () => void;
  onConfirmDisposal: (result: ClassificationResult) => void;
  onExploreCampusLocation: (locationId: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onRescan,
  onConfirmDisposal,
  onExploreCampusLocation
}) => {
  const [currentResult, setCurrentResult] = useState<ClassificationResult>(result);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [showDecisionTrail, setShowDecisionTrail] = useState<boolean>(false);

  // Sync state whenever new scan result prop is passed down
  useEffect(() => {
    if (result) {
      setCurrentResult(result);
      setIsConfirmed(false);
      setCompletedSteps({});
    }
  }, [result]);

  // Defensive fallback check
  if (!currentResult || !currentResult.item) {
    return (
      <div className="max-w-md mx-auto p-6 rounded-3xl paper-card text-center space-y-4 shadow-md">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto animate-bounce" />
        <div className="font-extrabold text-stone-900 text-base">Not quite sure what I'm seeing</div>
        <p className="text-xs text-stone-600 font-medium">
          Try moving the camera closer or use better lighting.
        </p>
        <button
          onClick={onRescan}
          className="px-5 py-2.5 rounded-xl bg-[#1b4332] text-white font-extrabold text-xs shadow-sm hover:bg-[#2d6a4f] transition-all cursor-pointer"
        >
          Scan Again
        </button>
      </div>
    );
  }

  // If confidence is LOW (< 55%), render LowConfidenceView safely
  if (currentResult.confidenceLevel === 'low' || currentResult.confidence < 55) {
    return (
      <LowConfidenceView
        result={currentResult}
        onRescan={onRescan}
        onSelectManualItem={(manualItem: WasteItem) => {
          setCurrentResult({
            ...currentResult,
            item: manualItem,
            confidence: 92,
            confidenceLevel: 'high',
            isDemoMode: true,
            modelSourceLabel: 'Manual Category Selection'
          });
        }}
      />
    );
  }

  const { item, confidence, confidenceLevel, modelSourceLabel } = currentResult;
  const categoryStr = (item.category || 'dry').toLowerCase();
  const campusLocation = getBestCampusLocationForCategory(categoryStr, item.material);
  const isEwaste = categoryStr === 'ewaste';

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleConfirmDisposalAction = () => {
    setIsConfirmed(true);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }
    onConfirmDisposal(currentResult);
  };

  const instructionsList = item.instructions && item.instructions.length > 0
    ? item.instructions
    : ['Empty remaining contents', 'Place in designated bin'];

  const decisionTrailNodes = item.decisionTrail && item.decisionTrail.length > 0
    ? item.decisionTrail
    : [];

  const readinessScore = typeof item.disposalReadinessScore === 'number' ? item.disposalReadinessScore : 80;
  const readinessLabel = item.disposalReadinessLabel || (readinessScore >= 80 ? 'READY TO RECYCLE ✓' : 'NEEDS PREPARATION ⚠');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-3xl paper-card border border-stone-300 p-5 sm:p-8 space-y-6 shadow-xl relative overflow-hidden bg-white">
        {/* 1. Header Metadata & Model Source Tag */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-700 text-[11px] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{modelSourceLabel || 'Multimodal AI Vision'}</span>
            </div>
          </div>

          {/* Confidence Score Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 border ${
              confidenceLevel === 'high'
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}
          >
            <span>HOW SURE ARE WE? {confidence}%</span>
          </div>
        </div>

        {/* Multi-Item Detection Alert Banner */}
        {item.multiItemDetected && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-black text-indigo-900 text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4 text-indigo-700" />
              <span>MULTI-OBJECT DETECTED ({item.detectedItemsList?.length || 'Multiple'} ITEMS FOUND)</span>
            </div>
            {item.detectedItemsList && item.detectedItemsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.detectedItemsList.map((objName, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg bg-indigo-100 border border-indigo-300 text-[11px] text-indigo-900 font-bold">
                    {objName}
                  </span>
                ))}
              </div>
            )}
            <div className="text-[11px] text-indigo-800 font-medium italic">
              Please separate these items before disposal into their respective campus bins.
            </div>
          </div>
        )}

        {/* 2. IDENTIFIED OBJECT & MATERIAL CARD */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>WHAT IS IT?</span>
            </span>

            {/* Disposal Readiness Badge */}
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
              readinessScore >= 80
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}>
              DISPOSAL READY: {readinessScore}%
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {item.name || 'Identified Waste Object'}
              </h2>
              {item.material && (
                <div className="text-xs font-bold text-stone-700 flex items-center gap-2">
                  <span className="text-stone-500 uppercase">Material:</span>
                  <span className="px-2 py-0.5 rounded bg-stone-200 border border-stone-300 text-stone-900 font-mono">
                    {item.material}
                  </span>
                </div>
              )}
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-[11px] font-black text-stone-800 shadow-2xs shrink-0">
              {readinessLabel}
            </div>
          </div>
        </div>

        {/* 3. PRIMARY RECOMMENDED DISPOSAL ACTION & BIN ("WHERE DOES THIS GO?") */}
        <div
          className="p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
          style={{
            backgroundColor: categoryStr === 'wet' ? '#f0fdf4' : categoryStr === 'recyclable' ? '#eff6ff' : categoryStr === 'ewaste' ? '#faf5ff' : '#fef2f2',
            borderColor: categoryStr === 'wet' ? '#bbf7d0' : categoryStr === 'recyclable' ? '#bfdbfe' : categoryStr === 'ewaste' ? '#e9d5ff' : '#fecaca'
          }}
        >
          <div className="text-center sm:text-left space-y-1">
            <div className="text-xs uppercase font-black tracking-wider text-stone-600 flex items-center justify-center sm:justify-start gap-1.5">
              <Recycle className="w-4 h-4 text-emerald-800" />
              <span>WHERE DOES THIS GO?</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-wide text-stone-900">
              {item.binType || 'Campus Bin'}
            </div>
            <div className="text-xs font-bold text-stone-700">
              Category: <span className="uppercase text-stone-900 font-extrabold">{categoryStr}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md border-2 border-white"
              style={{ backgroundColor: item.binHex || '#2563eb' }}
            >
              {isEwaste ? '⚡' : categoryStr === 'wet' ? '🌱' : categoryStr === 'recyclable' ? '♻️' : '🗑️'}
            </div>
            <span className="text-[10px] font-black text-stone-800 uppercase tracking-widest">
              {categoryStr}
            </span>
          </div>
        </div>

        {/* 4. PROMINENT E-WASTE HAZARD WARNING */}
        {isEwaste && item.warningMessage && (
          <div className="p-4 rounded-2xl bg-purple-100 border-2 border-purple-400 text-purple-950 text-xs sm:text-sm space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 font-black text-purple-900 uppercase tracking-wider text-sm">
              <AlertTriangle className="w-5 h-5 text-purple-700 animate-bounce" />
              <span>SPECIAL E-WASTE HAZARD WARNING</span>
            </div>
            <p className="leading-relaxed font-semibold text-purple-900">{item.warningMessage}</p>
          </div>
        )}

        {/* 5. "BEFORE YOU BIN IT" PREPARATION CHECKLIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>BEFORE YOU BIN IT</span>
            </h3>
            <span className="text-[11px] text-stone-500 font-medium">Tap steps to complete</span>
          </div>

          <div className="space-y-2">
            {instructionsList.map((step, idx) => {
              const checked = !!completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 cursor-pointer transition-all ${
                    checked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-300'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  )}
                  <span className={checked ? 'line-through text-stone-400 font-medium' : 'font-bold text-stone-900'}>
                    ✓ {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. "WHY THIS BIN?" EXPLANATION CARD */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-900 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>WHY THIS RECOMMENDATION?</span>
            </div>
            <button
              onClick={() => setShowDecisionTrail((prev) => !prev)}
              className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>{showDecisionTrail ? 'Hide Trail' : 'Decision Trail'}</span>
              {showDecisionTrail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-xs text-stone-800 leading-relaxed font-semibold">
            "{item.whyExplanation || `Identified as ${item.material || item.name}. Classified under ${categoryStr} stream per campus waste regulations.`}"
          </p>

          {/* Technical Decision Trail */}
          {showDecisionTrail && (
            <div className="pt-3 border-t border-stone-200 space-y-2">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Rule Engine Evaluation:
              </div>
              <div className="grid grid-cols-1 gap-2">
                {decisionTrailNodes.map((node, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-stone-300 bg-white text-xs flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-[10px] text-stone-500">{node.step}</div>
                      <div className="font-bold text-stone-900 text-[11px]">{node.question}</div>
                    </div>
                    <div className="text-right text-[11px] font-extrabold text-emerald-800 shrink-0">
                      {node.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 7. SMART ALTERNATIVE / SECOND-LIFE TIP ("CAN THIS BE REUSED?") */}
        {item.reusePossibility && item.reusePossibility.trim() !== '' && !isEwaste && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 space-y-1">
            <div className="font-black text-emerald-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <span>♻️ CAN THIS BE REUSED?</span>
            </div>
            <p className="text-emerald-900/90 leading-relaxed font-medium">
              {item.reusePossibility}
            </p>
          </div>
        )}

        {/* 8. NEAREST CAMPUS COLLECTION POINT */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>FIND A DROP-OFF POINT</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-300">
              {campusLocation.distanceMeterText}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <div>
              <div className="text-sm font-extrabold text-stone-900">{campusLocation.name}</div>
              <div className="text-xs text-stone-600 font-medium">{campusLocation.building}</div>
              <div className="text-[11px] text-emerald-800 font-bold mt-0.5">📍 {campusLocation.mapLandmark}</div>
            </div>

            <button
              onClick={() => onExploreCampusLocation(campusLocation.id)}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-extrabold border border-stone-300 flex items-center gap-1.5 transition-colors shrink-0 min-h-[44px] cursor-pointer"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-800" />
            </button>
          </div>
        </div>

        {/* 9. YOUR IMPACT (ECO REWARD + CO2 ESTIMATE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-900 border border-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-emerald-900" />
            </div>
            <div>
              <div className="text-[10px] font-black text-emerald-900 uppercase tracking-wider">YOUR REWARD</div>
              <div className="text-lg font-black text-emerald-950">+{item.ecoPoints || 10} Eco Points</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-200 text-stone-900 border border-stone-400 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-stone-900" />
            </div>
            <div>
              <div className="text-[10px] font-black text-stone-700 uppercase tracking-wider">YOUR IMPACT</div>
              <div className="text-sm font-black text-stone-900">~{item.estimatedImpactCo2eGrams || 100}g CO₂e saved*</div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-stone-500 italic leading-snug">
          {IMPACT_METHODOLOGY_NOTE}
        </p>

        {/* 10. PRIMARY ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-stone-200">
          {!isConfirmed ? (
            <button
              onClick={handleConfirmDisposalAction}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 min-h-[44px] transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>Confirm & Log Disposal</span>
            </button>
          ) : (
            <div className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Logged! +{item.ecoPoints || 10} Eco Points Added</span>
            </div>
          )}

          <button
            onClick={onRescan}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-extrabold border border-stone-300 flex items-center justify-center gap-2 transition-colors min-h-[44px] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-stone-700" />
            <span>Scan Another Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
