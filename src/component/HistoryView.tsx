import React, { useState } from 'react';
import { History, Search, Trash2, Calendar, ArrowUpRight, Filter } from 'lucide-react';
import type { HistoryRecord, WasteCategory } from '../types';

interface HistoryViewProps {
  scanHistory: HistoryRecord[];
  onClearHistory: () => void;
  onSelectRecord: (record: HistoryRecord) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  scanHistory,
  onClearHistory,
  onSelectRecord
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory | 'all'>('all');

  const filteredHistory = scanHistory.filter((record) => {
    const category = record.result.item.category;
    const categoryMatch = selectedCategory === 'all' || category === selectedCategory;

    const nameMatch = record.result.item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const labelMatch = record.result.item.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    const binMatch = record.result.item.binType.toLowerCase().includes(searchTerm.toLowerCase());
    const searchMatch = nameMatch || labelMatch || binMatch;

    return categoryMatch && searchMatch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* View Header */}
      <div className="rounded-3xl paper-card border border-stone-300 p-6 sm:p-8 space-y-4 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold mb-2">
              <History className="w-3.5 h-3.5 text-emerald-700" />
              <span>SCAN AUDIT TRAIL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Scan & Disposal History
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
              Review your historical scans, confidence scores, and eco points awarded on campus.
            </p>
          </div>

          {scanHistory.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your local scan history?')) {
                  onClearHistory();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 border border-stone-300 hover:border-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Search & Stream Filter Controls */}
        <div className="space-y-3 pt-2 border-t border-stone-200">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scans by item name, material, category, or bin type..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Stream:</span>
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#1b4332] text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              ALL ({scanHistory.length})
            </button>

            <button
              onClick={() => setSelectedCategory('recyclable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                selectedCategory === 'recyclable'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              ♻️ RECYCLABLE
            </button>

            <button
              onClick={() => setSelectedCategory('wet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                selectedCategory === 'wet'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              🌱 WET / ORGANIC
            </button>

            <button
              onClick={() => setSelectedCategory('dry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                selectedCategory === 'dry'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              🗑️ DRY
            </button>

            <button
              onClick={() => setSelectedCategory('ewaste')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                selectedCategory === 'ewaste'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              ⚡ E-WASTE
            </button>
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="rounded-3xl paper-card border border-stone-300 p-10 text-center space-y-3 bg-white shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 text-stone-400 border border-stone-200 flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">No Scan Records Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto font-medium">
              {scanHistory.length === 0
                ? 'Scan your first waste item with the live camera scanner to start building your campus eco history.'
                : 'No historical scans match your search or stream filter.'}
            </p>
          </div>
        ) : (
          filteredHistory.map((record) => {
            const { item, confidence } = record.result;
            const dateStr = new Date(record.timestamp).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const timeStr = new Date(record.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className="p-4 sm:p-5 rounded-2xl paper-card border border-stone-300 hover:border-emerald-600 bg-white cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-2xs"
              >
                <div className="flex items-start gap-4">
                  {/* Category Thumbnail Badge */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 border border-stone-300 text-white font-bold"
                    style={{ backgroundColor: item.binHex || '#2563eb' }}
                  >
                    {item.category === 'ewaste' ? '⚡' : item.category === 'wet' ? '🌱' : item.category === 'recyclable' ? '♻️' : '🗑️'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-emerald-900">{item.categoryLabel}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-700 font-bold">
                        {confidence}% Confident
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-stone-900 group-hover:text-emerald-900 transition-colors">
                      {item.name}
                    </h4>
                    {item.material && (
                      <div className="text-[11px] font-bold text-stone-600">
                        Material: <span className="text-stone-900">{item.material}</span>
                      </div>
                    )}
                    <div className="text-xs text-stone-500 font-medium flex items-center gap-2 pt-0.5">
                      <span>Bin: {item.binType}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        {dateStr} at {timeStr}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-900">+{item.ecoPoints || 10} Points</div>
                    <div className="text-[10px] text-stone-500 font-medium">~{item.estimatedImpactCo2eGrams || 100}g CO₂e avoided</div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
