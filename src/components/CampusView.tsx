import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle, BatteryCharging, UtensilsCrossed, GraduationCap, Sprout, Trophy, Info, Filter, Search } from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/campusLocations';
import type { WasteCategory } from '../types';
import { InteractiveMap } from './InteractiveMap';

interface CampusViewProps {
  initialSelectedId?: string | null;
  scannedCategory?: WasteCategory | null;
  onSelectLocationForScan?: () => void;
}

export const CampusView: React.FC<CampusViewProps> = ({
  initialSelectedId,
  scannedCategory,
  onSelectLocationForScan
}) => {
  const [selectedFilter, setSelectedFilter] = useState<WasteCategory | 'all'>(
    scannedCategory || 'all'
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeLocationId, setActiveLocationId] = useState<string | null>(
    initialSelectedId || CAMPUS_LOCATIONS[0].id
  );

  React.useEffect(() => {
    if (initialSelectedId) {
      setActiveLocationId(initialSelectedId);
    }
  }, [initialSelectedId]);

  // Sort locations: prioritized category match first, then by distance
  const sortedLocations = [...CAMPUS_LOCATIONS].sort((a, b) => {
    if (scannedCategory) {
      const aMatch = a.acceptedTypes.includes(scannedCategory);
      const bMatch = b.acceptedTypes.includes(scannedCategory);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
    }
    return a.distanceMeters - b.distanceMeters;
  });

  const filteredLocations = sortedLocations.filter((loc) => {
    const filterMatch = selectedFilter === 'all' || loc.acceptedTypes.includes(selectedFilter);
    const searchMatch =
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.mapLandmark.toLowerCase().includes(searchTerm.toLowerCase());
    return filterMatch && searchMatch;
  });

  const activeLocation =
    CAMPUS_LOCATIONS.find((loc) => loc.id === activeLocationId) || filteredLocations[0] || CAMPUS_LOCATIONS[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BatteryCharging':
        return <BatteryCharging className="w-5 h-5 text-purple-700" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5 text-emerald-700" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-blue-700" />;
      case 'Sprout':
        return <Sprout className="w-5 h-5 text-green-700" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-700" />;
      default:
        return <MapPin className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* View Header */}
      <div className="rounded-3xl paper-card border border-stone-300 p-5 sm:p-8 space-y-4 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>FIND A PLACE TO DISPOSE IT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Find the right campus collection point for your item
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
              Select a location to view accepted streams, landmarks, and operational hours.
            </p>
          </div>

          {onSelectLocationForScan && (
            <button
              onClick={onSelectLocationForScan}
              className="px-4 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-xs flex items-center gap-2 transition-colors shrink-0 min-h-[44px] cursor-pointer"
            >
              <span>Scan Item at Location</span>
            </button>
          )}
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-3 pt-2 border-t border-stone-200">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by location name, building, or landmark..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Stream Filter:</span>
            </span>

            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#1b4332] text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              ALL ({CAMPUS_LOCATIONS.length})
            </button>

            <button
              onClick={() => setSelectedFilter('recyclable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                selectedFilter === 'recyclable'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              ♻️ RECYCLABLE
            </button>

            <button
              onClick={() => setSelectedFilter('wet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                selectedFilter === 'wet'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              🌱 WET / ORGANIC
            </button>

            <button
              onClick={() => setSelectedFilter('dry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                selectedFilter === 'dry'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              🗑️ DRY
            </button>

            <button
              onClick={() => setSelectedFilter('ewaste')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                selectedFilter === 'ewaste'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              ⚡ E-WASTE
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: List + Detail Map Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Locations List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredLocations.map((loc, idx) => {
            const isSelected = activeLocationId === loc.id;
            const isBestMatch = scannedCategory && loc.acceptedTypes.includes(scannedCategory) && idx === 0;

            return (
              <div
                key={loc.id}
                onClick={() => setActiveLocationId(loc.id)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all paper-card ${
                  isSelected
                    ? 'bg-stone-50 border-emerald-600 shadow-md ring-1 ring-emerald-600'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-300 shrink-0">
                      {getIcon(loc.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-emerald-800">{loc.distanceMeterText} away</div>
                      <div className="text-sm font-black text-stone-900 truncate">{loc.name}</div>
                      <div className="text-xs text-stone-500 font-medium truncate">{loc.building}</div>
                    </div>
                  </div>

                  {isBestMatch && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-black shrink-0">
                      BEST MATCH
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-stone-200 text-[10px] font-bold text-stone-500">
                  <span>Accepts:</span>
                  {loc.acceptedTypes.map((type) => (
                    <span
                      key={type}
                      className={`px-1.5 py-0.5 rounded font-extrabold uppercase ${
                        type === 'ewaste'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : type === 'recyclable'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : type === 'wet'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Location Detail Panel */}
        <div className="lg:col-span-2 rounded-3xl paper-card border border-stone-300 p-6 space-y-6 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-extrabold">
                  STATUS: {activeLocation.operatingStatus.toUpperCase()}
                </span>
                <span className="text-xs font-extrabold text-stone-600">{activeLocation.distanceMeterText} away</span>
              </div>
              <h3 className="text-2xl font-black text-stone-900">{activeLocation.name}</h3>
              <p className="text-xs text-stone-500 font-medium">{activeLocation.building}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Location & Landmark Guidance</span>
            </h4>
            <p className="text-xs text-stone-700 font-medium leading-relaxed">{activeLocation.description}</p>
            <div className="text-xs font-bold text-emerald-900 pt-1 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-700" />
              <span>Landmark: {activeLocation.mapLandmark}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
              Accepted Waste Categories at this Location:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeLocation.acceptedTypes.map((type) => (
                <div
                  key={type}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2.5 text-xs text-stone-900 font-bold"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="uppercase tracking-wider">{type} Waste Stream</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Campus Map Visual */}
          <div className="pt-2">
            <InteractiveMap
              locations={CAMPUS_LOCATIONS}
              activeLocationId={activeLocation.id}
              scannedCategory={scannedCategory}
              onSelectLocation={(id) => setActiveLocationId(id)}
            />
          </div>

          <div className="text-[11px] text-stone-500 italic">
            * Distances are estimated based on standard campus reference coordinates.
          </div>
        </div>
      </div>
    </div>
  );
};
