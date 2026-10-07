import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testCandidateModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY NOT CONFIGURED');
    process.exit(1);
  }

  const imagePath = path.resolve(process.cwd(), 'src/assets/hero.png');
  const imageBuffer = fs.readFileSync(imagePath);
  const cleanBase64 = imageBuffer.toString('base64');
  const mimeType = 'image/png';

  const candidates = [
    'gemini-2.5-flash',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-flash-latest',
    'gemini-2.5-pro'
  ];

  const ai = new GoogleGenAI({ apiKey });

  console.log('Testing vision model availability with real image payload...\n');

  for (const model of candidates) {
    try {
      const startTime = Date.now();
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType, data: cleanBase64 } },
              { text: 'Identify the object in this image briefly.' }
            ]
          }
        ]
      });
      const duration = Date.now() - startTime;
      console.log(`[SUCCESS 200] Model: ${model} (${duration}ms)`);
      console.log(`Response Snippet: ${response.text?.substring(0, 100).replace(/\n/g, ' ')}\n`);
    } catch (err: any) {
      const status = err?.status || err?.code || 500;
      console.log(`[FAILED ${status}] Model: ${model}`);
      console.log(`Error: ${err?.message}\n`);
    }
  }
}

testCandidateModels();
