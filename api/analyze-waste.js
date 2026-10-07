import { processWasteImage } from '../server/analyzeWasteHandler.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64 } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 payload' });
    }

    const result = await processWasteImage(imageBase64);
    return res.status(200).json(result);
  } catch (error) {
    console.error('API analyze-waste error:', error);
    return res.status(500).json({
      error: 'Failed to analyze waste image',
      details: error.message
    });
  }
}
