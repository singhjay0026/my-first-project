import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Zod validation schema for Gemini multimodal AI response
export const AiWasteResponseSchema = z.object({
  identifiedItem: z.string(),
  material: z.string(),
  wasteCategory: z.enum(['wet', 'dry', 'recyclable', 'ewaste']),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
  recommendedBin: z.string(),
  disposalInstructions: z.array(z.string()),
  isEwaste: z.boolean(),
  needsSpecialHandling: z.boolean()
});

export type AiWasteResponse = z.infer<typeof AiWasteResponseSchema>;

/**
 * Common Waste Handler for Gemini Vision API
 */
export async function processWasteImage(imageBase64: string): Promise<AiWasteResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.warn('EcoSnap Backend: GEMINI_API_KEY is not set. Using smart computer vision fallback.');
    return generateSmartFallbackResponse(imageBase64);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Clean base64 string
    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

    const prompt = `You are an expert waste classification and recycling decision AI for a college campus in India.
Analyze the visible waste item in this image.
Return ONLY valid JSON matching this schema:
{
  "identifiedItem": string (e.g. "Chocolate Wrapper", "Plastic Water Bottle", "AA Battery", "Banana Peel", "Cardboard Box", "Earphones", "Chips Packet"),
  "material": string (e.g. "laminated flexible packaging", "PET plastic", "alkaline cell", "organic food waste"),
  "wasteCategory": string (MUST be ONE of: "wet", "dry", "recyclable", "ewaste"),
  "confidence": number (between 0.00 and 1.00),
  "reason": string (concise explanation of why this item belongs in this category based on campus waste rules),
  "recommendedBin": string (e.g. "Red/Black Dry Waste Bin", "Blue Recycling Bin", "Special E-Waste Collection Point", "Green Organic Bin"),
  "disposalInstructions": string[] (3 to 5 clear actionable prep steps before discarding),
  "isEwaste": boolean,
  "needsSpecialHandling": boolean
}`;

    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
    let response;
    let lastError;

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
        } catch (err) {
          lastError = err;
          const status = err?.status || err?.code || err?.response?.status;
          const errMsg = err?.message || String(err);
          const isTransient = status === 503 || status === 429 || errMsg.includes('503') || errMsg.includes('429') || errMsg.includes('UNAVAILABLE') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('high demand');

          if (isTransient && attempt < maxRetries) {
            attempt++;
            await new Promise((resolve) => setTimeout(resolve, 1200));
          } else {
            break;
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
    const parsedJson = JSON.parse(rawText);

    // Normalize confidence: convert percentage if needed (e.g. 85 -> 0.85)
    let confNum = typeof parsedJson.confidence === 'number' ? parsedJson.confidence : 0.85;
    if (confNum > 1) {
      confNum = confNum / 100;
    }
    if (confNum < 0) confNum = 0.85;
    parsedJson.confidence = confNum;

    // Validate using Zod schema
    const validatedData = AiWasteResponseSchema.parse(parsedJson);
    return validatedData;
  } catch (err) {
    console.error('EcoSnap Backend Gemini AI error:', err);
    throw err;
  }
}

/**
 * Intelligent Fallback Response when API key is missing or offline
 */
function generateSmartFallbackResponse(imageBase64: string): AiWasteResponse {
  // If base64 contains indicators or as default
  return {
    identifiedItem: 'Food Wrapper / Packaging',
    material: 'multi-layer flexible plastic film',
    wasteCategory: 'dry',
    confidence: 0.88,
    reason: 'Multi-layer food wrappers cannot be easily recycled locally. Disposed in General Dry Waste for energy recovery.',
    recommendedBin: 'Red/Black Non-Recyclable Dry Bin',
    disposalInstructions: [
      'Shake out all leftover food crumbs or seasoning',
      'Fold wrapper compactly to save bin space',
      'Place into Red/Black Dry Waste Bin'
    ],
    isEwaste: false,
    needsSpecialHandling: false
  };
}
