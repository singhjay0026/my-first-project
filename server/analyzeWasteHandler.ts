import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Zod validation schema for Gemini multimodal AI response
export const AiWasteResponseSchema = z.object({
  identifiedItem: z.string().default('Waste Item'),
  material: z.string().default('Packaging Material'),
  wasteCategory: z.enum(['wet', 'dry', 'recyclable', 'ewaste']).default('dry'),
  confidence: z.number().min(0).max(1).default(0.85),
  reason: z.string().default('Disposed according to campus waste rules.'),
  recommendedBin: z.string().default('Dry Waste Bin'),
  disposalInstructions: z.array(z.string()).default(['Empty remaining contents', 'Place in bin']),
  isEwaste: z.boolean().default(false),
  needsSpecialHandling: z.boolean().default(false),
  disposalReadinessScore: z.number().min(0).max(100).default(80),
  disposalReadinessLabel: z.string().default('READY TO DISPOSE'),
  reuseTip: z.string().default(''),
  multiItemDetected: z.boolean().default(false),
  detectedItemsList: z.array(z.string()).default([]),
  isAiAvailable: z.boolean().default(true)
});

export type AiWasteResponse = z.infer<typeof AiWasteResponseSchema>;

/**
 * Normalize raw string waste category to strictly 'wet' | 'dry' | 'recyclable' | 'ewaste'
 */
const normalizeCategory = (catStr: any): 'wet' | 'dry' | 'recyclable' | 'ewaste' => {
  const str = (catStr || '').toString().toLowerCase();
  if (str.includes('e-waste') || str.includes('ewaste') || str.includes('battery') || str.includes('electronic') || str.includes('charger') || str.includes('cable') || str.includes('earphone')) return 'ewaste';
  if (str.includes('wet') || str.includes('organic') || str.includes('food') || str.includes('compost') || str.includes('banana') || str.includes('peel') || str.includes('tea') || str.includes('coffee')) return 'wet';
  if (str.includes('recycl') || str.includes('paper') || str.includes('cardboard') || str.includes('notebook') || str.includes('pet plastic bottle') || str.includes('can') || str.includes('glass')) return 'recyclable';
  return 'dry';
};

/**
 * Common Waste Handler for Gemini Vision API
 */
