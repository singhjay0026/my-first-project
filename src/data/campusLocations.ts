import type { CampusLocation, WasteCategory } from '../types';

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'canteen-hub',
    name: 'Main Canteen Waste Hub',
    building: 'Student Amenities Center (Ground Floor)',
    acceptedTypes: ['wet', 'dry', 'recyclable'],
    acceptedMaterials: ['multi-layer plastic', 'food wrapper', 'packaging film', 'general waste', 'laminated flexible packaging'],
    description: 'Central campus segregation hub with color-coded high capacity smart bins for food wrappers and dry packaging.',
    operatingStatus: 'open',
    mapLandmark: 'Adjacent to main dining hall exit gate',
    icon: 'UtensilsCrossed',
    distanceMeterText: '30m from Canteen',
    distanceMeters: 30,
    lat: 28.5450,
    lng: 77.1926
  },
  {
    id: 'library-ewaste',
    name: 'Library E-Waste Drop Point',
    building: 'Central Library Building',
    acceptedTypes: ['ewaste'],
    acceptedMaterials: ['alkaline cell', 'battery', 'copper wire', 'circuit board', 'electronic accessory', 'charger', 'cable', 'earphones', 'usb cable'],
    description: 'Secure collection bin for batteries, cables, adapters, and small electronic accessories.',
    operatingStatus: '24/7',
    mapLandmark: 'Near main entrance security desk & printer area',
    icon: 'BatteryCharging',
    distanceMeterText: '120m from Canteen',
    distanceMeters: 120,
    lat: 28.5458,
    lng: 77.1934
  },
  {
    id: 'academic-block-a',
    name: 'Academic Block A Recycling Station',
    building: 'Department of Computer Science & Engineering',
    acceptedTypes: ['recyclable', 'dry'],
    acceptedMaterials: ['cellulose paper', 'cardboard', 'pet plastic', 'paper', 'notebook', 'textbook', 'loose paper'],
    description: 'Dedicated paper, cardboard, and clean plastic bottle recycling station.',
    operatingStatus: 'open',
    mapLandmark: 'Near East Staircase & faculty lounge',
    icon: 'GraduationCap',
    distanceMeterText: '250m from Canteen',
    distanceMeters: 250,
    lat: 28.5442,
    lng: 77.1918
  },
  {
    id: 'hostel-green-zone',
    name: 'Hostel Zone Organic Composter',
    building: 'Hostel Block 3 Courtyard',
    acceptedTypes: ['wet'],
    acceptedMaterials: ['organic food waste', 'fruit peel', 'tea leaves', 'coffee grounds', 'leftover food', 'banana peel'],
    description: 'On-campus organic waste composter for food scraps, fruit peels, and canteen organic waste.',
    operatingStatus: '24/7',
    mapLandmark: 'Behind Hostel 3 mess hall',
    icon: 'Sprout',
    distanceMeterText: '400m from Canteen',
    distanceMeters: 400,
    lat: 28.5463,
    lng: 77.1942
  },
  {
    id: 'sports-complex-hub',
    name: 'Sports Complex Beverage Recycler',
    building: 'Indoor Stadium',
    acceptedTypes: ['recyclable', 'dry'],
    acceptedMaterials: ['pet plastic bottle', 'aluminum can', 'beverage bottle', 'glass bottle', 'plastic water bottle'],
    description: 'Specialized aluminum can and plastic water bottle recycling crusher bin.',
    operatingStatus: 'open',
    mapLandmark: 'Next to water cooler and gymnasium entrance',
    icon: 'Trophy',
    distanceMeterText: '500m from Canteen',
    distanceMeters: 500,
    lat: 28.5435,
    lng: 77.1905
  }
];

export const getCampusLocationById = (id: string): CampusLocation => {
  return CAMPUS_LOCATIONS.find((loc) => loc.id === id) || CAMPUS_LOCATIONS[0];
};

export const getBestCampusLocationForCategory = (category: string, material?: string): CampusLocation => {
  const cat = (category || 'dry').toLowerCase();
  const mat = (material || '').toLowerCase();

  // Try matching by material keywords first
  if (mat) {
    const matMatch = CAMPUS_LOCATIONS.find((loc) =>
      loc.acceptedMaterials?.some((m) => mat.includes(m) || m.includes(mat))
    );
    if (matMatch) return matMatch;
  }

  // Fallback to category match
  const matches = CAMPUS_LOCATIONS.filter((loc) => loc.acceptedTypes.includes(cat as WasteCategory));
  if (matches.length > 0) {
    return matches.sort((a, b) => a.distanceMeters - b.distanceMeters)[0];
  }
  return CAMPUS_LOCATIONS[0];
};
