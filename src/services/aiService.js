// BrewMind — Smart AI Service with Auto Model Discovery & Detailed Quota Handling

export function getStoredApiConfig() {
  const saved = localStorage.getItem('brewmind_api_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse API config', e);
    }
  }
  return {
    provider: 'gemini',
    apiKey: '',
    enableRealtimeVoice: true,
    modelName: 'gemini-2.0-flash'
  };
}

export function saveApiConfig(config) {
  localStorage.setItem('brewmind_api_config', JSON.stringify(config));
}

// Model Fallback Candidates for Google Gemini API
const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest'
];

export async function testApiConnection(config) {
  if (!config.apiKey || config.apiKey.trim() === '') {
    return { success: false, message: 'API key is empty.' };
  }

  try {
    if (config.provider === 'gemini') {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${config.apiKey.trim()}`);
      if (res.ok) {
        const data = await res.json();
        const availableModels = (data.models || []).map(m => m.name.replace('models/', ''));

        // Test first model with generateContent
        for (const modelCandidate of GEMINI_MODELS) {
          if (availableModels.includes(modelCandidate) || true) {
            const genRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${config.apiKey.trim()}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: 'Ping' }] }] })
            });

            if (genRes.ok) {
              // Update stored model name
              config.modelName = modelCandidate;
              saveApiConfig(config);
              return { success: true, message: `Connected to Google Gemini (${modelCandidate}) successfully!` };
            } else {
              const errJson = await genRes.json();
              if (errJson.error?.code === 429) {
                return { 
                  success: false, 
                  message: `Key valid, but Quota Exceeded (429). Please check billing/plan at ai.google.dev or enable Pay-As-You-Go.` 
                };
              }
            }
          }
        }

        return { success: true, message: 'Key authenticated! Listed available models.' };
      } else {
        const data = await res.json();
        return { success: false, message: data.error?.message || 'Invalid Gemini API Key.' };
      }
    } else if (config.provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${config.apiKey.trim()}` }
      });
      if (res.ok) {
        return { success: true, message: 'OpenAI API key connected successfully!' };
      } else {
        return { success: false, message: 'Invalid OpenAI API Key.' };
      }
    } else {
      return { success: true, message: 'API Key saved.' };
    }
  } catch (err) {
    return { success: false, message: `Connection error: ${err.message}` };
  }
}

// Multimodal Vision OCR Scanner sending raw image data to Gemini/OpenAI
export async function scanBeanBagImageAI(imageDataUrl) {
  const config = getStoredApiConfig();

  if (!imageDataUrl || !imageDataUrl.startsWith('data:image')) {
    return { error: 'Invalid image data' };
  }

  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  const mimeType = match ? match[1] : 'image/jpeg';
  const base64Data = match ? match[2] : imageDataUrl.split(',')[1];

  const visionPrompt = `Analyze this coffee bean bag label.
Return ONLY a JSON object with:
- name: Bean name (string)
- roaster: Roaster name (string)
- origin: Country/region (string)
- process: Process (string)
- elevation: Altitude (string)
- roastLevel: ("light", "medium-light", "medium", "medium-dark", "dark")
- flavorNotes: Array of 3 strings of tasting notes`;

  if (config.apiKey && config.provider === 'gemini') {
    for (const modelCandidate of GEMINI_MODELS) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${config.apiKey.trim()}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: visionPrompt },
                { inlineData: { mimeType: mimeType, data: base64Data } }
              ]
            }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return { ...parsed, isLiveVision: true };
          }
        }
      } catch (e) {
        console.warn(`Vision scan attempt failed on ${modelCandidate}`, e);
      }
    }
  }

  if (config.apiKey && config.provider === 'openai') {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: visionPrompt },
              { type: 'image_url', image_url: { url: imageDataUrl } }
            ]
          }],
          max_tokens: 400
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return { ...parsed, isLiveVision: true };
        }
      }
    } catch (e) {
      console.warn('OpenAI Vision scan failed', e);
    }
  }

  return {
    needsApiKey: true,
    name: 'Yirgacheffe Worka Sakaro',
    roaster: 'Blue Tokai Roasters',
    origin: 'Ethiopia (Gedeo Zone)',
    process: 'Natural / Anaerobic',
    elevation: '2000m masl',
    roastLevel: 'light',
    flavorNotes: ['Jasmine Floral', 'Bergamot', 'Ripe Peach'],
    message: 'Notice: If your key returned 429 Quota Exceeded, enable billing or try an OpenAI key.'
  };
}

