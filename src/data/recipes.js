// Recipe Engine with Method-Specific Recipe Organization
import { getGrinderById } from './grinders';

export const BREW_METHODS = [
  {
    id: 'v60',
    name: 'V60 Pour Over',
    icon: '☕',
    description: 'Clean, floral, high clarity drip brewing',
    defaultDose: 15,
    defaultRatio: 16.7,
    tempRange: [92, 100]
  },
  {
    id: 'mokapot',
    name: 'Moka Pot',
    icon: '🫖',
    description: 'Rich, intense stovetop brew with dense body',
    defaultDose: 18,
    defaultRatio: 10,
    tempRange: [88, 94]
  },
  {
    id: 'frenchpress',
    name: 'French Press',
    icon: '🥛',
    description: 'Full immersion, heavy body & rich oils',
    defaultDose: 22,
    defaultRatio: 16,
    tempRange: [92, 98]
  },
  {
    id: 'espresso',
    name: 'Espresso',
    icon: '⚡',
    description: 'High pressure 9-bar extraction with thick crema',
    defaultDose: 18,
    defaultRatio: 2,
    tempRange: [91, 94]
  }
];

export const ALL_RECIPES = [
  // --- V60 POUR OVER RECIPES ---
  {
    id: 'hoffmann-1cup',
    author: 'James Hoffmann',
    title: '1-Cup V60',
    methodId: 'v60',
    benchmarkDose: 15,
    benchmarkWater: 250,
    ratio: 16.7,
    temp: 96,
    grindType: 'Medium-Fine',
    targetTime: '3:00',
    description: 'Clean, repeatable single-cup technique with controlled short 50g pulses.',
    category: 'Clean & Balanced',
    badge: 'Popular Everyday',
    getSteps: (dose, ratio, temp) => {
      const water = Math.round(dose * ratio);
      const pulse = Math.round(water / 5);
      return [
        { title: 'Bloom & Gentle Swirl', targetWater: pulse, duration: 45, instruction: `Pour ${pulse}g of ${temp}°C water. Swirl gently for 5s to saturate all grounds. Let bloom until 0:45.` },
        { title: 'Pulse Pour 2', targetWater: pulse * 2, duration: 25, instruction: `At 0:45, pour 10s up to ${pulse * 2}g (~5g/s). Pause at 1:00.` },
        { title: 'Pulse Pour 3', targetWater: pulse * 3, duration: 20, instruction: `At 1:10, pour 10s up to ${pulse * 3}g. Pause at 1:20.` },
        { title: 'Pulse Pour 4', targetWater: pulse * 4, duration: 20, instruction: `At 1:30, pour 10s up to ${pulse * 4}g. Pause at 1:40.` },
        { title: 'Pulse Pour 5 & Gentle Swirl', targetWater: water, duration: 70, instruction: `At 1:50, pour up to ${water}g total. Give 1 gentle swirl. Allow final drawdown until ~3:00.` }
      ];
    }
  },
  {
    id: 'hoffmann-ultimate',
    author: 'James Hoffmann',
    title: 'Ultimate V60',
    methodId: 'v60',
    benchmarkDose: 30,
    benchmarkWater: 500,
    ratio: 16.7,
    temp: 98,
    grindType: 'Medium-Fine',
    targetTime: '3:30',
    description: 'Benchmark large batch recipe with late stir & swirl to maintain a flat coffee bed.',
    category: 'High Clarity',
    badge: 'Large Batch',
    getSteps: (dose, ratio, temp) => {
      const water = Math.round(dose * ratio);
      const bloom = Math.round(water * 0.12);
      const pour1 = Math.round(water * 0.60);
      return [
        { title: 'Bloom & Swirl', targetWater: bloom, duration: 45, instruction: `Pour ${bloom}g of ${temp}°C water. Swirl gently for 5s. Wait until 0:45.` },
        { title: 'Main Pour 1', targetWater: pour1, duration: 30, instruction: `At 0:45, pour in spiral motion out to ${pour1}g (flow rate ~8g/s).` },
        { title: 'Main Pour 2', targetWater: water, duration: 30, instruction: `At 1:15, pour continuously up to ${water}g total by 1:45.` },
        { title: 'Stir & Swirl', targetWater: water, duration: 15, instruction: `At 1:45, 1x clockwise + 1x counterclockwise stir. At 1:50, gentle swirl.` },
        { title: 'Drawdown Complete', targetWater: water, duration: 90, instruction: 'Allow coffee to filter through completely into carafe (~3:30 target).' }
      ];
    }
  },
  {
    id: 'scott-rao',
    author: 'Scott Rao',
    title: 'Rao V60',
    methodId: 'v60',
    benchmarkDose: 22,
    benchmarkWater: 360,
    ratio: 16.4,
    temp: 94,
    grindType: 'Medium to Medium-Fine',
    targetTime: '3:00',
    description: 'Focuses on maximum even extraction, active bloom excavation, and the Rao spin.',
    category: 'Sweet & Even Extraction',
    badge: 'Pro Extraction',
    getSteps: (dose, ratio, temp) => {
      const water = Math.round(dose * ratio);
      const bloom = Math.round(dose * 3);
      return [
        { title: 'Bloom & Excavation Stir', targetWater: bloom, duration: 45, instruction: `Pour ${bloom}g bloom water. Gently stir/excavate dry pockets in bed.` },
        { title: 'Continuous Main Pour', targetWater: water, duration: 60, instruction: `At 0:45, pour steady stream maintaining constant water height up to ${water}g.` },
        { title: 'The Rao Spin', targetWater: water, duration: 15, instruction: `At 1:45, small circular rotation (Rao spin) of brewer to settle bed flat.` },
        { title: 'Drawdown', targetWater: water, duration: 60, instruction: 'Allow smooth flat drawdown to finish around ~3:00.' }
      ];
    }
  },
  {
    id: 'tetsu-kasuya',
    author: 'Tetsu Kasuya',
    title: '4:6 Method',
    methodId: 'v60',
    benchmarkDose: 20,
    benchmarkWater: 300,
    ratio: 15.0,
    temp: 93,
    grindType: 'Coarse / Medium-Coarse',
    targetTime: '3:45',
    description: '2016 World Champion recipe separating flavor balance (first 40%) from strength (remaining 60%).',
    category: 'Pulse & Flavor Dial',
    badge: 'World Champion 2016',
    kasuyaOption: true,
    getSteps: (dose, ratio, temp, options = { balance: 'balanced', strength: 'medium' }) => {
      const water = Math.round(dose * ratio);
      const part40 = Math.round(water * 0.40);
      const part60 = water - part40;

      let p1 = Math.round(part40 / 2);
      let p2 = part40 - p1;

      if (options.balance === 'sweeter') {
        p1 = Math.round(part40 * 0.416);
        p2 = part40 - p1;
      } else if (options.balance === 'brighter') {
        p1 = Math.round(part40 * 0.584);
        p2 = part40 - p1;
      }

      let p3, p4, p5;
      if (options.strength === 'strong') {
        p3 = Math.round(part60 / 2);
        p4 = part60 - p3;
        p5 = 0;
      } else {
        p3 = Math.round(part60 / 3);
        p4 = Math.round(part60 / 3);
        p5 = part60 - p3 - p4;
      }

      const steps = [
        { title: `Pour 1 (0:00) — ${options.balance === 'sweeter' ? 'Higher Sweetness' : options.balance === 'brighter' ? 'Higher Acidity' : 'Balanced Acid/Sugar'}`, targetWater: p1, duration: 45, instruction: `Pour ${p1}g water slowly. Let drain completely until 0:45.` },
        { title: 'Pour 2 (0:45) — Balance Control', targetWater: p1 + p2, duration: 45, instruction: `Pour up to ${p1 + p2}g. Let drain completely until 1:30.` },
        { title: 'Pour 3 (1:30) — Strength Control', targetWater: p1 + p2 + p3, duration: 45, instruction: `Pour up to ${p1 + p2 + p3}g. Let drain until 2:15.` },
        { title: 'Pour 4 (2:15) — Strength Control', targetWater: p1 + p2 + p3 + p4, duration: 45, instruction: `Pour up to ${p1 + p2 + p3 + p4}g. Let drain until 3:00.` }
      ];

      if (p5 > 0) {
        steps.push({
          title: 'Pour 5 (3:00) — Final Pulse',
          targetWater: water,
          duration: 45,
          instruction: `Pour up to ${water}g total. Complete drawdown by 3:45.`
        });
      }

      return steps;
    }
  },
  {
    id: 'lance-hedrick',
    author: 'Lance Hedrick',
    title: 'High-Extraction V60',
    methodId: 'v60',
    benchmarkDose: 20,
    benchmarkWater: 340,
    ratio: 17.0,
    temp: 100,
    grindType: 'Fine (~720 µm)',
    targetTime: '2:30 – 3:30',
    description: 'Designed for maximum extraction on light roasts using boiling water & 4 aggressive pours with spins.',
    category: 'High Extraction & Juicy',
    badge: 'High Yield',
    getSteps: (dose, ratio, temp) => {
      const water = Math.round(dose * ratio);
      const bloom = Math.round(dose * 2.5);
      const pour2 = bloom * 2;
      const rem = water - pour2;
      const pour3 = pour2 + Math.round(rem / 2);
      return [
        { title: 'Bloom Pour (0:00)', targetWater: bloom, duration: 30, instruction: `Pour ${bloom}g boiling water (~2.5x dose). Spin brewer.` },
        { title: 'Second Bloom Pulse (0:30)', targetWater: pour2, duration: 30, instruction: `At 0:30, pour up to ${pour2}g. Spin brewer.` },
        { title: 'Third Aggressive Pour (1:00)', targetWater: pour3, duration: 30, instruction: `At 1:00, pour aggressively just behind center to ${pour3}g. Spin.` },
        { title: 'Fourth Aggressive Pour (1:30)', targetWater: water, duration: 90, instruction: `At 1:30, pour up to ${water}g total. Spin brewer and let draw down.` }
      ];
    }
  },
  {
    id: 'tim-wendelboe',
    author: 'Tim Wendelboe',
    title: 'Nordic Pour Over',
    methodId: 'v60',
    benchmarkDose: 32.5,
    benchmarkWater: 500,
    ratio: 15.4,
    temp: 97,
    grindType: 'Filter Grind',
    targetTime: '3:00 – 3:30',
    description: 'Minimalist Nordic approach focusing on thorough bloom stirring & smooth continuous pouring.',
    category: 'Nordic Light Roast',
    badge: 'Nordic Style',
    getSteps: (dose, ratio, temp) => {
      const water = Math.round(dose * ratio);
      const bloom = Math.round(water * 0.12);
      const mid = Math.round(water * 0.40);
      return [
        { title: 'Bloom & Thorough Stir (0:00)', targetWater: bloom, duration: 30, instruction: `Pour ${bloom}g water. Stir thoroughly with spoon to saturate all grounds.` },
        { title: 'Continuous Circular Pour (0:30)', targetWater: mid, duration: 90, instruction: `At 0:30, pour in steady circular motion up to ${mid}g.` },
        { title: 'Final Pour (2:00)', targetWater: water, duration: 60, instruction: `Reach ${water}g total by 2:30. Stir finished coffee after drawdown.` }
      ];
    }
  },

  // --- MOKA POT RECIPES ---
  {
    id: 'hoffmann-mokapot',
    author: 'James Hoffmann',
    title: 'Ultimate Moka Pot',
    methodId: 'mokapot',
    benchmarkDose: 18,
    benchmarkWater: 180,
    ratio: 10.0,
    temp: 95,
    grindType: 'Fine-Medium',
    targetTime: '2:30',
    description: 'Use pre-heated boiling water in the base, brew over low heat with lid open, and submerge base in cold water when stream sputters.',
    category: 'Rich Stovetop',
    badge: 'Benchmark Stovetop',
    getSteps: (dose, ratio, temp) => {
      const water = Math.round(dose * ratio);
      return [
        { title: 'Pre-Heat Water & Fill Basket', targetWater: water, duration: 30, instruction: `Add ${water}g pre-boiled water to bottom chamber. Insert basket with ${dose}g grounds without tamping.` },
        { title: 'Low Heat Extraction', targetWater: water, duration: 120, instruction: 'Place on low stovetop heat with lid open. Watch for smooth honey-colored stream.' },
        { title: 'Cool Down Under Tap', targetWater: water, duration: 15, instruction: 'When stream turns pale and starts sputtering, quickly submerge base under cold tap water to freeze extraction.' }
      ];
    }
  },

  // --- FRENCH PRESS RECIPES ---
  {
    id: 'hoffmann-frenchpress',
    author: 'James Hoffmann',
    title: 'Ultimate No-Press French Press',
    methodId: 'frenchpress',
    benchmarkDose: 30,
    benchmarkWater: 500,
    ratio: 16.7,
    temp: 96,
    grindType: 'Medium',
    targetTime: '9:00',
    description: '4 min steep, stir crust, skim foam, then let sit 5 mins undisturbed for ultra-clean sediment-free cup.',
    category: 'Full Immersion Clarity',
    badge: 'Clean Immersion',
    getSteps: (dose, ratio, temp) => {
      const water = Math.round(dose * ratio);
      return [
        { title: 'Full Immersion Pour', targetWater: water, duration: 30, instruction: `Pour all ${water}g boiling water over ${dose}g medium grounds. Let steep undisturbed for 4:00.` },
        { title: 'Stir Crust & Skim Foam', targetWater: water, duration: 30, instruction: 'At 4:00, gently stir surface to let grounds sink. Skim remaining floating foam and bits with 2 spoons.' },
        { title: 'Sediment Settlement Wait', targetWater: water, duration: 300, instruction: 'Wait 5 minutes undisturbed. Do not touch or agitate.' },
        { title: 'Pour Gently (No Press)', targetWater: water, duration: 30, instruction: 'Insert plunger filter just below surface as a strainer. Gently pour clean coffee without agitating bottom sediment.' }
      ];
    }
  },

  // --- ESPRESSO RECIPES ---
  {
    id: 'espresso-standard',
    author: 'Specialty Barista',
    title: 'Classic 1:2 Shot',
    methodId: 'espresso',
    benchmarkDose: 18,
    benchmarkWater: 36,
    ratio: 2.0,
    temp: 93,
    grindType: 'Fine Espresso',
    targetTime: '0:30',
    description: 'Standard 9-bar 1:2 extraction balancing rich body, sweet tiger crema, and pleasant acidity.',
    category: 'Classic Espresso',
    badge: 'Standard 1:2',
    getSteps: (dose, ratio, temp) => {
      const water = Math.round(dose * ratio);
      return [
        { title: 'Puck Prep & WDT', targetWater: water, duration: 20, instruction: `Distribute ${dose}g grounds in portafilter, WDT needle tool, and tamp firm & level.` },
        { title: '9-Bar Shot Extraction', targetWater: water, duration: 30, instruction: `Start extraction at 9-bar pressure. Stop pump when target output of ${water}g yield is reached.` }
      ];
    }
  },
  {
    id: 'espresso-turbo',
    author: 'Lance Hedrick / Scott Rao',
    title: 'Turbo Shot (6-Bar)',
    methodId: 'espresso',
    benchmarkDose: 18,
    benchmarkWater: 40,
    ratio: 2.2,
    temp: 94,
    grindType: 'Coarser Espresso',
    targetTime: '0:18',
    description: 'Coarser grind, 6-bar pressure fast extraction yield resulting in high clarity, high sweetness, and zero channeling.',
    category: 'High Clarity Espresso',
    badge: 'Modern Turbo',
    getSteps: (dose, ratio, temp) => {
      const water = Math.round(dose * ratio);
      return [
        { title: 'Coarse Puck Prep', targetWater: water, duration: 20, instruction: `Dose ${dose}g coarsely ground coffee. WDT thoroughly.` },
        { title: 'Fast 6-Bar Extraction', targetWater: water, duration: 18, instruction: `Extract at 6-bar pressure. Target ${water}g in 15-18 seconds.` }
      ];
    }
  }
];

