import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY NOT CONFIGURED');
    process.exit(1);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.list();
    
    const modelList: any[] = [];
    if (response && typeof response[Symbol.asyncIterator] === 'function') {
      for await (const m of response) {
        modelList.push(m);
      }
    }

    const geminiModels = modelList
      .map(m => m.name.replace(/^models\//, ''))
      .filter(name => name.includes('gemini'));

    console.log(`==================================================`);
    console.log(`ALL GEMINI MODEL NAMES AVAILABLE (${geminiModels.length} models):`);
    console.log(`==================================================`);
    geminiModels.forEach(m => console.log(`- ${m}`));

  } catch (err: any) {
    console.error('Failed to list models:', err?.message || err);
    process.exit(1);
  }
}

listModels();
