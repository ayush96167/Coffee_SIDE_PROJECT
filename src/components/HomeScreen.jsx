import React from 'react';
import { BREW_METHODS } from '../data/recipes';

const METHOD_ICONS = {
  v60: 'filter_alt',
  mokapot: 'water_drop',
  frenchpress: 'coffee_maker',
  espresso: 'bolt'
};

const METHOD_DESCRIPTIONS = {
  v60: 'Clean, floral, high clarity',
  mokapot: 'Rich, intense stovetop brew',
  frenchpress: 'Full body, heavy mouthfeel',
  espresso: 'Concentrated 9-bar pressure'
};

export function HomeScreen({
  activeBean,
  beans,
  recentBrews,
  onSelectMethod,
  onOpenVoice,
  onSelectBrewForCompare,
  onNavigateTab
}) {
  const totalBrews = recentBrews.length + 10;
  const beanRemaining = activeBean ? activeBean.remainingGrams : 250;
  const beanTotal = 250;
  const remainingPercent = Math.round((beanRemaining / beanTotal) * 100);
  const circumference = 2 * Math.PI * 20;
  const strokeOffset = circumference - (circumference * remainingPercent) / 100;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 'var(--space-sm)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.03em' }}>
          Good morning
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {totalBrews} brews logged · {beans.length} beans in your library
        </p>
      </section>

      {/* ── Active Bean Widget ────────────────────────────── */}
      <section
        className="glass-card card-interactive"
        onClick={() => onNavigateTab('beans')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: '16px 20px'
        }}
      >
        {/* Ring gauge */}
        <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
          <svg width="52" height="52" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="22" cy="22" r="20" stroke="var(--bg-elevated)" strokeWidth="3" fill="none" />
            <circle
              cx="22" cy="22" r="20"
              stroke="var(--accent-sage)"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span className="text-mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {remainingPercent}%
            </span>
          </div>
        </div>

        {/* Bean info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="text-caption" style={{ marginBottom: '2px' }}>Active Bean</p>
          <h3 className="truncate" style={{ fontSize: '16px', fontWeight: 700 }}>
            {activeBean ? activeBean.name : 'Yirgacheffe Worka Sakaro'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {activeBean ? activeBean.roastLevel : 'Light'} roast · {beanRemaining}g remaining
          </p>
        </div>

        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>
          chevron_right
        </span>
      </section>

      {/* ── Brewing Methods — 2×2 Grid ───────────────────── */}
      <section>
        <h2 className="section-header" style={{ marginBottom: 'var(--space-md)' }}>
          Start Brewing
        </h2>

        <div
          className="stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--space-md)'
          }}
        >
          {BREW_METHODS.map(method => (
            <div
              key={method.id}
              className="glass-card card-interactive fade-in"
              onClick={() => onSelectMethod(method.id)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${method.name} brewing workspace`}
              onKeyDown={e => e.key === 'Enter' && onSelectMethod(method.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)',
                padding: '20px',
                minHeight: '140px'
              }}
            >
              <div style={{
                width: '44px', height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-sage-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--accent-sage)' }}>
                  {METHOD_ICONS[method.id] || 'filter_alt'}
                </span>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>
                  {method.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                  {METHOD_DESCRIPTIONS[method.id] || method.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent Brews — Horizontal Carousel ────────────── */}
      {recentBrews.length > 0 && (
        <section>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 'var(--space-md)'
          }}>
            <h2 className="section-header">Recent Brews</h2>
            <button
              className="btn-ghost"
              onClick={() => onNavigateTab('brews')}
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              View All
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
            </button>
          </div>

          <div style={{
            display: 'flex',
            gap: 'var(--space-md)',
            overflowX: 'auto',
            paddingBottom: 'var(--space-sm)',
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}>
            {recentBrews.slice(0, 4).map(brew => (
              <div
                key={brew.id}
                className="glass-card card-interactive"
                onClick={() => onSelectBrewForCompare(brew)}
                style={{
                  minWidth: '260px',
                  maxWidth: '300px',
                  flex: '0 0 auto',
                  scrollSnapAlign: 'start',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-sage">{brew.methodName}</span>
                  <span className="text-mono" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>
                    {brew.rating ? `★ ${brew.rating}` : ''}
                  </span>
                </div>

                <h4 className="truncate" style={{ fontSize: '15px', fontWeight: 600 }}>
                  {brew.beanName}
                </h4>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>{new Date(brew.date).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>{brew.doseGrams}g · {brew.grinderClick} clicks</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
