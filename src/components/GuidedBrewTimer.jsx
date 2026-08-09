import React, { useState, useEffect, useRef } from 'react';

export function GuidedBrewTimer({
  recipe,
  bean,
  onCompleteBrew,
  onCancelBrew
}) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(recipe.steps[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const activeStep = recipe.steps[currentStepIdx] || recipe.steps[0];
  const isLastStep = currentStepIdx === recipe.steps.length - 1;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setStepSecondsLeft(prev => {
          if (prev <= 1) {
            if (currentStepIdx < recipe.steps.length - 1) {
              const nextIdx = currentStepIdx + 1;
              setCurrentStepIdx(nextIdx);
              return recipe.steps[nextIdx].duration;
            } else {
              setIsRunning(false);
              clearInterval(timerRef.current);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, currentStepIdx, recipe.steps]);

  const totalStepSecs = activeStep.duration;
  const progressPercent = Math.max(0, Math.min(100, ((totalStepSecs - stepSecondsLeft) / totalStepSecs) * 100));
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  const handleNextStep = () => {
    if (currentStepIdx < recipe.steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setStepSecondsLeft(recipe.steps[nextIdx].duration);
    }
  };

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setStepSecondsLeft(recipe.steps[0].duration);
    setIsRunning(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalBrewSecs = recipe.steps.reduce((sum, s) => sum + s.duration, 0);
  const overallProgress = ((currentStepIdx) / recipe.steps.length) * 100;

  return (
    <div
      className="fade-in"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 'var(--space-xl)', paddingTop: 'var(--space-md)',
        paddingBottom: 'var(--space-2xl)', minHeight: '80vh',
        justifyContent: 'center'
      }}
    >
      
      {/* ── Top Bar ──────────────────────────────────────── */}
      <div style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button className="btn-icon" onClick={onCancelBrew} aria-label="Cancel brew">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <p className="text-caption" style={{ marginBottom: '2px' }}>{recipe.method.name}</p>
          <p style={{ fontSize: '15px', fontWeight: 600 }}>
            {bean ? bean.name : 'Coffee'}
          </p>
        </div>

        <span className="text-mono" style={{ fontSize: '13px', color: 'var(--accent-sage)', fontWeight: 600 }}>
          {formatTime(totalBrewSecs)}
        </span>
      </div>

      {/* ── Progress Dots ────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {recipe.steps.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: idx === currentStepIdx ? '24px' : '8px',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              background: idx <= currentStepIdx ? 'var(--accent-sage)' : 'var(--bg-elevated)',
              transition: 'all 300ms var(--ease-out)'
            }}
          />
        ))}
      </div>

      {/* ── Central Timer Ring ────────────────────────────── */}
      <div style={{
        position: 'relative', width: '280px', height: '280px',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <svg width="280" height="280" viewBox="0 0 100 100" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="46" stroke="var(--border)" strokeWidth="1.5" fill="none" />
          <circle
            cx="50" cy="50" r="46"
            stroke="var(--accent-sage)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s var(--ease-out)' }}
          />
        </svg>

        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <span className="stat-value" style={{
            fontSize: '56px', color: 'var(--text-primary)', lineHeight: 1, display: 'block'
          }}>
            {formatTime(stepSecondsLeft)}
          </span>
          <div style={{
            marginTop: 'var(--space-sm)', padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-card-secondary)', border: '1px solid var(--border)',
            display: 'inline-block'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--accent-sage)', fontWeight: 600 }}>
              {isLastStep ? 'Final Step' : `Next: ${recipe.steps[currentStepIdx + 1]?.title || 'Finish'}`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Step Info ────────────────────────────────────── */}
      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
          {activeStep.title}
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          {activeStep.targetWater}g · {activeStep.instruction}
        </p>
      </div>

      {/* ── Controls ─────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
        width: '100%', maxWidth: '360px'
      }}>
        <button
          className="btn-icon"
          onClick={handleRestart}
          style={{ width: '48px', height: '48px' }}
          aria-label="Restart brew"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>restart_alt</span>
        </button>

        <button
          onClick={() => setIsRunning(!isRunning)}
          aria-label={isRunning ? 'Pause' : 'Play'}
          style={{
            flex: 1, height: '56px',
            borderRadius: 'var(--radius-full)', border: 'none',
            background: 'var(--accent-sage)', color: 'var(--text-inverse)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer', fontSize: '16px', fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 8px 32px var(--accent-sage-light)',
            transition: 'all 200ms var(--ease-out)'
          }}
        >
          <span className="material-symbols-outlined filled" style={{ fontSize: '24px' }}>
            {isRunning ? 'pause' : 'play_arrow'}
          </span>
          {isRunning ? 'Pause' : 'Start'}
        </button>

        {!isLastStep ? (
          <button
            className="btn-icon"
            onClick={handleNextStep}
            style={{ width: '48px', height: '48px' }}
            aria-label="Next step"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>fast_forward</span>
          </button>
        ) : (
          <button
            onClick={() => onCompleteBrew(recipe)}
            aria-label="Complete brew"
            style={{
              width: '48px', height: '48px',
              borderRadius: 'var(--radius-full)', border: 'none',
              background: 'var(--accent-sage)', color: 'var(--text-inverse)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 16px var(--accent-sage-light)'
            }}
          >
            <span className="material-symbols-outlined filled" style={{ fontSize: '22px' }}>check</span>
          </button>
        )}
      </div>

    </div>
  );
}
