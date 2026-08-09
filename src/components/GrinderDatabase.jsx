import React, { useState } from 'react';
import { GRINDERS } from '../data/grinders';
import { Sparkles, Sliders, ArrowRight, Settings } from 'lucide-react';

export function GrinderDatabase() {
  const [selectedGrinderId, setSelectedGrinderId] = useState('kingrinder-k6');
  const [clicks, setClicks] = useState(58);

  const activeGrinder = GRINDERS.find(g => g.id === selectedGrinderId) || GRINDERS[0];

  return (
    <div style={{ padding: '0 20px 30px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ marginTop: '10px' }}>
        <h2 style={{ fontSize: '1.4rem' }}>Grinder Database</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Precision Click Calibration & Conversion</p>
      </div>

      {/* Grinder Card Selector */}
      <div className="card">
        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Select Grinder Model</label>
        <select 
          value={selectedGrinderId} 
          onChange={e => {
            setSelectedGrinderId(e.target.value);
            const g = GRINDERS.find(x => x.id === e.target.value);
            if (g) setClicks(g.ranges.v60.recommended);
          }}
          style={{ 
            width: '100%',
            padding: '12px', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-color)', 
            background: 'var(--bg-card-secondary)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}
        >
          {GRINDERS.map(g => (
            <option key={g.id} value={g.id}>{g.name} ({g.type})</option>
          ))}
        </select>

        <div style={{ marginTop: '14px', padding: '12px', background: 'var(--bg-card-secondary)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span>Burr Specs:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{activeGrinder.burr}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <span>Adjustment Step:</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-copper)' }}>{activeGrinder.clickStepMicrons} µm / click</span>
          </div>
        </div>
      </div>

      {/* Click Target Method Ranges Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>Recommended Clicks Matrix</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { key: 'espresso', label: '⚡ Espresso', icon: '⚡' },
            { key: 'mokapot', label: '🫖 Moka Pot', icon: '🫖' },
            { key: 'v60', label: '☕ V60 Pour Over', icon: '☕' },
            { key: 'frenchpress', label: '🥛 French Press', icon: '🥛' }
          ].map(m => {
            const range = activeGrinder.ranges[m.key];
            return (
              <div key={m.key} className="card-secondary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Range: {range.min} - {range.max} clicks</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-copper" style={{ fontSize: '0.85rem' }}>
                    {range.recommended} Clicks
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
