import { processWasteImage } from '../server/analyzeWasteHandler.ts';

async function testScanner() {
  console.log('--- TESTING REAL-WORLD SCANNER API HANDLER ---');

  // Dummy test base64 image (1x1 red pixel)
  const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSU5EUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  try {
    const result = await processWasteImage(dummyBase64);
    console.log('Result object keys:', Object.keys(result));
    console.log('Identified Item:', result.identifiedItem);
    console.log('Material:', result.material);
    console.log('Waste Category:', result.wasteCategory);
    console.log('Confidence:', result.confidence);
    console.log('Disposal Readiness Score:', result.disposalReadinessScore);
    console.log('Disposal Readiness Label:', result.disposalReadinessLabel);
    console.log('Reason:', result.reason);
    console.log('Recommended Bin:', result.recommendedBin);
    console.log('Disposal Instructions:', result.disposalInstructions);
    console.log('Reuse Tip:', result.reuseTip);
    console.log('Multi Item Detected:', result.multiItemDetected);
    console.log('Is AI Available:', result.isAiAvailable);
    console.log('--- TEST PASSED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  }
}

testScanner();
