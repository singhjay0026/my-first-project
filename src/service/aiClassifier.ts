import type { ClassificationResult, ConfidenceLevel, WasteItem, DecisionTrailNode } from '../types';
import { getWasteItemById } from '../data/wasteDatabase';

export const preloadAIModel = async (): Promise<boolean> => {
  return true;
};

export const getModelStatus = () => {
  return {
    isLoaded: true,
    isLoading: false,
    error: null
  };
};

export const computeConfidenceLevel = (confidence: number): ConfidenceLevel => {
  if (confidence >= 75) return 'high';
  if (confidence >= 55) return 'medium';
  return 'low';
};

/**
 * Resize and compress image element to max 800px JPEG payload before API upload
 */
const compressImageForApi = (elementOrUri: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | string): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof elementOrUri === 'string') {
      if (elementOrUri.startsWith('data:image')) {
        resolve(elementOrUri);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(elementOrUri);
      img.src = elementOrUri;
      return;
    }

    const canvas = document.createElement('canvas');
    const maxDim = 800;
    let w = (elementOrUri as any).videoWidth || (elementOrUri as any).width || 640;
    let h = (elementOrUri as any).videoHeight || (elementOrUri as any).height || 480;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(elementOrUri as any, 0, 0, w, h);
    resolve(canvas.toDataURL('image/jpeg', 0.85));
  });
};

/**
 * Build dynamic WasteItem from Gemini API multimodal response
 */
const buildWasteItemFromAiResponse = (aiRes: any): WasteItem => {
  const category = (aiRes.wasteCategory || 'dry').toString().toLowerCase() as any;
  const isEwaste = category === 'ewaste' || aiRes.isEwaste;
  
  let binHex = '#2563eb';
  let binColor: any = 'blue';
  if (category === 'wet') { binHex = '#16a34a'; binColor = 'green'; }
  else if (category === 'dry') { binHex = '#dc2626'; binColor = 'red'; }
  else if (category === 'ewaste') { binHex = '#9333ea'; binColor = 'purple'; }

  const dropoffId = isEwaste ? 'library-ewaste' : category === 'wet' ? 'hostel-green-zone' : 'canteen-hub';

  const decisionTrail: DecisionTrailNode[] = [
    { step: 'Multimodal AI Vision', question: 'Identified Item & Material', answer: `${aiRes.identifiedItem || 'Object'} (${aiRes.material || 'Material'})`, status: 'passed' },
    { step: 'Hazard Assessment', question: 'Requires special handling or toxic e-waste drop?', answer: isEwaste ? 'CRITICAL HAZARD - E-Waste Drop Required' : 'Passed - Non-hazardous', status: isEwaste ? 'alert' : 'passed' },
    { step: 'Category Assignment', question: 'Assigned Campus Stream', answer: `${category.toUpperCase()} Stream`, status: 'passed' },
    { step: 'Bin Recommendation', question: 'Target Bin', answer: aiRes.recommendedBin || 'Designated Bin', status: 'passed' }
  ];

  return {
    id: `ai-item-${Date.now()}`,
    name: aiRes.identifiedItem || 'Identified Waste Item',
    material: aiRes.material || 'Common Packaging Material',
    category,
    categoryLabel: `${category.toUpperCase()} Waste`,
    binType: aiRes.recommendedBin || 'Campus Waste Bin',
    binColor,
    binHex,
    instructions: aiRes.disposalInstructions && aiRes.disposalInstructions.length > 0
      ? aiRes.disposalInstructions
      : ['Empty remaining contents', 'Place in designated bin'],
    campusDropoffId: dropoffId,
    ecoPoints: isEwaste ? 25 : category === 'recyclable' ? 15 : 10,
    estimatedImpactCo2eGrams: isEwaste ? 350 : category === 'recyclable' ? 140 : 80,
    warningMessage: isEwaste ? 'DANGER: Do NOT place e-waste in regular bins! Take directly to Central Library E-Waste Drop Box.' : undefined,
    iconName: isEwaste ? 'Battery' : 'Bottle',
    keywords: [(aiRes.identifiedItem || '').toLowerCase(), (aiRes.material || '').toLowerCase()],
    verificationHint: 'Ensure item is held clearly in frame.',
    sampleImageUri: undefined,
    whyExplanation: aiRes.reason || `Identified as ${aiRes.material || 'item'}. Classified under ${category} waste according to campus rules.`,
    reusePossibility: aiRes.reuseTip || (category === 'recyclable' || category === 'dry' ? `Consider reusing ${aiRes.identifiedItem} before final disposal if clean.` : undefined),
    disposalReadinessScore: typeof aiRes.disposalReadinessScore === 'number' ? aiRes.disposalReadinessScore : 80,
    disposalReadinessLabel: aiRes.disposalReadinessLabel || 'READY TO DISPOSE',
    multiItemDetected: !!aiRes.multiItemDetected,
    detectedItemsList: aiRes.detectedItemsList || [],
    decisionTrail
  };
};

