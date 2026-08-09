import React from 'react';
import { GitCompare, ArrowLeft, ArrowUpRight, ArrowDownRight, Minus, Star } from 'lucide-react';

export function CompareMode({ currentBrew, previousBrew, onCloseCompare }) {
  if (!currentBrew || !previousBrew) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p>Need at least 2 brews to compare!</p>
        <button className="btn btn-secondary" onClick={onCloseCompare} style={{ marginTop: '16px' }}>Back</button>
      </div>
    );
  }

  const clickDiff = currentBrew.grinderClick - previousBrew.grinderClick;
  const tempDiff = currentBrew.waterTemp - previousBrew.waterTemp;
  const ratioDiff = (currentBrew.ratio - previousBrew.ratio).toFixed(1);
  const ratingDiff = (currentBrew.rating - previousBrew.rating).toFixed(1);

  return (
    <div style={{ padding: '0 20px 30px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <button className="btn-icon" onClick={onCloseCompare} style={{ width: '36px', height: '36px' }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GitCompare size={18} style={{ color: 'var(--accent-copper)' }} /> Git Brew Delta
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Side-by-Side Cup Comparison</p>
        </div>
        <div style={{ width: '36px' }}></div>
      </div>

      {/* Comparison Header Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="card-secondary" style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-copper)' }}>
          <span className="badge badge-copper" style={{ marginBottom: '4px' }}>Latest Brew</span>
          <h4 style={{ fontSize: '0.95rem' }}>{currentBrew.beanName}</h4>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 700, marginTop: '4px' }}>
            ★ {currentBrew.rating}
          </div>
        </div>

        <div className="card-secondary" style={{ background: 'var(--bg-card)' }}>
          <span className="badge badge-copper" style={{ marginBottom: '4px', background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Previous Brew</span>
          <h4 style={{ fontSize: '0.95rem' }}>{previousBrew.beanName}</h4>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 700, marginTop: '4px' }}>
            ★ {previousBrew.rating}
          </div>
        </div>
      </div>

      {/* Variable Deltas Card */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: '14px' }}>Variable Metric Deltas</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Grind Clicks Delta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>⚙️ Grinder Clicks</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {previousBrew.grinderClick} → {currentBrew.grinderClick} Clicks
              </div>
            </div>
            <span className={`badge ${clickDiff === 0 ? 'badge-copper' : clickDiff > 0 ? 'badge-green' : 'badge-copper'}`}>
              {clickDiff > 0 ? `+${clickDiff} Coarser` : clickDiff < 0 ? `${clickDiff} Finer` : 'Unchanged'}
            </span>
          </div>

          {/* Water Temp Delta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>🌡️ Water Temp</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {previousBrew.waterTemp}°C → {currentBrew.waterTemp}°C
              </div>
            </div>
            <span className="badge badge-copper">
              {tempDiff > 0 ? `+${tempDiff}°C Hotter` : tempDiff < 0 ? `${tempDiff}°C Cooler` : 'Unchanged'}
            </span>
          </div>

          {/* Ratio Delta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>⚖️ Brew Ratio</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                1:{previousBrew.ratio} → 1:{currentBrew.ratio}
              </div>
            </div>
            <span className="badge badge-green">
              {parseFloat(ratioDiff) > 0 ? `+${ratioDiff} Water` : parseFloat(ratioDiff) < 0 ? `${ratioDiff} Concentrated` : 'Unchanged'}
            </span>
          </div>

          {/* Rating Delta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>★ Cup Quality Score</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {previousBrew.rating} → {currentBrew.rating} Stars
              </div>
            </div>
            <span className="badge badge-green" style={{ background: parseFloat(ratingDiff) >= 0 ? 'var(--accent-green-light)' : 'rgba(200, 50, 50, 0.12)', color: parseFloat(ratingDiff) >= 0 ? 'var(--accent-green)' : '#D32F2F' }}>
              {parseFloat(ratingDiff) > 0 ? `+${ratingDiff} Better` : `${ratingDiff}`}
            </span>
          </div>
        </div>
      </div>

      {/* Barista Insight */}
      <div className="card" style={{ background: 'var(--accent-copper-light)', borderColor: 'var(--accent-copper)' }}>
        <h4 style={{ fontSize: '0.92rem', color: 'var(--accent-copper)', marginBottom: '4px' }}>
          💡 Taste Outcome Analysis
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          {parseFloat(ratingDiff) > 0 
            ? `Your adjust to ${currentBrew.grinderClick} clicks at ${currentBrew.waterTemp}°C successfully increased overall sweetness and extraction balance.`
            : `Slight variance in extraction. Try fine-tuning water ratio by 0.5 next time.`
          }
        </p>
      </div>

    </div>
  );
}