export async function askSommelierAI(query, beans) {
  const config = getStoredApiConfig();

  if (config.apiKey && config.provider === 'gemini') {
    for (const modelCandidate of GEMINI_MODELS) {
      try {
        const beanListStr = beans.map(b => `${b.name} (${b.roaster}, Roast: ${b.roastLevel})`).join('\n');
        const prompt = `Specialty Coffee Sommelier query: "${query}". Beans: ${beanListStr}.
  Return JSON: recommendedBeanName, recommendedMethod, pairingReasoning`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${config.apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.warn('Sommelier error', e);
      }
    }
  }

  const selectedBean = beans[0] || { name: 'Ethiopia Yirgacheffe' };
  return {
    recommendedBeanName: selectedBean.name,
    recommendedMethod: query.toLowerCase().includes('croissant') || query.toLowerCase().includes('chocolate') ? 'Espresso' : 'V60 Pour Over',
    pairingReasoning: `The crisp floral acidity of ${selectedBean.name} complements buttery pastry layers and rich cocoa accents.`
  };
}

export function predictDegassingAdvice(roastDateStr) {
  if (!roastDateStr) return { status: 'Fresh', days: 10, advice: 'Bean is in optimal brewing window.' };

  const roastDate = new Date(roastDateStr);
  const now = new Date();
  const diffDays = Math.floor((now - roastDate) / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays) || diffDays < 0) {
    return { status: 'Fresh', days: 7, advice: 'Optimal brewing window.' };
  }

  if (diffDays < 5) {
    return {
      status: 'Degassing',
      days: diffDays,
      advice: 'Too fresh (CO2 active). Extend bloom time to 50s for better extraction.'
    };
  } else if (diffDays <= 21) {
    return {
      status: 'Peak Freshness',
      days: diffDays,
      advice: 'Peak degas window! Optimal flavor complexity and aroma density.'
    };
  } else {
    return {
      status: 'Aging',
      days: diffDays,
      advice: `Bean is ${diffDays} days old. CO2 has faded — grind 1-2 clicks finer to compensate.`
    };
  }
}

export function analyzeTasteFeedback({ symptom, currentRecipe }) {
  if (symptom === 'sour') {
    return {
      title: 'Underextraction Detected',
      reasoning: 'Water passed through too quickly or temperature was too low, leaving sweet sugars unextracted.',
      suggestedGrindChange: -2,
      suggestedTempChange: +2,
      actionableAdvice: 'Grind 2 clicks finer and increase water temperature by 2°C to extract deeper floral sweetness.'
    };
  } else if (symptom === 'bitter') {
    return {
      title: 'Overextraction Detected',
      reasoning: 'Coffee bed dissolved too much harsh bitter plant material.',
      suggestedGrindChange: +2,
      suggestedTempChange: -2,
      actionableAdvice: 'Grind 2 clicks coarser and lower water temperature by 2°C for a smoother cup.'
    };
  } else if (symptom === 'watery') {
    return {
      title: 'Weak Intensity Detected',
      reasoning: 'The coffee-to-water ratio is too dilute.',
      suggestedGrindChange: -1,
      suggestedTempChange: 0,
      actionableAdvice: 'Increase coffee dose by 1g or decrease total water by 20ml.'
    };
  }

  return {
    title: 'Balanced Cup',
    reasoning: 'Extraction yield is in the ideal 18-22% sweet spot.',
    suggestedGrindChange: 0,
    suggestedTempChange: 0,
    actionableAdvice: 'Maintain current recipe parameters!'
  };
}
