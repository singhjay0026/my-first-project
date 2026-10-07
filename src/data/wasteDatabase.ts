import type { WasteItem } from '../types';

export const WASTE_ITEMS: WasteItem[] = [
  {
    id: 'plastic-water-bottle',
    name: 'Plastic Water Bottle (PET)',
    category: 'recyclable',
    categoryLabel: 'Recyclable Plastic',
    binType: 'Blue Recycling Bin',
    binColor: 'blue',
    binHex: '#2563eb',
    instructions: [
      'Unscrew the plastic cap and separate from bottle body.',
      'Empty all remaining liquids completely.',
      'Give a quick rinse with minimal water if dirty.',
      'Crush or flatten bottle to save bin space.',
      'Deposit bottle in the Blue Recycling Bin.'
    ],
    campusDropoffId: 'canteen-hub',
    ecoPoints: 12,
    estimatedImpactCo2eGrams: 120,
    iconName: 'Bottle',
    keywords: [
      'water bottle', 'plastic bottle', 'pop bottle', 'bottle', 'pet', 'soda bottle',
      'beverage bottle', 'flask', 'container', 'drink bottle'
    ],
    verificationHint: 'Keep the bottle clearly in frame and remove any dark outer sleeve if unreadable.',
    sampleImageUri: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    whyExplanation: 'PET bottles are highly recyclable when segregated clean without liquid residue. Recycled PET is converted into new campus fiber products and synthetic clothing.',
    reusePossibility: 'Can be reused as a temporary plant seed starter, water sprinkler, or DIY funnel before recycling.',
    decisionTrail: [
      { step: 'Visual Inference', question: 'What item was detected?', answer: 'PET Plastic Water Bottle', status: 'passed' },
      { step: 'Hazard Check', question: 'Does item contain toxic chemicals or battery cells?', answer: 'No - Standard PET thermoplastic', status: 'passed' },
      { step: 'Recyclability Evaluation', question: 'Is PET plastic recyclable on campus?', answer: 'Yes - High recovery value', status: 'passed' },
      { step: 'Preparation Step', question: 'What prep action is required?', answer: 'Drain liquids completely & crush container', status: 'info' },
      { step: 'Final Target', question: 'Which bin is assigned?', answer: 'Blue Recycling Bin', status: 'passed' }
    ]
  },
  {
    id: 'plastic-coffee-cup',
    name: 'Disposable Plastic Cup',
    category: 'dry',
    categoryLabel: 'Dry Packaging Waste',
    binType: 'Blue/Dry Recycling Bin',
    binColor: 'blue',
    binHex: '#0284c7',
    instructions: [
      'Remove plastic straw and disposable lid.',
      'Drain any leftover drink, ice, or boba pearls.',
      'Rinse out liquid residues.',
      'Stack cups if disposing multiple items.',
      'Place in the Dry Waste / Recycling Bin.'
    ],
    campusDropoffId: 'canteen-hub',
    ecoPoints: 8,
    estimatedImpactCo2eGrams: 65,
    iconName: 'CupSoda',
    keywords: ['cup', 'plastic cup', 'coffee cup', 'drink cup', 'smoothie cup', 'boba cup', 'beverage cup', 'glass cup', 'mug'],
    verificationHint: 'Ensure cup is upright and liquid contents are visible or emptied.',
    sampleImageUri: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80',
    whyExplanation: 'Single-use drink cups require liquid removal so leftover sugary syrup does not contaminate dry paper and cardboard streams.',
    reusePossibility: 'Use as a desktop organizer for paperclips or stationery before final disposal.',
    decisionTrail: [
      { step: 'Visual Inference', question: 'What item was detected?', answer: 'Disposable Drink Cup', status: 'passed' },
      { step: 'Hazard Check', question: 'Is it hazardous?', answer: 'No - Food-grade polymer', status: 'passed' },
      { step: 'Contamination Risk', question: 'Does it contain leftover liquids?', answer: 'Yes - Drain liquid before binning', status: 'warning' },
      { step: 'Final Target', question: 'Which bin is assigned?', answer: 'Blue/Dry Recycling Bin', status: 'passed' }
    ]
  },
  {
    id: 'paper-cardboard-box',
    name: 'Cardboard Box & Paper Packaging',
    category: 'recyclable',
    categoryLabel: 'Recyclable Paper',
    binType: 'Blue Paper Recycling Bin',
    binColor: 'blue',
    binHex: '#1d4ed8',
    instructions: [
      'Remove plastic adhesive tape and plastic bubble wraps.',
      'Flatten the cardboard box completely to minimize volume.',
      'Ensure paper is dry and free of oil or food stains.',
      'Deposit into the Paper & Cardboard Collection Slot.'
    ],
    campusDropoffId: 'academic-block-a',
    ecoPoints: 15,
    estimatedImpactCo2eGrams: 180,
    iconName: 'Box',
    keywords: [
      'cardboard', 'carton', 'paper box', 'box', 'notebook', 'document', 'envelope',
      'packet', 'paper towel', 'tissue', 'wrapping paper'
    ],
    verificationHint: 'Flatten cardboard boxes to help object detection align correctly.',
    sampleImageUri: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
    whyExplanation: 'Clean dry cardboard yields high-grade paper pulp. Flattening boxes increases campus recycling collection efficiency by 400%.',
    reusePossibility: 'Cardboard boxes can be reused for campus storage or shipping before recycling.',
    decisionTrail: [
      { step: 'Visual Inference', question: 'What item was detected?', answer: 'Cardboard Packaging', status: 'passed' },
      { step: 'Contamination Check', question: 'Is cardboard contaminated with food grease?', answer: 'No - Dry paper material', status: 'passed' },
      { step: 'Preparation Action', question: 'Required prep before binning?', answer: 'Strip plastic tape & flatten completely', status: 'info' },
      { step: 'Final Target', question: 'Which bin is assigned?', answer: 'Blue Paper Bin (Academic Block A)', status: 'passed' }
    ]
  },
  {
    id: 'canteen-food-scraps',
    name: 'Food & Organic Kitchen Waste',
    category: 'wet',
    categoryLabel: 'Wet / Organic Waste',
    binType: 'Green Organic Waste Bin',
    binColor: 'green',
    binHex: '#16a34a',
    instructions: [
      'Separate any plastic spoons, sauce sachets, or foil wrappers.',
      'Scrape remaining food leftovers directly into wet waste.',
      'Avoid mixing paper napkins heavily coated in grease.',
      'Deposit into Green Compostable Organic Bin.'
    ],
    campusDropoffId: 'hostel-green-zone',
    ecoPoints: 10,
    estimatedImpactCo2eGrams: 90,
    iconName: 'Apple',
    keywords: [
      'food', 'organic', 'fruit', 'banana', 'apple', 'orange', 'peel', 'rice', 'meal',
      'bread', 'salad', 'vegetable', 'plate scrap', 'canteen waste'
    ],
    verificationHint: 'Make sure non-organic cutlery or wrappers are separated before scanning.',
    sampleImageUri: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
    whyExplanation: 'Organic food scraps are processed in the campus anaerobic composter to create organic fertilizer for college green gardens.',
    reusePossibility: 'Directly compostable in campus hostel garden beds.',
    decisionTrail: [
      { step: 'Visual Inference', question: 'What item was detected?', answer: 'Organic Food Waste / Scraps', status: 'passed' },
      { step: 'Packaging Check', question: 'Are plastic utensils or sachets mixed in?', answer: 'Separate plastic before binning', status: 'warning' },
      { step: 'Composting Suitability', question: 'Is material organic?', answer: 'Yes - 100% Biodegradable', status: 'passed' },
      { step: 'Final Target', question: 'Which bin is assigned?', answer: 'Green Wet/Organic Bin', status: 'passed' }
    ]
  },
  {
    id: 'aluminum-beverage-can',
    name: 'Aluminum Beverage Can',
    category: 'recyclable',
    categoryLabel: 'Recyclable Metal',
    binType: 'Blue Metal Recycling Bin',
    binColor: 'blue',
    binHex: '#2563eb',
    instructions: [
      'Finish or pour out remaining liquid contents.',
      'Rinse briefly to avoid attracting insects.',
      'Crush the can vertically if using a campus can-crusher.',
      'Place in the Metal / Can Recycling Collector.'
    ],
    campusDropoffId: 'sports-complex-hub',
    ecoPoints: 18,
    estimatedImpactCo2eGrams: 210,
    iconName: 'Container',
    keywords: ['can', 'tin', 'aluminum can', 'soda can', 'coke can', 'beverage can', 'beer can', 'metal container'],
    verificationHint: 'Position the metal can under direct lighting to avoid harsh reflective glare.',
    sampleImageUri: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    whyExplanation: 'Recycling aluminum saves 95% of the energy required to produce new aluminum from bauxite ore. Aluminum can be recycled infinitely.',
    reusePossibility: 'Can be crushed using campus sports complex can crusher.',
    decisionTrail: [
      { step: 'Visual Inference', question: 'What item was detected?', answer: 'Aluminum Beverage Can', status: 'passed' },
      { step: 'Material Evaluation', question: 'Is aluminum infinitely recyclable?', answer: 'Yes - Extremely high eco impact', status: 'passed' },
      { step: 'Preparation Step', question: 'What prep action is needed?', answer: 'Rinse liquid & crush vertically', status: 'info' },
      { step: 'Final Target', question: 'Which bin is assigned?', answer: 'Blue Metal Bin (Sports Complex)', status: 'passed' }
    ]
  },
  {
    id: 'glass-bottle',
    name: 'Glass Juice / Soda Bottle',
    category: 'recyclable',
    categoryLabel: 'Recyclable Glass',
    binType: 'Blue Glass Bin',
    binColor: 'blue',
    binHex: '#0369a1',
    instructions: [
      'Remove metal cap or cork lid.',
      'Rinse internal container with clean water.',
      'Check for cracks or sharp glass breakages.',
      'Gently place inside Glass Collection container (do not throw forcefully).'
    ],
    campusDropoffId: 'canteen-hub',
    ecoPoints: 16,
    estimatedImpactCo2eGrams: 150,
    iconName: 'Wine',
    keywords: ['glass', 'glass bottle', 'jar', 'sauce bottle', 'beverage glass', 'wine bottle', 'beer bottle'],
    verificationHint: 'Handle glass items with care and avoid placing cracked glass near live camera sensor.',
    sampleImageUri: 'https://images.unsplash.com/photo-1605557202138-097824c3f256?auto=format&fit=crop&w=400&q=80',
    whyExplanation: 'Glass is 100% recyclable. Segregating glass prevents puncture injuries to sanitation workers and enables remelting into new containers.',
    reusePossibility: 'Ideal for refillable water storage or laboratory samples.',
    decisionTrail: [
      { step: 'Visual Inference', question: 'What item was detected?', answer: 'Glass Beverage Container', status: 'passed' },
      { step: 'Safety Check', question: 'Is glass damaged or shattered?', answer: 'Inspect for sharp edges', status: 'warning' },
      { step: 'Recycling Stream', question: 'Does campus accept glass?', answer: 'Yes - Dedicated Glass Collection', status: 'passed' },
      { step: 'Final Target', question: 'Which bin is assigned?', answer: 'Blue Glass Bin', status: 'passed' }
    ]
  },
  {
    id: 'aa-battery',
    name: 'AA / AAA Alkaline Battery',
    category: 'ewaste',
    categoryLabel: 'Toxic E-Waste',
    binType: 'Special E-Waste Collection Point',
    binColor: 'purple',
    binHex: '#9333ea',
    warningMessage: 'DANGER: Do NOT place batteries in regular wet or dry waste bins! Toxic heavy metals can leak or cause fire hazards.',
    instructions: [
      'DO NOT throw in regular municipal waste bins.',
      'Inspect battery terminals for acid leaks or corrosion.',
      'Tape battery contacts with electrical or Scotch tape if stored in bulk.',
      'Take directly to the designated Campus E-Waste Drop Box in Central Library.'
    ],
    campusDropoffId: 'library-ewaste',
    ecoPoints: 25,
    estimatedImpactCo2eGrams: 350,
    iconName: 'Battery',
    keywords: ['battery', 'aa battery', 'aaa battery', 'cell', 'lithium', 'accumulator', 'power bank', 'button cell'],
    verificationHint: 'Hold battery steadily in palm or tabletop with brand/label visible.',
    sampleImageUri: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=400&q=80',
    whyExplanation: 'Batteries contain heavy metals (mercury, cadmium, lead, nickel) and corrosive electrolyte acids. Improper disposal creates severe groundwater toxicity and landfill fires.',
    reusePossibility: 'Check voltage with multimeter before discarding; rechargeable cells should be recharged.',
    decisionTrail: [
      { step: 'Visual Inference', question: 'What item was detected?', answer: 'AA/AAA Battery Cell', status: 'passed' },
      { step: 'Hazard Check', question: 'Contains toxic heavy metals or fire hazards?', answer: 'CRITICAL HAZARD - High Toxicity', status: 'alert' },
      { step: 'Municipal Bin Allowed?', question: 'Can battery go into regular trash?', answer: 'NO! Strictly prohibited in normal bins', status: 'alert' },
      { step: 'Special Handling', question: 'Where must battery be taken?', answer: 'Library E-Waste Drop Point (Special Bin)', status: 'passed' }
    ]
  },
  {
    id: 'electronic-accessory',
    name: 'Electronic Cable & Earbuds',
    category: 'ewaste',
    categoryLabel: 'Electronic Accessory E-Waste',
    binType: 'Special E-Waste Collection Point',
    binColor: 'purple',
    binHex: '#7e22ce',
    warningMessage: 'CRITICAL E-WASTE: Contains recyclable gold, copper, and hazardous plastic wiring. Separate from household waste.',
    instructions: [
      'Bundle loose cable neatly using a twist tie or rubber band.',
      'Do not cut wires into small fragments.',
      'Drop into the Library E-Waste Recycling Box.'
    ],
    campusDropoffId: 'library-ewaste',
    ecoPoints: 30,
    estimatedImpactCo2eGrams: 420,
    iconName: 'Plug',
    keywords: [
      'cable', 'charger', 'earphones', 'headphones', 'wire', 'adapter', 'usb', 'mouse',
      'keyboard', 'cellular telephone', 'phone', 'hand-held computer', 'laptop'
    ],
    verificationHint: 'Untangle cables for optimal object boundary recognition.',
    sampleImageUri: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80',
    whyExplanation: 'Electronic cables contain copper wiring and precious metals coated in halogenated PVC flame retardants that require specialized mechanical shredding and smelting.',
    reusePossibility: 'Test with another device or donate if functional.',
    decisionTrail: [
      { step: 'Visual Inference', question: 'What item was detected?', answer: 'Electronic Accessory / Cable', status: 'passed' },
      { step: 'Hazard Check', question: 'Contains electronic components or copper wire?', answer: 'Yes - E-Waste Category', status: 'warning' },
      { step: 'Recovery Value', question: 'Contains valuable recyclable metals?', answer: 'High copper & precious metal recovery', status: 'passed' },
      { step: 'Final Target', question: 'Which bin is assigned?', answer: 'Library E-Waste Collection Box', status: 'passed' }
    ]
  },
  {
    id: 'plastic-snack-wrapper',
    name: 'Multi-Layer Snack Wrapper',
    category: 'dry',
    categoryLabel: 'Non-Recyclable Dry Waste',
    binType: 'Red / Black Non-Recyclable Dry Bin',
    binColor: 'red',
    binHex: '#dc2626',
    instructions: [
      'Shake out all leftover food crumbs or seasoning.',
      'Metallized plastic film wrapper cannot be easily recycled locally.',
      'Fold wrapper compactly.',
      'Dispose into Red Non-Recyclable Dry Waste Bin.'
    ],
    campusDropoffId: 'canteen-hub',
    ecoPoints: 5,
    estimatedImpactCo2eGrams: 30,
    iconName: 'Package',
    keywords: [
      'wrapper', 'chips pouch', 'snack bag', 'biscuit wrapper', 'foil packaging',
      'candy wrapper', 'crisp bag', 'packet', 'plastic bag'
    ],
    verificationHint: 'Smooth out crinkled wrappers so branding or texture can be recognized.',
    sampleImageUri: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80',
    whyExplanation: 'Multi-layer composite plastic packaging (aluminum foil fused with plastic film) cannot be separated easily by local recyclers. Placed in dry waste for energy recovery.',
    reusePossibility: 'Can be saved for eco-brick filling projects.',
    decisionTrail: [
      { step: 'Visual Inference', question: 'What item was detected?', answer: 'Multi-layer Foil Wrapper', status: 'passed' },
      { step: 'Material Check', question: 'Is wrapper single-polymer recyclable?', answer: 'No - Multi-layer composite metalized film', status: 'warning' },
      { step: 'Contamination', question: 'Contains leftover crumbs?', answer: 'Shake clean before disposal', status: 'info' },
      { step: 'Final Target', question: 'Which bin is assigned?', answer: 'Red / General Dry Waste Bin', status: 'passed' }
    ]
  },
  {
    id: 'uncertain-mixed-item',
    name: 'Uncertain / Mixed Material Item',
    category: 'dry',
    categoryLabel: 'Uncertain / Mixed Waste',
    binType: 'Dry Waste Bin / Manual Inspection',
    binColor: 'amber',
    binHex: '#d97706',
    instructions: [
      'Inspect if item can be disassembled into separate materials (metal, plastic, paper).',
      'If mixed composite material cannot be separated, place in General Dry Waste.',
      'Ask canteen waste volunteers if unsure.'
    ],
    campusDropoffId: 'canteen-hub',
    ecoPoints: 5,
    estimatedImpactCo2eGrams: 20,
    iconName: 'HelpCircle',
    keywords: ['mixed', 'unknown', 'composite', 'stationary', 'pen'],
    verificationHint: 'Try scanning under brighter lighting or zooming in on specific component material.',
    sampleImageUri: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80',
    whyExplanation: 'When material composition is uncertain, placing items in dry waste prevents contamination of wet organic composting streams.',
    reusePossibility: 'Disassemble parts manually to segregate metal/plastic components.',
    decisionTrail: [
      { step: 'Visual Inference', question: 'What item was detected?', answer: 'Uncertain Composite Object', status: 'warning' },
      { step: 'Confidence Threshold', question: 'Is confidence above safety limit?', answer: 'No - Low confidence (< 45%)', status: 'warning' },
      { step: 'Safety Action', question: 'Recommend authoritative bin?', answer: 'Avoid wrong claims; suggest rescan or manual pick', status: 'info' }
    ]
  }
];

export const IMPACT_METHODOLOGY_NOTE =
  '* Estimated carbon emissions (CO₂e) avoided are calculated based on EcoSnap campus recycling factor benchmarks (e.g. 1 PET bottle ~ 120g CO₂e avoided vs landfill incineration). These are proxy estimates designed to encourage sustainable disposal habits.';

export const getWasteItemById = (id: string): WasteItem => {
  return WASTE_ITEMS.find((item) => item.id === id) || WASTE_ITEMS[0];
};

export const searchWasteItemByKeyword = (keyword: string): WasteItem => {
  const lower = keyword.toLowerCase();
  const match = WASTE_ITEMS.find((item) =>
    item.keywords.some((kw) => lower.includes(kw) || kw.includes(lower)) ||
    item.name.toLowerCase().includes(lower)
  );
  return match || WASTE_ITEMS[WASTE_ITEMS.length - 1]; // fallback to uncertain item
};