export async function processWasteImage(imageBase64: string): Promise<AiWasteResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.error('EcoSnap Backend Error: GEMINI_API_KEY is missing');
    throw new Error('GEMINI_API_KEY NOT CONFIGURED');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Clean base64 string
    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

    const prompt = `You are an expert waste classification and recycling decision AI for a college campus in India.
Analyze the visible waste item or items in this image.

Return ONLY valid JSON matching this exact schema:
{
  "identifiedItem": "string (e.g. Plastic Water Bottle, Ballpoint Pen, Notebook, Chocolate Wrapper, Chips Packet, AA Battery, Banana Peel, Cardboard Box, USB Cable, Earphones)",
  "material": "string (e.g. PET Plastic, Plastic body with metal tip, Cellulose paper with cardboard cover, Flexible multilayer film, Alkaline cell, Organic food waste)",
  "wasteCategory": "string (MUST be ONE of: wet, dry, recyclable, ewaste)",
  "confidence": number (between 0.00 and 1.00),
  "reason": "string (1-2 simple sentences explaining why this recommendation fits campus rules without chain-of-thought)",
  "recommendedBin": "string (e.g. Blue Recycling Bin, Red/Black Dry Waste Bin, Green Organic Bin, Special E-Waste Collection Point)",
  "disposalInstructions": ["string"] (2 to 4 actionable prep steps, e.g. "Empty remaining liquid", "Quick rinse", "Separate cover if spiral"),
  "isEwaste": boolean,
  "needsSpecialHandling": boolean,
  "disposalReadinessScore": number (0 to 100 estimated readiness score),
  "disposalReadinessLabel": "string (e.g. READY TO RECYCLE, NEEDS PREPARATION, SPECIAL E-WASTE HANDLING)",
  "reuseTip": "string (1-sentence second life tip if item can be reused, e.g. 'Use remaining blank pages before recycling.' Leave empty for unsafe/food waste)",
  "multiItemDetected": boolean (true if image contains 2 or more distinct waste items),
  "detectedItemsList": ["string"] (list of distinct objects found if multiItemDetected is true)
}`;

    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
    let response: any;
    let lastError: any;

    for (const model of modelsToTry) {
      let attempt = 0;
      const maxRetries = 2;
      let modelSuccess = false;

      while (attempt <= maxRetries) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType,
                      data: cleanBase64
                    }
                  },
                  { text: prompt }
                ]
              }
            ],
            config: {
              responseMimeType: 'application/json'
            }
          });
          modelSuccess = true;
          break;
        } catch (err: any) {
          lastError = err;
          const status = err?.status || err?.code || err?.response?.status;
          const errMsg = err?.message || String(err);
          const isTransient = status === 503 || status === 429 || errMsg.includes('503') || errMsg.includes('429') || errMsg.includes('UNAVAILABLE') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('high demand');

          if (isTransient && attempt < maxRetries) {
            attempt++;
            await new Promise((resolve) => setTimeout(resolve, 1200));
          } else {
            break; // Try next fallback model
          }
        }
      }

      if (modelSuccess) {
        break;
      }
    }

    if (!response) {
      throw lastError || new Error('All Gemini vision models failed or exhausted quota');
    }

    const rawText = response.text || '';
    let parsedJson: any = {};
    try {
      parsedJson = JSON.parse(rawText);
    } catch (e) {
      console.error('Failed to parse Gemini response JSON:', rawText);
      throw new Error(`Invalid JSON response from Gemini API: ${rawText.substring(0, 200)}`);
    }

    // Normalize category string before Zod validation
    parsedJson.wasteCategory = normalizeCategory(parsedJson.wasteCategory);
    
    // Normalize confidence safely: ensure between 0.0 and 1.0 (convert 85 -> 0.85 if model returned percentage)
    let confNum = typeof parsedJson.confidence === 'number' ? parsedJson.confidence : 0.85;
    if (confNum > 1) {
      confNum = confNum / 100;
    }
    if (confNum < 0) confNum = 0.85;
    parsedJson.confidence = confNum;

    parsedJson.disposalReadinessScore = typeof parsedJson.disposalReadinessScore === 'number' ? parsedJson.disposalReadinessScore : 80;
    parsedJson.disposalReadinessLabel = parsedJson.disposalReadinessLabel || 'READY TO DISPOSE';
    parsedJson.reuseTip = parsedJson.reuseTip || '';
    parsedJson.multiItemDetected = !!parsedJson.multiItemDetected;
    parsedJson.detectedItemsList = Array.isArray(parsedJson.detectedItemsList) ? parsedJson.detectedItemsList : [];
    parsedJson.isAiAvailable = true;

    // Validate using Zod schema safely
    const validatedData = AiWasteResponseSchema.parse(parsedJson);
    return validatedData;
  } catch (err: any) {
    console.error('EcoSnap Backend Gemini AI error:', err);
    throw err;
  }
}

/**
 * Clean Response when Gemini AI is not configured or fails
 */
export function generateUnavailableAiResponse(): AiWasteResponse {
  return {
    identifiedItem: 'Live AI Unavailable',
    material: 'Unknown Packaging',
    wasteCategory: 'dry',
    confidence: 0.0,
    reason: 'Live AI analysis is currently unavailable because the server API key is not configured or network failed.',
    recommendedBin: 'General Dry Waste Bin',
    disposalInstructions: [
      'Live AI service is unavailable. Please retry or choose manual category.',
      'Please check server configuration or retry.'
    ],
    isEwaste: false,
    needsSpecialHandling: false,
    disposalReadinessScore: 0,
    disposalReadinessLabel: 'SERVICE UNAVAILABLE',
    reuseTip: '',
    multiItemDetected: false,
    detectedItemsList: [],
    isAiAvailable: false
  };
}