export const ELITE_RECIPES = ALL_RECIPES;

export function getRecipesByMethod(methodId) {
  return ALL_RECIPES.filter(r => r.methodId === methodId);
}

export function computeRecipe({
  recipeId = null,
  methodId = 'v60',
  doseGrams = 15,
  roastLevel = 'light',
  grinderId = 'kingrinder-k6',
  userClickOverride = null,
  userTempOverride = null,
  userRatioOverride = null,
  kasuyaOptions = { balance: 'balanced', strength: 'medium' }
}) {
  const method = BREW_METHODS.find(m => m.id === methodId) || BREW_METHODS[0];
  const grinder = getGrinderById(grinderId);

  // Filter recipes for method
  const methodRecipes = getRecipesByMethod(methodId);
  const activeRecipe = ALL_RECIPES.find(r => r.id === recipeId) || methodRecipes[0];

  let ratio = userRatioOverride || (activeRecipe ? activeRecipe.ratio : method.defaultRatio);
  let waterTemp = userTempOverride || (activeRecipe ? activeRecipe.temp : 94);

  // Grinder recommended click
  const recRange = grinder.ranges[methodId] || { min: 55, max: 70, recommended: 60 };
  let recommendedClick = recRange.recommended;

  // Adjust recommended click for grind type requirement
  if (activeRecipe) {
    if (activeRecipe.grindType.includes('Coarse')) {
      recommendedClick = Math.round(recRange.max - 2);
    } else if (activeRecipe.grindType.includes('Fine')) {
      recommendedClick = Math.round(recRange.min + 2);
    }
  }

  // Adjust slightly for roast level
  if (roastLevel === 'light') {
    recommendedClick -= 1;
  } else if (roastLevel === 'dark') {
    recommendedClick += 2;
  }

  const activeClick = userClickOverride !== null ? userClickOverride : recommendedClick;
  const waterMl = Math.round(doseGrams * ratio);

  // Build steps
  let steps = [];
  if (activeRecipe && activeRecipe.getSteps) {
    steps = activeRecipe.getSteps(doseGrams, ratio, waterTemp, kasuyaOptions);
  } else {
    // Default fallback
    const bloom = Math.round(doseGrams * 3);
    steps = [
      { title: 'Bloom', targetWater: bloom, duration: 45, instruction: `Pour ${bloom}g water. Swirl gently and wait 45s.` },
      { title: 'Main Pour', targetWater: Math.round(waterMl * 0.6), duration: 40, instruction: `Pour steadily up to ${Math.round(waterMl * 0.6)}g.` },
      { title: 'Final Pour', targetWater: waterMl, duration: 40, instruction: `Pour up to ${waterMl}g total and allow drawdown.` }
    ];
  }

  const totalTimeSec = steps.reduce((sum, s) => sum + s.duration, 0);

  // Grind advice hint calculation
  let grindHint = {
    type: 'balanced',
    title: '⭐ Recommended Dial Setting',
    description: `Optimal extraction yield for ${activeRecipe ? activeRecipe.title : method.name}. Balances sweet sugars and crisp acidity cleanly.`
  };

  const diff = activeClick - recommendedClick;
  if (diff <= -2) {
    grindHint = {
      type: 'fine',
      title: '🔍 Going Finer (Higher Extraction)',
      description: 'Slows drawdown time, pulls out deeper sweetness and fuller mouthfeel. Note: If ground too fine, water flow may stall or taste bitter/astringent.'
    };
  } else if (diff >= 2) {
    grindHint = {
      type: 'coarse',
      title: '⚖️ Going Coarser (Faster Flow & High Clarity)',
      description: 'Speeds up drawdown, highlights bright fruity acidity and tea-like clarity. Note: If ground too coarse, may taste thin, watery or sour.'
    };
  }

  return {
    recipeId: activeRecipe ? activeRecipe.id : null,
    activeRecipe,
    eliteRecipe: activeRecipe,
    method,
    doseGrams,
    ratio,
    waterMl,
    waterTemp,
    roastLevel,
    grinder,
    grinderClick: activeClick,
    recommendedClick,
    recommendedClickRange: recRange,
    grindHint,
    steps,
    totalTimeSec,
    predictedScores: { acidity: 7, sweetness: 8, body: 7, bitterness: 2, fruitiness: 8 }
  };
}

