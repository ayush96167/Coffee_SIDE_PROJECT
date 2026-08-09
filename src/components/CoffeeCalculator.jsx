import React, { useState } from 'react';
import { askSommelierAI } from '../services/aiService';
import { INITIAL_BEANS } from '../data/mockData';

export function CoffeeCalculator() {
  // Calculator 1: Japanese Ice Brew Ratio Math
  const [totalIceWater, setTotalIceWater] = useState(300);
  const [iceRatioPercent, setIceRatioPercent] = useState(40); // 40% Ice, 60% Hot Water
  const [targetRatio, setTargetRatio] = useState(15);

  const totalDoseGrams = (totalIceWater / targetRatio).toFixed(1);
  const iceGrams = ((totalIceWater * iceRatioPercent) / 100).toFixed(0);
  const hotWaterGrams = (totalIceWater - iceGrams).toFixed(0);

  // Sommelier & Food Pairing State
  const [foodQuery, setFoodQuery] = useState('Butter Croissant');
  const [isAskingSommelier, setIsAskingSommelier] = useState(false);
  const [sommelierResult, setSommelierResult] = useState(null);

  const handleAskSommelier = async (e) => {
    e.preventDefault();
    if (!foodQuery.trim()) return;

    setIsAskingSommelier(true);
    const result = await askSommelierAI(foodQuery, INITIAL_BEANS);
    setSommelierResult(result);
    setIsAskingSommelier(false);
  };

  return (
    <div style={{ padding: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <h1 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>
          Barista Tools & AI Sommelier
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Food pairing recommendations and Japanese Ice Brew ratio calculators
        </p>
      </div>

      {/* 1. AI Coffee Sommelier & Food Pairing Assistant */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid var(--accent-sage)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--accent-sage)', fontSize: '28px' }}>restaurant</span>
          <div>
            <h2 className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              AI Coffee Sommelier & Food Pairing
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Tell AI what you're eating or your current mood to find the perfect coffee bean & method pairing.
            </p>
          </div>
        </div>

        <form onSubmit={handleAskSommelier} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text"
            placeholder="e.g. Lemon Tart, Butter Croissant, Dark Chocolate, or Late Night Focus"
            value={foodQuery}
            onChange={e => setFoodQuery(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-secondary)', fontSize: '0.9rem' }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isAskingSommelier}
            style={{ padding: '12px 24px', width: 'auto', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}
          >
            {isAskingSommelier ? 'Pairing...' : 'Ask Sommelier'}
          </button>
        </form>

        {sommelierResult && (
          <div className="card-secondary" style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--accent-sage-light)', borderColor: 'var(--accent-sage)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-green" style={{ fontSize: '0.78rem' }}>
                Recommended Bean: {sommelierResult.recommendedBeanName}
              </span>
              <span className="badge badge-copper" style={{ fontSize: '0.78rem' }}>
                Method: {sommelierResult.recommendedMethod}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontStyle: 'italic', marginTop: '4px' }}>
              "{sommelierResult.pairingReasoning}"
            </p>
          </div>
        )}
      </div>

      {/* 2. Japanese Flash Ice Brew Calculator */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--accent-copper)', fontSize: '28px' }}>ac_unit</span>
          <div>
            <h2 className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              Japanese Flash Ice Brew Math
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Instant chilling over ice traps volatile aroma and bright fruit sweetness.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Output Beverage (ml)</label>
            <input 
              type="number"
              value={totalIceWater}
              onChange={e => setTotalIceWater(parseInt(e.target.value) || 300)}
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card-secondary)', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Ice Ratio ({iceRatioPercent}% Ice / {100 - iceRatioPercent}% Hot Water)</label>
            <input 
              type="range"
              min="30"
              max="50"
              value={iceRatioPercent}
              onChange={e => setIceRatioPercent(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Math Calculation Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '10px' }}>
          <div className="card-secondary" style={{ textAlign: 'center', padding: '16px 8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Coffee Dose</span>
            <div className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--accent-sage)', fontWeight: 600, marginTop: '2px' }}>
              {totalDoseGrams} g
            </div>
          </div>

          <div className="card-secondary" style={{ textAlign: 'center', padding: '16px 8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Ice in Carafe</span>
            <div className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--accent-copper)', fontWeight: 600, marginTop: '2px' }}>
              {iceGrams} g
            </div>
          </div>

          <div className="card-secondary" style={{ textAlign: 'center', padding: '16px 8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Hot Pour Water</span>
            <div className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
              {hotWaterGrams} ml
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
