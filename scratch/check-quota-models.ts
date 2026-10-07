import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY missing');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const imageBuffer = fs.readFileSync('public/hero.png');
const base64Image = imageBuffer.toString('base64');

const modelsToTest = [
  'gemini-[#2.5-flash]', // control
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest'
].map(m => m.replace('[', '').replace(']', ''));

async function testAll() {
  for (const model of modelsToTest) {
    console.log(`\nTesting ${model}...`);
    try {
      const res = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType: 'image/png', data: base64Image } },
              { text: 'Respond with JSON: {"item": "string", "confidence": number}' }
            ]
          }
        ],
        config: { responseMimeType: 'application/json' }
      });
      console.log(`[SUCCESS 200] ${model} =>`, res.text);
      return model;
    } catch (err: any) {
      console.log(`[FAILED ${err.status || err.code || 'ERR'}] ${model} =>`, err.message?.substring(0, 200));
    }
  }
}

testAll();