export function analyzeTasteFeedback({ symptom, currentRecipe }) {
  const { grinderClick, waterTemp, ratio, doseGrams } = currentRecipe;

  if (symptom === 'sour') {
    return {
      diagnosis: 'Under-extracted Cup (High Acidity & Lack of Sweetness)',
      reasoning: 'Water passed through grounds too quickly or water temp was too low to pull out sugars.',
      recommendations: [
        { variable: 'Grind Size', change: `${grinderClick} → ${grinderClick - 2} clicks`, note: 'Grind 2 clicks finer to slow drawdown & increase extraction yield.' },
        { variable: 'Water Temp', change: `${waterTemp}°C → ${waterTemp + 2}°C`, note: 'Increase temperature to extract sweet compounds.' },
        { variable: 'Brew Ratio', change: `1:${ratio} → 1:${(ratio + 0.5).toFixed(1)}`, note: 'Slightly increase water ratio for higher yield.' }
      ]
    };
  } else if (symptom === 'bitter') {
    return {
      diagnosis: 'Over-extracted Cup (Harsh Bitterness & Astringency)',
      reasoning: 'Grounds were over-exposed to hot water, pulling out bitter polyphenols at the end.',
      recommendations: [
        { variable: 'Grind Size', change: `${grinderClick} → ${grinderClick + 2} clicks`, note: 'Grind 2 clicks coarser to speed up flow.' },
        { variable: 'Water Temp', change: `${waterTemp}°C → ${waterTemp - 2}°C`, note: 'Lower water temperature by 2°C.' },
        { variable: 'Agitation', change: 'Gentler Pouring', note: 'Reduce pour height and swirl intensity.' }
      ]
    };
  } else if (symptom === 'hollow') {
    return {
      diagnosis: 'Channelling / Uneven Extraction',
      reasoning: 'Water cut fast paths through ground bed, leaving parts under-extracted and parts bitter.',
      recommendations: [
        { variable: 'Bed Prep', change: 'WDT / Gentle Swirl', note: 'Ensure grounds are completely flat before pouring.' },
        { variable: 'Bloom Time', change: '45s → 60s', note: 'Extend bloom to saturate all coffee particles evenly.' }
      ]
    };
  } else if (symptom === 'watery') {
    return {
      diagnosis: 'Low Strength / Diluted Cup',
      reasoning: 'Coffee to water ratio was too high or total dose was insufficient.',
      recommendations: [
        { variable: 'Brew Ratio', change: `1:${ratio} → 1:${(ratio - 1).toFixed(1)}`, note: 'Tighten ratio for more concentrated coffee.' },
        { variable: 'Dose', change: `${doseGrams}g → ${doseGrams + 2}g`, note: 'Increase dose weight slightly.' }
      ]
    };
  }

  return {
    diagnosis: 'Perfect Balanced Brew! 🎉',
    reasoning: 'Your extraction yielded optimal sweetness, pleasant acidity, and clean body.',
    recommendations: [
      { variable: 'Recipe Status', change: 'Saved to Favorites', note: 'Lock in this recipe for your current bean batch!' }
    ]
  };
}
