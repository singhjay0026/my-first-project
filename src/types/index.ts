export type WasteCategory = 'wet' | 'dry' | 'recyclable' | 'ewaste';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type BinColor = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'slate';

export interface DecisionTrailNode {
  step: string;
  question: string;
  answer: string;
  status: 'passed' | 'warning' | 'info' | 'alert';
}

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  categoryLabel: string;
  binType: string;
  binColor: BinColor;
  binHex: string;
  instructions: string[];
  campusDropoffId: string;
  ecoPoints: number;
  estimatedImpactCo2eGrams: number;
  warningMessage?: string;
  iconName: string;
  keywords: string[];
  verificationHint?: string;
  imageUrl?: string;
  sampleImageUri?: string;
  decisionTrail: DecisionTrailNode[];
  whyExplanation: string;
  reusePossibility?: string;
  material?: string;
  disposalReadinessScore?: number;
  disposalReadinessLabel?: string;
  multiItemDetected?: boolean;
  detectedItemsList?: string[];
}

export interface CampusLocation {
  id: string;
  name: string;
  building: string;
  acceptedTypes: WasteCategory[];
  acceptedMaterials?: string[];
  description: string;
  operatingStatus: 'open' | 'closed' | '24/7';
  mapLandmark: string;
  icon: string;
  distanceMeterText: string;
  distanceMeters: number;
  lat: number;
  lng: number;
}

export interface ClassificationResult {
  id: string;
  item: WasteItem;
  confidence: number; // 0 to 100 percentage
  confidenceLevel: ConfidenceLevel;
  suggestedItems?: WasteItem[];
  isDemoMode: boolean;
  modelSourceLabel: string;
  timestamp: string;
  scannedImageUri?: string;
  userVerified?: boolean;
  rawPredictions?: Array<{ className: string; probability: number }>;
}

export interface UserStats {
  totalScans: number;
  confirmedDisposals: number;
  ecoPoints: number;
  currentStreakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  categoryCounts: Record<WasteCategory, number>;
  totalImpactCo2eGrams: number;
}

export interface HistoryRecord {
  id: string;
  result: ClassificationResult;
  timestamp: string;
  userActionTaken: 'disposed' | 'flagged' | 'viewed';
}
