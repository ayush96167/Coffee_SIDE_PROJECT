import React, { useState, useEffect } from 'react';
import { getStoredApiConfig, saveApiConfig, testApiConnection } from '../services/aiService';

export function ProfileScreen({ brewLogs, beans, onResetData }) {
  const [activeSubTab, setActiveSubTab] = useState('api'); // 'profile', 'api'
  
  // Profile Form State
  const [userName, setUserName] = useState(() => localStorage.getItem('brewmind_user_name') || 'Ayush');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('brewmind_user_email') || 'ayush@barista.ai');
  const [experienceLevel, setExperienceLevel] = useState(() => localStorage.getItem('brewmind_user_exp') || 'Enthusiast');
  const [preferredMethod, setPreferredMethod] = useState(() => localStorage.getItem('brewmind_user_method') || 'v60');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // API Config State
  const [apiConfig, setApiConfig] = useState(getStoredApiConfig());
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { loading, success, message }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('brewmind_user_name', userName);
    localStorage.setItem('brewmind_user_email', userEmail);
    localStorage.setItem('brewmind_user_exp', experienceLevel);
    localStorage.setItem('brewmind_user_method', preferredMethod);
    setProfileSavedMsg('Profile updated successfully!');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  const handleTestAndSaveApi = async () => {
    setTestStatus({ loading: true, message: 'Testing API connection...' });
    saveApiConfig(apiConfig);
    const result = await testApiConnection(apiConfig);
    setTestStatus({ loading: false, success: result.success, message: result.message });
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ beans, brewLogs }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `brewmind_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ padding: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <h1 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>
          Account & AI Settings
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Manage your barista profile, data exports, and real-time AI API keys
        </p>
      </div>

      {/* User Hero Badge */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-sage)', flexShrink: 0 }}>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgcMmIp2AyBjSs6512KizxgQaDPjgW5b9tndJ8K6UGa-IKFKbULHRjcnhfNhPaCCgB109SNvvew651pgLxqAPkA6Uy-9OPsJFxDqh90-OWgh80r6VKG85A1zNBIgXTziqMYMfi6DDWmxXeqRN-yf_lJ0oOYMbc_M2Okj92EyarnwXnc0d2TY9inWYIgZqBm3lboQKteH5RUhqP7X60xxrkrnT5Cv16Cbu9h6QtJfeywnwNPiaH-C22eg" 
            alt="Profile Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>{userName}</h2>
            <span className="badge badge-copper">{experienceLevel}</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{userEmail}</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveSubTab('api')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: activeSubTab === 'api' ? 'var(--accent-sage)' : 'transparent',
            color: activeSubTab === 'api' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: activeSubTab === 'api' ? 700 : 500,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>key</span>
          API Keys & Real-Time AI
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: activeSubTab === 'profile' ? 'var(--accent-sage)' : 'transparent',
            color: activeSubTab === 'profile' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: activeSubTab === 'profile' ? 700 : 500,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
          Profile & Account
        </button>
      </div>

      {/* TAB 1: API KEYS & REAL-TIME AI */}
      {activeSubTab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Active Status Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-sage)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--accent-sage)', fontSize: '28px' }}>auto_awesome</span>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Real-Time Barista AI Assistant</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {apiConfig.apiKey ? `Connected to ${apiConfig.provider.toUpperCase()} AI Engine` : 'Operating in Rule Engine fallback mode. Add an API key below to unlock live AI dialing.'}
                </p>
              </div>
            </div>
          </div>

          {/* API Configuration Form */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Configure AI Provider & Key
            </h3>

            {/* Provider Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>AI Provider</label>
              <select 
                value={apiConfig.provider} 
                onChange={e => setApiConfig({ ...apiConfig, provider: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card-secondary)', fontSize: '0.9rem', color: 'var(--text-primary)' }}
              >
                <option value="gemini">Google Gemini AI (Recommended - Gemini 1.5 Flash)</option>
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
              </select>
            </div>

            {/* Secret Key Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                API Secret Key
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type={showKey ? 'text' : 'password'}
                  placeholder={apiConfig.provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                  value={apiConfig.apiKey}
                  onChange={e => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
                />
                <button 
                  className="btn-icon" 
                  onClick={() => setShowKey(!showKey)}
                  style={{ width: '42px', height: '42px', flexShrink: 0 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showKey ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Your API key is stored locally in your browser and never sent to external servers.
              </p>
            </div>

            {/* Real-time Voice Guidance Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', cursor: 'pointer', margin: '4px 0' }}>
              <input 
                type="checkbox" 
                checked={apiConfig.enableRealtimeVoice} 
                onChange={e => setApiConfig({ ...apiConfig, enableRealtimeVoice: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-sage)' }}
              />
              Enable hands-free real-time voice assistant guidance during brews
            </label>

            {/* Test & Save Button */}
            <button 
              className="btn btn-primary"
              onClick={handleTestAndSaveApi}
              disabled={testStatus?.loading}
              style={{ padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.95rem' }}
            >
              <span className="material-symbols-outlined">sync</span> 
              {testStatus?.loading ? 'Testing Connection...' : 'Test & Save API Key'}
            </button>

            {/* Test Status Alert */}
            {testStatus && (
              <div 
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: 'var(--radius-md)', 
                  background: testStatus.success ? 'var(--accent-green-light)' : 'rgba(186,26,26,0.12)', 
                  color: testStatus.success ? 'var(--accent-green)' : '#ba1a1a',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  {testStatus.success ? 'check_circle' : 'error'}
                </span>
                {testStatus.message}
              </div>
            )}

            {/* Quick Links */}
            <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🔑 Don't have a key? Get a free API key at{' '}
              <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-sage)', fontWeight: 600 }}>
                Google AI Studio
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE & ACCOUNT */}
      {activeSubTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Edit Profile Form */}
          <form className="glass-card" onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Edit Barista Profile
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
              <input 
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card-secondary)', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
              <input 
                type="email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card-secondary)', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Experience</label>
                <select 
                  value={experienceLevel} 
                  onChange={e => setExperienceLevel(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card-secondary)', fontSize: '0.88rem' }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Home Barista">Home Barista</option>
                  <option value="Enthusiast">Enthusiast</option>
                  <option value="Pro Barista">Pro Barista</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Preferred Method</label>
                <select 
                  value={preferredMethod} 
                  onChange={e => setPreferredMethod(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card-secondary)', fontSize: '0.88rem' }}
                >
                  <option value="v60">V60 Pour Over</option>
                  <option value="espresso">Espresso</option>
                  <option value="frenchpress">French Press</option>
                  <option value="mokapot">Moka Pot</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '6px' }}>
              Save Profile Changes
            </button>

            {profileSavedMsg && (
              <p style={{ fontSize: '0.82rem', color: 'var(--accent-green)', fontWeight: 600, textAlign: 'center' }}>
                {profileSavedMsg}
              </p>
            )}
          </form>

          {/* Account Data & Security Actions */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Data Export & Reset
            </h3>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-secondary" 
                onClick={handleExportData}
                style={{ flex: 1, padding: '12px', fontSize: '0.88rem' }}
              >
                <span className="material-symbols-outlined">download</span> Export Brew History (JSON)
              </button>

              <button 
                className="btn" 
                onClick={onResetData}
                style={{ flex: 1, padding: '12px', fontSize: '0.88rem', background: 'rgba(186,26,26,0.1)', color: '#ba1a1a', border: '1px solid rgba(186,26,26,0.3)' }}
              >
                <span className="material-symbols-outlined">delete</span> Reset Local Data
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
