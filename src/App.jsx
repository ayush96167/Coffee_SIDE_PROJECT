import React, { useState, useEffect } from 'react';
import { TopNav, BottomNav } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { BrewWorkspace } from './components/BrewWorkspace';
import { GuidedBrewTimer } from './components/GuidedBrewTimer';
import { TasteAnalysis } from './components/TasteAnalysis';
import { CompareMode } from './components/CompareMode';
import { BeanLibrary } from './components/BeanLibrary';
import { GrinderDatabase } from './components/GrinderDatabase';
import { CoffeeCalculator } from './components/CoffeeCalculator';
import { ProfileScreen } from './components/ProfileScreen';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { INITIAL_BEANS, INITIAL_BREW_LOGS } from './data/mockData';

export function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('brewmind_theme') || 'light');
  const [activeTab, setActiveTab] = useState('home');
  const [activeView, setActiveView] = useState('main'); // main, workspace, timer, taste, compare

  const [beans, setBeans] = useState(() => {
    const saved = localStorage.getItem('brewmind_beans');
    return saved ? JSON.parse(saved) : INITIAL_BEANS;
  });

  const [activeBeanId, setActiveBeanId] = useState(() => beans[0] ? beans[0].id : '');

  const [brewLogs, setBrewLogs] = useState(() => {
    const saved = localStorage.getItem('brewmind_brew_logs');
    return saved ? JSON.parse(saved) : INITIAL_BREW_LOGS;
  });

  const [selectedMethodId, setSelectedMethodId] = useState('v60');
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [comparingBrews, setComparingBrews] = useState(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('brewmind_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('brewmind_beans', JSON.stringify(beans));
  }, [beans]);

  useEffect(() => {
    localStorage.setItem('brewmind_brew_logs', JSON.stringify(brewLogs));
  }, [brewLogs]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const activeBean = beans.find(b => b.id === activeBeanId) || beans[0];

  const handleSelectMethod = (methodId) => {
    setSelectedMethodId(methodId);
    setActiveView('workspace');
  };

  const handleStartTimer = ({ recipe, bean }) => {
    setActiveRecipe(recipe);
    setActiveView('timer');
  };

  const handleCompleteBrew = (recipe) => {
    setActiveRecipe(recipe);
    setActiveView('taste');
  };

  const handleSaveBrewLog = (newLog) => {
    setBrewLogs([newLog, ...brewLogs]);
    if (activeBean) {
      const updatedRemaining = Math.max(0, activeBean.remainingGrams - newLog.doseGrams);
      setBeans(beans.map(b => b.id === activeBean.id ? { ...b, remainingGrams: updatedRemaining } : b));
    }
    setActiveView('main');
    setActiveTab('brews');
  };

  const handleSelectBrewForCompare = (brew) => {
    const prevBrew = brewLogs.find(b => b.id !== brew.id) || brewLogs[1];
    setComparingBrews({ currentBrew: brew, previousBrew: prevBrew });
    setActiveView('compare');
  };

  const handleVoiceRecipeGenerated = ({ methodId, doseGrams, desiredProfileId }) => {
    setSelectedMethodId(methodId);
    setActiveView('workspace');
  };

  const handleNavigateTab = (tabId) => {
    setActiveTab(tabId);
    setActiveView('main');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all stored beans and brew logs to default?')) {
      localStorage.removeItem('brewmind_beans');
      localStorage.removeItem('brewmind_brew_logs');
      setBeans(INITIAL_BEANS);
      setBrewLogs(INITIAL_BREW_LOGS);
      alert('Local data reset cleanly.');
    }
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <TopNav 
        theme={theme} 
        toggleTheme={toggleTheme}
        onOpenVoice={() => setShowVoiceModal(true)}
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
      />

      {/* Main Content */}
      <main style={{ padding: 'var(--space-lg)', minHeight: 'calc(100vh - 140px)' }}>
        {activeView === 'workspace' && (
          <BrewWorkspace 
            selectedMethodId={selectedMethodId}
            activeBean={activeBean}
            beans={beans}
            onStartTimer={handleStartTimer}
            onBackToHome={() => setActiveView('main')}
          />
        )}

        {activeView === 'timer' && activeRecipe && (
          <GuidedBrewTimer 
            recipe={activeRecipe}
            bean={activeBean}
            onCompleteBrew={handleCompleteBrew}
            onCancelBrew={() => setActiveView('main')}
          />
        )}

        {activeView === 'taste' && activeRecipe && (
          <TasteAnalysis 
            recipe={activeRecipe}
            bean={activeBean}
            onSaveBrewLog={handleSaveBrewLog}
          />
        )}

        {activeView === 'compare' && comparingBrews && (
          <CompareMode 
            currentBrew={comparingBrews.currentBrew}
            previousBrew={comparingBrews.previousBrew}
            onCloseCompare={() => setActiveView('main')}
          />
        )}

        {activeView === 'main' && (
          <>
            {activeTab === 'home' && (
              <HomeScreen 
                activeBean={activeBean}
                beans={beans}
                recentBrews={brewLogs}
                onSelectMethod={handleSelectMethod}
                onOpenVoice={() => setShowVoiceModal(true)}
                onSelectBrewForCompare={handleSelectBrewForCompare}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {activeTab === 'beans' && (
              <BeanLibrary 
                beans={beans}
                activeBeanId={activeBeanId}
                onSelectActiveBean={setActiveBeanId}
                onAddNewBean={(newBean) => {
                  setBeans([newBean, ...beans]);
                  setActiveBeanId(newBean.id);
                }}
              />
            )}

            {activeTab === 'brews' && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <h1 className="section-header" style={{ fontSize: '28px' }}>Brew History</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
                  {brewLogs.map(log => (
                    <div key={log.id} className="glass-card" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span className="badge badge-sage" style={{ marginBottom: '6px' }}>{log.methodName}</span>
                          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{log.beanName}</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {log.grinderName} · {log.grinderClick} clicks · {log.waterTemp}°C
                          </p>
                        </div>
                        <span className="text-mono" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '15px' }}>
                          ★ {log.rating}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex', gap: 'var(--space-md)',
                        marginTop: 'var(--space-sm)', fontSize: '12px', color: 'var(--text-muted)'
                      }}>
                        <span>{log.doseGrams}g : {log.waterMl}ml</span>
                        <span>{new Date(log.date).toLocaleDateString()}</span>
                      </div>

                      <div style={{
                        marginTop: 'var(--space-sm)', paddingTop: 'var(--space-sm)',
                        borderTop: '1px solid var(--border)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', flex: 1, minWidth: 0 }} className="truncate">
                          "{log.userNotes}"
                        </span>
                        <button 
                          className="chip"
                          onClick={() => handleSelectBrewForCompare(log)}
                          style={{ fontSize: '12px', padding: '4px 10px', marginLeft: '8px' }}
                        >
                          Compare
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'grinders' && (
              <GrinderDatabase />
            )}

            {activeTab === 'profile' && (
              <ProfileScreen 
                brewLogs={brewLogs}
                beans={beans}
                onResetData={handleResetData}
              />
            )}
          </>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={handleNavigateTab} />

      {showVoiceModal && (
        <VoiceAssistantModal 
          onClose={() => setShowVoiceModal(false)}
          onVoiceRecipeGenerated={handleVoiceRecipeGenerated}
        />
      )}
    </div>
  );
}
