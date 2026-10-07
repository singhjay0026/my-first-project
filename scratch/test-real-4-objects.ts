import { processWasteImage } from '../server/analyzeWasteHandler';
import dotenv from 'dotenv';
import fs from 'fs';
import http from 'http';
import https from 'https';

dotenv.config();

// Helper to download image via standard https node module with timeout
function getBase64FromUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Node/20' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return getBase64FromUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        resolve(`data:image/jpeg;base64,${buf.toString('base64')}`);
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

const ITEMS = [
  { name: 'Plastic bottle', url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&q=80' },
  { name: 'Banana peel', url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80' },
  { name: 'AA battery', url: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=400&q=80' },
  { name: 'Chocolate wrapper', url: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&q=80' }
];

async function runTests() {
  console.log('Testing 4 Real Objects against Gemini AI Multimodal Vision...\n');

  for (const item of ITEMS) {
    console.log(`==================================================`);
    console.log(`TESTING REAL OBJECT: ${item.name}`);
    console.log(`==================================================`);
    const startTime = Date.now();
    try {
      const base64Data = await getBase64FromUrl(item.url);
      const result = await processWasteImage(base64Data);
      const duration = Date.now() - startTime;
      console.log(`HTTP STATUS: 200 OK (${duration}ms)`);
      console.log(`identifiedItem: ${result.identifiedItem}`);
      console.log(`material: ${result.material}`);
      console.log(`wasteCategory: ${result.wasteCategory}`);
      console.log(`confidence: ${result.confidence} (${Math.round(result.confidence * 100)}%)`);
      console.log(`recommendedBin: ${result.recommendedBin}`);
      console.log(`LowConfidenceView triggered?: ${result.confidence < 0.55 ? 'YES' : 'NO'}`);
    } catch (err: any) {
      console.error(`FAILED to analyze ${item.name}:`, err.message || err);
    }
    console.log('');
  }
}

runTests();
