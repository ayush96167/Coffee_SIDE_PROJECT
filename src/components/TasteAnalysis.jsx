import React, { useState } from 'react';

export function TasteAnalysis({ recipe, bean, onSaveBrewLog }) {
  const [showSurveyModal, setShowSurveyModal] = useState(true);
  
  const [ratings, setRatings] = useState({
    acidity: 3, sweetness: 4, body: 3, clarity: 4, balance: 3
  });

  const [tastedNotes, setTastedNotes] = useState(['Jasmine Floral', 'Bergamot']);
  const [userNotes, setUserNotes] = useState('');

  const [hasRefractometerInput, setHasRefractometerInput] = useState(false);
  const [userExtractionYield, setUserExtractionYield] = useState('');

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1, sender: 'ai',
      text: `I've analyzed your ${recipe.eliteRecipe ? recipe.eliteRecipe.title : recipe.method.name} brew with ${bean ? bean.name : 'your coffee beans'}. Ask me anything about dialing in your extraction.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const activeRecipeTitle = recipe.eliteRecipe ? `${recipe.eliteRecipe.author} — ${recipe.eliteRecipe.title}` : recipe.method.name;

  const avgRating = (ratings.acidity + ratings.sweetness + ratings.body + ratings.clarity + ratings.balance) / 5;
  const starRating = (avgRating * 1.25).toFixed(1);
  const cupScore = Math.round(avgRating * 24 + 4);

  const FLAVOR_OPTIONS = [
    'Jasmine Floral', 'Bergamot', 'Ripe Peach', 'Citrus Zest',
    'Honey Syrup', 'Dark Cocoa', 'Roasted Hazelnut', 'Red Berries',
    'Brown Sugar', 'Milk Chocolate', 'Vanilla', 'Stone Fruit'
  ];

  const RATING_CATEGORIES = [
    { key: 'acidity', label: 'Acidity', desc: 'Sour/Sharp → Crisp & Bright', icon: 'brightness_7' },
    { key: 'sweetness', label: 'Sweetness', desc: 'Flat → Rich Sugar', icon: 'water_drop' },
    { key: 'body', label: 'Body & Mouthfeel', desc: 'Thin → Full & Syrupy', icon: 'texture' },
    { key: 'clarity', label: 'Flavor Clarity', desc: 'Muddy → Distinct Notes', icon: 'visibility' },
    { key: 'balance', label: 'Overall Balance', desc: 'Harsh → Harmonious', icon: 'balance' }
  ];

  const RATING_LABELS = ['Bad', 'Fair', 'Good', 'Ideal'];

  // AI Analysis Generator
  const generateGeminiAnalysis = () => {
    const { doseGrams, waterMl, waterTemp, grinderClick, grinder } = recipe;
    const beanName = bean ? bean.name : 'Specialty Coffee';
    const beanRoast = bean ? bean.roastLevel : 'light';

    let extractionDiagnosis = 'Optimal Balanced Extraction';
    if (ratings.acidity <= 2 && ratings.sweetness <= 2) {
      extractionDiagnosis = 'Under-extracted (Fast Drawdown & High Organic Acid Sharpness)';
    } else if (ratings.balance <= 2 && ratings.sweetness <= 2) {
      extractionDiagnosis = 'Over-extracted (Slow Drawdown & Polyphenol Bitterness)';
    } else if (ratings.body <= 2) {
      extractionDiagnosis = 'Slightly Diluted / Weak Concentration';
    }

    const eyText = (hasRefractometerInput && userExtractionYield)
      ? `Your measured Refractometer Extraction Yield is ${userExtractionYield}%. `
      : `Extraction yield estimated via sensory cup evaluation. `;

    return {
      diagnosis: extractionDiagnosis,
      paragraphs: [
        { title: 'Extraction Analysis', text: `Analysis of your brew using ${activeRecipeTitle} with ${beanName} (${beanRoast} roast) shows a profile rating of ${starRating}/5. Utilizing ${doseGrams}g dose against ${waterMl}ml water (${waterTemp}°C) on the ${grinder.name} at click setting ${grinderClick}. ${eyText}${ratings.sweetness >= 3 ? 'The saturation phase successfully solubilized complex carbohydrates, achieving clean sugar expression.' : 'Sugar solubilization fell slightly short, leaving acidity sharp rather than rounded.'}` },
        { title: 'Recipe Benchmark', text: `Compared to the ideal benchmark for ${activeRecipeTitle}, your cup achieved ${ratings.clarity >= 3 ? 'exceptional clarity and distinct origin notes' : 'a slightly muted flavor profile'}. Your feedback rates Body at ${ratings.body}/4 and Balance at ${ratings.balance}/4. ${ratings.acidity === 4 ? 'Vibrant acidity was extracted cleanly.' : 'Acidity is integrated with overall cup structure.'}` },
        { title: 'Next Brew', text: `To optimize your next cup of ${beanName}, ${ratings.sweetness < 3 ? `tighten grind by 2 clicks (${grinderClick} → ${grinderClick - 2}) to extend contact time.` : ratings.balance < 3 ? `coarsen grind by 1-2 clicks (${grinderClick} → ${grinderClick + 2}) to prevent bitterness.` : `maintain click ${grinderClick} at ${waterTemp}°C — parameters are dialed in.`}` }
      ]
    };
  };

  const aiAnalysis = generateGeminiAnalysis();

  // Radar chart
  const axes = [
    { key: 'sweetness', label: 'Sweet', val: ratings.sweetness, angle: 0 },
    { key: 'acidity', label: 'Acid', val: ratings.acidity, angle: 60 },
    { key: 'body', label: 'Body', val: ratings.body, angle: 120 },
    { key: 'balance', label: 'Balance', val: ratings.balance, angle: 180 },
    { key: 'clarity', label: 'Clarity', val: ratings.clarity, angle: 240 },
    { key: 'aroma', label: 'Aroma', val: Math.min(4, Math.round((ratings.clarity + ratings.sweetness) / 2)), angle: 300 }
  ];

  const getPoint = (val, angleDeg, maxVal = 4, radius = 38) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    const r = (val / maxVal) * radius;
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
  };

  const pointsString = axes.map(a => { const p = getPoint(a.val, a.angle); return `${p.x},${p.y}`; }).join(' ');

  // EY Gauge
  const numEY = parseFloat(userExtractionYield);
  const isEYValid = hasRefractometerInput && !isNaN(numEY) && numEY > 0;
  let eyCategoryLabel = 'No measurement';
  if (isEYValid) {
    if (numEY < 18) eyCategoryLabel = 'Under (<18%)';
    else if (numEY <= 22) eyCategoryLabel = 'Ideal (18-22%)';
    else eyCategoryLabel = 'Over (>22%)';
  }

  const handleSave = () => {
    onSaveBrewLog({
      id: `brew-${Date.now()}`,
      date: new Date().toISOString(),
      beanId: bean ? bean.id : 'custom-bean',
      beanName: bean ? bean.name : 'Custom Bean',
      methodId: recipe.method.id,
      methodName: recipe.method.name,
      recipeTitle: activeRecipeTitle,
      grinderId: recipe.grinder.id,
      grinderName: recipe.grinder.name,
      grinderClick: recipe.grinderClick,
      doseGrams: recipe.doseGrams,
      ratio: recipe.ratio,
      waterMl: recipe.waterMl,
      waterTemp: recipe.waterTemp,
      rating: parseFloat(starRating),
      ratingsSurvey: ratings,
      userExtractionYield: (hasRefractometerInput && userExtractionYield) ? userExtractionYield : null,
      tastedNotes,
      userNotes: userNotes || 'Brewed with BrewMind.'
    });
  };

  const handleSendMessage = (textToSend = null) => {
    const messageText = textToSend || chatInput;
    if (!messageText.trim()) return;

    setChatMessages(prev => [...prev, {
      id: Date.now(), sender: 'user', text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    if (!textToSend) setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let aiReply = `Based on your survey ratings for ${activeRecipeTitle}, `;
      const query = messageText.toLowerCase();
      if (query.includes('sharp') || query.includes('sour') || query.includes('acid')) {
        aiReply += `grind 2 clicks finer (${recipe.grinderClick} → ${recipe.grinderClick - 2}) or raise water temp by 2°C to sweeten the cup.`;
      } else if (query.includes('sweet') || query.includes('sugar')) {
        aiReply += `extend bloom by 10s and perform a gentle swirl to ensure complete thermal saturation.`;
      } else if (query.includes('bitter') || query.includes('astringent')) {
        aiReply += `grind 2 clicks coarser (${recipe.grinderClick} → ${recipe.grinderClick + 2}) or lower water temp to ${recipe.waterTemp - 2}°C.`;
      } else {
        aiReply += `your parameters (${recipe.doseGrams}g, 1:${recipe.ratio} at ${recipe.waterTemp}°C) produced a cup score of ${cupScore}/100. For heavier body, tighten ratio to 1:${(recipe.ratio - 1).toFixed(1)}.`;
      }

      setChatMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'ai', text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsAiTyping(false);
    }, 1000);
  };

  const toggleNote = (note) => {
    setTastedNotes(prev => prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note]);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

      {/* ═══ SURVEY MODAL ═══════════════════════════════════ */}
      {showSurveyModal && (
        <div className="modal-overlay">
          <div className="modal-sheet">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-accent" style={{ marginBottom: '4px' }}>Cup Tasting</span>
                <h2 style={{ fontSize: '22px', fontWeight: 700 }}>How was your cup?</h2>
              </div>
              <button className="btn-icon" onClick={() => setShowSurveyModal(false)} aria-label="Close survey">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Rate each factor from <strong>1</strong> (poor) to <strong>4</strong> (ideal).
            </p>

            {/* Ratings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {RATING_CATEGORIES.map(cat => (
                <div key={cat.key} className="card-secondary" style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent-sage)' }}>{cat.icon}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{cat.label}</span>
                    </div>
                    <span className="text-mono" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 700 }}>
                      {ratings[cat.key]}/4
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {[1, 2, 3, 4].map(score => (
                      <button
                        key={score}
                        onClick={() => setRatings({ ...ratings, [cat.key]: score })}
                        style={{
                          padding: '10px 4px', borderRadius: 'var(--radius-xs)', border: 'none',
                          background: ratings[cat.key] === score ? 'var(--accent-sage)' : 'var(--bg-elevated)',
                          color: ratings[cat.key] === score ? 'var(--text-inverse)' : 'var(--text-secondary)',
                          fontSize: '12px', fontWeight: ratings[cat.key] === score ? 700 : 500,
                          cursor: 'pointer', transition: 'all 150ms var(--ease-out)'
                        }}
                      >
                        {score} {RATING_LABELS[score - 1]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Refractometer */}
            <div className="card-secondary" style={{ padding: '14px 16px', borderStyle: 'dashed', borderColor: 'var(--accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)' }}>science</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Refractometer (Optional)</span>
                </div>
                <input
                  type="checkbox" checked={hasRefractometerInput}
                  onChange={e => { setHasRefractometerInput(e.target.checked); if (!e.target.checked) setUserExtractionYield(''); }}
                />
              </div>
              {hasRefractometerInput && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                  <input
                    type="number" step="0.1" min="12" max="28"
                    value={userExtractionYield}
                    onChange={e => setUserExtractionYield(e.target.value)}
                    placeholder="e.g. 20.2"
                    className="input-field"
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}>% EY</span>
                </div>
              )}
            </div>

            {/* Flavor Notes */}
            <div>
              <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>Flavor Notes</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {FLAVOR_OPTIONS.map(note => (
                  <button
                    key={note}
                    onClick={() => toggleNote(note)}
                    className={`chip ${tastedNotes.includes(note) ? 'active' : ''}`}
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Tasting Notes</span>
              <input
                type="text" value={userNotes} onChange={e => setUserNotes(e.target.value)}
                placeholder="e.g. Peak sweetness, floral aftertaste..."
                className="input-field"
              />
            </div>

            {/* Submit */}
            <button
              className="btn btn-primary"
              onClick={() => setShowSurveyModal(false)}
              style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--accent)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>auto_awesome</span>
              Generate AI Report
            </button>
          </div>
        </div>
      )}

      {/* ═══ RESULTS DASHBOARD ════════════════════════════ */}

      {/* Header */}
      <header style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-sm)' }}>
          <button className="chip" onClick={() => setShowSurveyModal(true)} style={{ fontSize: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
            Retake Survey
          </button>
        </div>
        <span className="stat-value" style={{ fontSize: '64px', color: 'var(--accent)', lineHeight: 1, display: 'block' }}>
          {cupScore}
        </span>
        <h1 style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
          {cupScore >= 90 ? 'World Class Cup' : cupScore >= 80 ? 'Excellent Cup' : 'Decent Brew'}
        </h1>
        <div style={{ display: 'flex', gap: '6px', marginTop: 'var(--space-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-sage">{bean ? bean.name : 'Coffee'}</span>
          <span className="badge badge-accent">{activeRecipeTitle}</span>
          <span className="text-mono badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            ★ {starRating}
          </span>
        </div>
      </header>

      {/* Visualizations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
        {/* Radar */}
        <div className="glass-card">
          <h3 className="text-label" style={{ marginBottom: 'var(--space-sm)' }}>Flavor Profile</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="200" height="200" viewBox="0 0 100 100">
              {[0.75, 0.5, 0.25].map((scale, i) => (
                <polygon key={i}
                  points={axes.map(a => { const p = getPoint(4 * scale, a.angle); return `${p.x},${p.y}`; }).join(' ')}
                  fill="none" stroke="var(--border-strong)" strokeWidth="0.5"
                />
              ))}
              <polygon points={pointsString} fill="var(--accent-sage-light)" stroke="var(--accent-sage)" strokeWidth="1.5" />
              {axes.map(a => {
                const p = getPoint(4, a.angle, 4, 46);
                return <text key={a.key} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="5" fill="var(--text-muted)" fontFamily="var(--font-sans)" fontWeight="600">{a.label}</text>;
              })}
            </svg>
          </div>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
            {tastedNotes.map(n => <span key={n} className="chip" style={{ fontSize: '11px', padding: '3px 8px', cursor: 'default' }}>{n}</span>)}
          </div>
        </div>

        {/* EY Gauge */}
        <div className="glass-card">
          <h3 className="text-label" style={{ marginBottom: 'var(--space-sm)' }}>Extraction Yield</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-md) 0' }}>
            {isEYValid ? (
              <span className="stat-value" style={{ fontSize: '40px', color: 'var(--text-primary)' }}>
                {userExtractionYield}<span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>%</span>
              </span>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--text-muted)' }}>science</span>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>No reading entered</p>
                <button className="chip" onClick={() => setShowSurveyModal(true)} style={{ marginTop: '8px', fontSize: '12px' }}>
                  + Add EY %
                </button>
              </div>
            )}
          </div>
          {/* Bar */}
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Under (&lt;18%)</span><span>Ideal (18-22%)</span><span>Over (&gt;22%)</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex', position: 'relative' }}>
              <div style={{ width: '20%', background: 'var(--bg-elevated)' }} />
              <div style={{ width: '60%', background: 'var(--accent-sage-light)' }} />
              <div style={{ width: '20%', background: 'var(--bg-elevated)' }} />
              {isEYValid && (
                <div style={{
                  position: 'absolute', top: '-2px', bottom: '-2px', width: '4px',
                  background: 'var(--accent)', borderRadius: 'var(--radius-full)',
                  left: `${Math.min(95, Math.max(5, ((numEY - 14) / 12) * 100))}%`,
                  boxShadow: '0 0 8px var(--accent)'
                }} />
              )}
            </div>
            {isEYValid && (
              <p style={{ fontSize: '12px', color: 'var(--accent)', textAlign: 'center', marginTop: '6px', fontWeight: 600 }}>
                {eyCategoryLabel}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AI Report */}
      <section className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <span className="material-symbols-outlined filled" style={{ fontSize: '20px', color: 'var(--accent)' }}>auto_awesome</span>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>AI Extraction Report</h3>
          <span className="badge badge-accent" style={{ marginLeft: 'auto' }}>Gemini</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {aiAnalysis.paragraphs.map((p, i) => (
            <div key={i} style={{
              padding: '12px 16px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card-secondary)', borderLeft: `3px solid ${i === 2 ? 'var(--accent)' : 'var(--accent-sage)'}`
            }}>
              <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{p.title}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat */}
      <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--accent-sage)' }}>chat</span>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Ask Barista AI</h3>
        </div>

        {/* Suggestions */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['Why was it slightly sharp?', 'How to get more sweetness?', 'Change grind or temp first?'].map((prompt, i) => (
            <button key={i} onClick={() => handleSendMessage(prompt)} className="chip" style={{ flexShrink: 0, fontSize: '12px' }}>
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{
          maxHeight: '240px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)',
          padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-card-secondary)'
        }}>
          {chatMessages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '10px 14px',
                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.sender === 'user' ? 'var(--accent-sage)' : 'var(--bg-card-solid)',
                color: msg.sender === 'user' ? 'var(--text-inverse)' : 'var(--text-primary)',
                fontSize: '14px', lineHeight: 1.45
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', padding: '0 4px' }}>{msg.time}</span>
            </div>
          ))}
          {isAiTyping && (
            <div style={{ fontSize: '13px', color: 'var(--accent-sage)', fontStyle: 'italic', padding: '4px' }}>
              Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <input
            type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your brew..."
            className="input-field" style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
          />
          <button
            onClick={() => handleSendMessage()}
            aria-label="Send message"
            style={{
              width: '44px', height: '44px', borderRadius: 'var(--radius-full)', border: 'none',
              background: 'var(--accent-sage)', color: 'var(--text-inverse)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
          </button>
        </div>
      </section>

      {/* Save Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1, borderRadius: 'var(--radius-md)', background: 'var(--accent-sage)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>bookmark</span>
          Save to Timeline
        </button>
        <button className="btn btn-secondary" onClick={() => setShowSurveyModal(true)} style={{ flex: 1, borderRadius: 'var(--radius-md)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
          Re-evaluate
        </button>
      </div>

    </div>
  );
}
