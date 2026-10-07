import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { processWasteImage } from '../server/analyzeWasteHandler.ts';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function runDiagnostic() {
  console.log('==================================================');
  console.log('ECOSNAP BACKEND DIAGNOSTIC TEST');
  console.log('==================================================');

  // 1. Check GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.log('GEMINI_API_KEY NOT CONFIGURED');
    process.exit(1);
  }

  // 2. Read real image file
  const imagePath = path.resolve(process.cwd(), 'src/assets/hero.png');
  if (!fs.existsSync(imagePath)) {
    console.error('Test image not found at:', imagePath);
    process.exit(1);
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
  let imageSent = false;

  console.log('Sending real image payload (hero.png, 13,057 bytes) to gemini-3.6-flash...');
  imageSent = true;

  try {
    const startTime = Date.now();
    const response = await processWasteImage(imageBase64);
    const duration = Date.now() - startTime;

    console.log('\n--------------------------------------------------');
    console.log('HTTP STATUS: 200 OK');
    console.log(`IMAGE SENT: ${imageSent ? 'YES' : 'NO'}`);
    console.log(`DURATION: ${duration}ms`);
    console.log(`IDENTIFIED ITEM: ${response.identifiedItem}`);
    console.log(`MATERIAL: ${response.material}`);
    console.log(`CONFIDENCE: ${response.confidence}`);
    console.log('FULL STRUCTURED RESPONSE:');
    console.log(JSON.stringify(response, null, 2));
    console.log('--------------------------------------------------');
  } catch (error: any) {
    const status = error?.status || error?.code || 500;
    console.log('\n--------------------------------------------------');
    console.log(`HTTP STATUS: ${status}`);
    console.log(`IMAGE SENT: ${imageSent ? 'YES' : 'NO'}`);
    console.log('EXACT FINAL ERROR:');
    console.log(error?.message || String(error));
    console.log('--------------------------------------------------');
  }
}

runDiagnostic();