/**
 * Primary Classification Service
 */
export const classifyWaste = async (
  elementOrUri: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | string,
  forcedItemKey?: string
): Promise<ClassificationResult> => {
  const timestamp = new Date().toISOString();
  const id = `scan-${Date.now()}`;

  // 1. JUDGE DEMO MODE SCENARIO PRESETS
  if (forcedItemKey) {
    const matchedDemoItem = getWasteItemById(forcedItemKey);
    let demoConfidence = 94;
    let confidenceLevel: ConfidenceLevel = 'high';

    if (forcedItemKey === 'uncertain-mixed-item') {
      demoConfidence = 38;
      confidenceLevel = 'low';
    } else if (forcedItemKey === 'plastic-snack-wrapper') {
      demoConfidence = 65;
      confidenceLevel = 'medium';
    }

    const suggestedItems = confidenceLevel === 'low'
      ? [
          getWasteItemById('plastic-water-bottle'),
          getWasteItemById('plastic-snack-wrapper'),
          getWasteItemById('canteen-food-scraps')
        ]
      : undefined;

    return {
      id,
      item: matchedDemoItem,
      confidence: demoConfidence,
      confidenceLevel,
      suggestedItems,
      isDemoMode: true,
      modelSourceLabel: 'Sample Scenario Preset',
      timestamp,
      scannedImageUri: typeof elementOrUri === 'string' ? elementOrUri : undefined
    };
  }

  // 2. REAL MULTIMODAL AI VISION VIA BACKEND API (/api/analyze-waste)
  try {
    const compressedImageBase64 = await compressImageForApi(elementOrUri);

    const apiRes = await fetch('/api/analyze-waste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: compressedImageBase64 })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();

      if (data.isAiAvailable === false) {
        // AI Key missing or backend AI service unavailable
        return {
          id,
          item: buildWasteItemFromAiResponse(data),
          confidence: 0,
          confidenceLevel: 'low',
          isDemoMode: false,
          modelSourceLabel: 'Live AI Service Unavailable',
          timestamp,
          scannedImageUri: compressedImageBase64
        };
      }

      const rawConfidence = typeof data.confidence === 'number' ? data.confidence : 0.88;
      const confidencePercentage = Math.round(rawConfidence * 100);
      const confidenceLevel = computeConfidenceLevel(confidencePercentage);
      const customItem = buildWasteItemFromAiResponse(data);

      const suggestedItems = confidenceLevel === 'low'
        ? [
            getWasteItemById('plastic-water-bottle'),
            getWasteItemById('paper-cardboard-box'),
            getWasteItemById('aluminum-beverage-can')
          ]
        : undefined;

      return {
        id,
        item: customItem,
        confidence: confidencePercentage,
        confidenceLevel,
        suggestedItems,
        isDemoMode: false,
        modelSourceLabel: 'Multimodal AI Vision (Gemini)',
        timestamp,
        scannedImageUri: compressedImageBase64
      };
    }
  } catch (err) {
    console.error('Backend /api/analyze-waste network error:', err);
  }

  // 3. SERVICE UNAVAILABLE FALLBACK
  const unavailableItem = getWasteItemById('uncertain-mixed-item');
  return {
    id,
    item: {
      ...unavailableItem,
      name: 'Live AI Service Unavailable',
      whyExplanation: 'Live AI vision service could not be reached. Please check network connection and retry.'
    },
    confidence: 0,
    confidenceLevel: 'low',
    isDemoMode: false,
    modelSourceLabel: 'Live AI Service Unavailable',
    timestamp
  };
};
