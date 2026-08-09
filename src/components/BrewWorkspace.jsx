import React, { useState, useEffect } from 'react';
import { BREW_METHODS, getRecipesByMethod, computeRecipe } from '../data/recipes';
import { GRINDERS } from '../data/grinders';

const METHOD_ICONS = {
  v60: 'filter_alt',
  mokapot: 'water_drop',
  frenchpress: 'coffee_maker',
  espresso: 'bolt'
};

export function BrewWorkspace({
  selectedMethodId = 'v60',
  activeBean,
  beans = [],
  onStartTimer,
  onBackToHome
}) {
  const [methodId, setMethodId] = useState(selectedMethodId || 'v60');
  const [beanId, setBeanId] = useState(activeBean ? activeBean.id : (beans[0] ? beans[0].id : ''));
  
  const currentMethodRecipes = getRecipesByMethod(methodId);
  const [recipeId, setRecipeId] = useState(currentMethodRecipes[0]?.id || null);

  const [doseGrams, setDoseGrams] = useState(currentMethodRecipes[0]?.benchmarkDose || 15);
  const [userRatioOverride, setUserRatioOverride] = useState(null);
  const [userTempOverride, setUserTempOverride] = useState(null);

  const [grinderId, setGrinderId] = useState('kingrinder-k6');
  const [userClickOverride, setUserClickOverride] = useState(null);

  const [kasuyaBalance, setKasuyaBalance] = useState('balanced');
  const [kasuyaStrength, setKasuyaStrength] = useState('medium');

  useEffect(() => {
    const recipes = getRecipesByMethod(methodId);
    if (recipes.length > 0) {
      setRecipeId(recipes[0].id);
      setDoseGrams(recipes[0].benchmarkDose);
      setUserRatioOverride(recipes[0].ratio);
      setUserTempOverride(recipes[0].temp);
    } else {
      setRecipeId(null);
    }
    setUserClickOverride(null);
  }, [methodId]);

  const handleSelectRecipe = (selectedRecipe) => {
    setRecipeId(selectedRecipe.id);
    setDoseGrams(selectedRecipe.benchmarkDose);
    setUserRatioOverride(selectedRecipe.ratio);
    setUserTempOverride(selectedRecipe.temp);
    setUserClickOverride(null);
  };

  const currentBean = beans.find(b => b.id === beanId) || activeBean || beans[0];
  const roastLevel = currentBean ? currentBean.roastLevel : 'medium-light';

  const recipe = computeRecipe({
    recipeId,
    methodId,
    doseGrams,
    roastLevel,
    grinderId,
    userClickOverride,
    userTempOverride,
    userRatioOverride,
    kasuyaOptions: { balance: kasuyaBalance, strength: kasuyaStrength }
  });

  const currentMethod = BREW_METHODS.find(m => m.id === methodId);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      
      {/* ── Header ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <button className="btn-icon" onClick={onBackToHome} aria-label="Back to home">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {currentMethod?.name || 'Brew'} Studio
          </h1>
        </div>
      </div>

      {/* ── Method Tabs ──────────────────────────────────── */}
      <div className="segmented-control">
        {BREW_METHODS.map(m => (
          <button
            key={m.id}
            onClick={() => setMethodId(m.id)}
            className={`segmented-btn ${m.id === methodId ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {METHOD_ICONS[m.id] || 'filter_alt'}
            </span>
            <span>{m.name}</span>
          </button>
        ))}
      </div>

      {/* ── Step 1: Bean Selection ────────────────────────── */}
      <section className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-sage)', color: 'var(--text-inverse)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700
          }}>1</div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Coffee Bean</h3>
          <span className="text-caption" style={{ marginLeft: 'auto' }}>{beans.length} in pantry</span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)', overflowX: 'auto', paddingBottom: '4px' }}>
          {beans.map(b => {
            const isSelected = b.id === beanId;
            return (
              <button
                key={b.id}
                onClick={() => { setBeanId(b.id); setUserClickOverride(null); }}
                className={`chip ${isSelected ? 'active' : ''}`}
                style={{ padding: '8px 14px', flexShrink: 0 }}
              >
                {isSelected && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>}
                <span style={{ fontWeight: isSelected ? 600 : 500 }}>{b.name}</span>
              </button>
            );
          })}
        </div>

        {currentBean && (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
            {currentBean.origin} · {currentBean.roastLevel} roast · {currentBean.notes || 'Specialty coffee'}
          </p>
        )}
      </section>

      {/* ── Step 2: Dose & Ratio ─────────────────────────── */}
      <section className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-sage)', color: 'var(--text-inverse)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700
          }}>2</div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Dose & Ratio</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          {/* Dose */}
          <div className="card-secondary card-interactive" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
            <span className="text-caption" style={{ marginBottom: 'var(--space-sm)' }}>Coffee Dose</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <button
                className="btn-icon"
                onClick={() => { setDoseGrams(prev => Math.max(10, prev - 1)); setUserClickOverride(null); }}
                style={{ width: '36px', height: '36px' }}
                aria-label="Decrease dose"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
              </button>
              <span className="stat-value" style={{ fontSize: '28px', color: 'var(--accent-sage)' }}>
                {doseGrams}g
              </span>
              <button
                className="btn-icon"
                onClick={() => { setDoseGrams(prev => Math.min(60, prev + 1)); setUserClickOverride(null); }}
                style={{ width: '36px', height: '36px' }}
                aria-label="Increase dose"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              </button>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginTop: 'var(--space-sm)' }}>
              {[15, 18, 20, 22, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDoseGrams(d)}
                  className={`chip ${doseGrams === d ? 'active' : ''}`}
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  {d}g
                </button>
              ))}
            </div>
          </div>

          {/* Ratio & Water */}
          <div className="card-secondary card-interactive" style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-caption">Brew Ratio</span>
              <span className="stat-value" style={{ fontSize: '18px', color: 'var(--accent-sage)', fontWeight: 700 }}>
                1:{recipe.ratio}
              </span>
            </div>

            {/* Tactile 0.5 Step Ratio Slider (1 to 30) */}
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={recipe.ratio}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setUserRatioOverride(val);
                if (window.navigator?.vibrate) {
                  try { window.navigator.vibrate(8); } catch (_) {}
                }
              }}
              aria-label="Brew ratio adjustment"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
              <span>1:1 Concentrated</span>
              <span>1:15 Benchmark</span>
              <span>1:30 Light</span>
            </div>

            {/* Quick Ratio Presets */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
              {(methodId === 'espresso' ? [1.5, 2.0, 2.5, 3.0] : [12, 15, 16, 16.5, 17]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRatioOverride(r);
                    if (window.navigator?.vibrate) {
                      try { window.navigator.vibrate(8); } catch (_) {}
                    }
                  }}
                  className={`chip ${recipe.ratio === r ? 'active' : ''}`}
                  style={{ padding: '3px 8px', fontSize: '11px' }}
                >
                  1:{r}
                </button>
              ))}
            </div>

            <div style={{
              marginTop: 'auto', paddingTop: 'var(--space-sm)',
              borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Water</span>
              <span className="stat-value" style={{ fontSize: '20px', color: 'var(--accent)' }}>
                {recipe.waterMl}{methodId === 'espresso' ? 'g' : 'ml'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Step 3: Recipe Selection ─────────────────────── */}
      <section className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-sage)', color: 'var(--text-inverse)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700
          }}>3</div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Technique</h3>
          <span className="text-caption" style={{ marginLeft: 'auto' }}>
            {currentMethodRecipes.length} recipes
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {currentMethodRecipes.map(r => {
            const isSelected = recipeId === r.id;
            return (
              <div
                key={r.id}
                onClick={() => handleSelectRecipe(r)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleSelectRecipe(r)}
                className={`card-secondary card-interactive recipe-item-glass ${isSelected ? 'selected-recipe' : ''}`}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: '2px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>{r.title}</span>
                    <span className="badge badge-sage" style={{ fontSize: '10px' }}>{r.badge}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {r.author} · {r.targetTime} · 1:{r.ratio} · {r.temp}°C
                  </p>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined filled" style={{ color: 'var(--accent-sage)', fontSize: '22px' }}>
                    check_circle
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Kasuya 4:6 Controls */}
        {recipeId === 'tetsu-kasuya' && (
          <div className="card-accent" style={{ marginTop: 'var(--space-md)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>4:6 Method Controls</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.8, display: 'block', marginBottom: '6px' }}>
                  Balance (First 40%)
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { id: 'sweeter', label: 'Sweeter' },
                    { id: 'balanced', label: 'Balanced' },
                    { id: 'brighter', label: 'Brighter' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setKasuyaBalance(opt.id)}
                      style={{
                        flex: 1, padding: '6px 4px', fontSize: '12px',
                        borderRadius: 'var(--radius-xs)', border: 'none',
                        background: kasuyaBalance === opt.id ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                        color: '#FFF', fontWeight: kasuyaBalance === opt.id ? 700 : 400,
                        cursor: 'pointer', transition: 'all 150ms'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.8, display: 'block', marginBottom: '6px' }}>
                  Strength (Last 60%)
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { id: 'medium', label: 'Medium' },
                    { id: 'strong', label: 'Strong' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setKasuyaStrength(opt.id)}
                      style={{
                        flex: 1, padding: '6px 4px', fontSize: '12px',
                        borderRadius: 'var(--radius-xs)', border: 'none',
                        background: kasuyaStrength === opt.id ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                        color: '#FFF', fontWeight: kasuyaStrength === opt.id ? 700 : 400,
                        cursor: 'pointer', transition: 'all 150ms'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Step 4: Grind & Temperature ──────────────────── */}
      <section className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-sage)', color: 'var(--text-inverse)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700
          }}>4</div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Grind & Temperature</h3>
          <span className="text-caption" style={{ marginLeft: 'auto' }}>Suggested</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          {/* Grinder & Click */}
          <div className="card-secondary" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-label">Grinder</span>
              <select
                value={grinderId}
                onChange={e => { setGrinderId(e.target.value); setUserClickOverride(null); }}
                className="input-field"
                style={{ width: 'auto', padding: '6px 30px 6px 10px', fontSize: '13px' }}
              >
                {GRINDERS.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span className="text-caption">Setting</span>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {recipe.activeRecipe ? recipe.activeRecipe.grindType : 'Medium-Fine'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="stat-value" style={{ fontSize: '24px', color: 'var(--accent-sage)' }}>
                  {recipe.grinderClick}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '4px' }}>clicks</span>
              </div>
            </div>

            <input
              type="range"
              min={recipe.recommendedClickRange.min - 10}
              max={recipe.recommendedClickRange.max + 15}
              value={recipe.grinderClick}
              onChange={e => setUserClickOverride(parseInt(e.target.value))}
              aria-label="Grind size adjustment"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Finer</span>
              <span>Coarser</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="card-secondary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)' }}>
            <span className="text-caption">Water Temperature</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <button
                className="btn-icon"
                onClick={() => setUserTempOverride(Math.max(85, recipe.waterTemp - 1))}
                style={{ width: '36px', height: '36px' }}
                aria-label="Decrease temperature"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
              </button>
              <span className="stat-value" style={{ fontSize: '28px', color: 'var(--accent)' }}>
                {recipe.waterTemp}°C
              </span>
              <button
                className="btn-icon"
                onClick={() => setUserTempOverride(Math.min(100, recipe.waterTemp + 1))}
                style={{ width: '36px', height: '36px' }}
                aria-label="Increase temperature"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
              {recipe.waterTemp >= 98 ? 'Boiling — light roasts'
                : recipe.waterTemp <= 90 ? 'Cooler — dark roasts'
                : 'Standard specialty range'}
            </p>
          </div>
        </div>

        {/* Extraction Hint */}
        <div style={{
          marginTop: 'var(--space-md)', padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-card-secondary)',
          display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent-sage)', flexShrink: 0, marginTop: '1px' }}>
            info
          </span>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
              {recipe.grindHint.title}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {recipe.grindHint.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Step 5: Pour Timeline ────────────────────────── */}
      <section className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-sage)', color: 'var(--text-inverse)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700
          }}>5</div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Pour Schedule</h3>
          <span className="text-mono text-caption" style={{ marginLeft: 'auto', textTransform: 'none' }}>
            {recipe.steps.length} steps · ~{recipe.totalTimeSec}s
          </span>
        </div>

        {/* Horizontal timeline */}
        <div style={{
          display: 'flex', gap: '2px', overflowX: 'auto', paddingBottom: '4px'
        }}>
          {recipe.steps.map((st, idx) => (
            <div key={idx} style={{
              flex: '1 0 auto', minWidth: '120px', maxWidth: '180px',
              padding: '12px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card-secondary)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-mono" style={{ fontSize: '11px', color: 'var(--accent-sage)', fontWeight: 700 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {st.duration}s
                </span>
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{st.title}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.3 }}>{st.instruction}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Start Brew CTA ───────────────────────────────── */}
      <button
        className="btn btn-primary"
        onClick={() => onStartTimer({ recipe, bean: currentBean })}
        style={{
          padding: '18px', fontSize: '16px', fontWeight: 700,
          borderRadius: 'var(--radius-full)',
          background: 'var(--accent-sage)',
          boxShadow: '0 8px 32px var(--accent-sage-light)'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>play_arrow</span>
        Start Brew
      </button>

    </div>
  );
}
