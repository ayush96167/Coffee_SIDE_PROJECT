import React from 'react';

export function TopNav({ theme, toggleTheme, onOpenVoice, activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'beans', label: 'Beans', icon: 'eco' },
    { id: 'brews', label: 'Brews', icon: 'timer' },
    { id: 'grinders', label: 'Assistant', icon: 'auto_awesome' },
    { id: 'profile', label: 'Settings', icon: 'settings' }
  ];

  return (
    <header className="top-nav">
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          className="material-symbols-outlined filled"
          style={{ fontSize: '24px', color: 'var(--accent)' }}
        >
          coffee
        </span>
        <span
          className="text-display"
          style={{ fontSize: '18px', color: 'var(--text-primary)' }}
        >
          BrewMind
        </span>
      </div>

      {/* Desktop Segmented Control */}
      <div className="desktop-nav-links segmented-control">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`segmented-btn ${isActive ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button className="btn-icon" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle dark mode">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  );
}

export function BottomNav({ activeTab, setActiveTab }) {
  const items = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'beans', label: 'Beans', icon: 'eco' },
    { id: 'brews', label: 'Brews', icon: 'timer' },
    { id: 'grinders', label: 'Assistant', icon: 'auto_awesome' },
    { id: 'profile', label: 'Settings', icon: 'settings' }
  ];

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span
              className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}
              style={{ fontSize: '24px' }}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
