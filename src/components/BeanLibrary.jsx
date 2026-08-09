import React, { useState } from 'react';
import { scanBeanBagImageAI, predictDegassingAdvice } from '../services/aiService';

export function BeanLibrary({ beans, activeBeanId, onSelectActiveBean, onAddNewBean }) {
  const [showModal, setShowModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanNotice, setScanNotice] = useState('');

  const [name, setName] = useState('');
  const [roaster, setRoaster] = useState('');
  const [origin, setOrigin] = useState('');
  const [roastLevel, setRoastLevel] = useState('medium-light');
  const [process, setProcess] = useState('Washed');
  const [elevation, setElevation] = useState('1950m masl');
  const [roastDate, setRoastDate] = useState(new Date().toISOString().split('T')[0]);
  const [remainingGrams, setRemainingGrams] = useState(250);
  const [flavorNotesInput, setFlavorNotesInput] = useState('Jasmine, Bergamot, Honey');

  const handlePhotoScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    setScanNotice('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageDataUrl = event.target?.result;
      const scannedData = await scanBeanBagImageAI(imageDataUrl);
      if (scannedData) {
        setName(scannedData.name || 'Scanned Bean');
        setRoaster(scannedData.roaster || 'Specialty Roaster');
        setOrigin(scannedData.origin || 'Ethiopia');
        if (scannedData.roastLevel) setRoastLevel(scannedData.roastLevel);
        if (scannedData.process) setProcess(scannedData.process);
        if (scannedData.elevation) setElevation(scannedData.elevation);
        if (scannedData.flavorNotes) {
          setFlavorNotesInput(Array.isArray(scannedData.flavorNotes) ? scannedData.flavorNotes.join(', ') : scannedData.flavorNotes);
        }
        if (scannedData.needsApiKey) {
          setScanNotice('Add your API key in Settings for live label scanning.');
        } else if (scannedData.isLiveVision) {
          setScanNotice('AI Vision scanned your label successfully!');
        }
      }
      setIsScanning(false);
      setShowModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitNewBean = (e) => {
    e.preventDefault();
    onAddNewBean({
      id: `bean-${Date.now()}`,
      name: name || 'New Coffee Bean',
      roaster: roaster || 'Local Roaster',
      origin: origin || 'Single Origin',
      roastLevel, process, elevation, roastDate,
      remainingGrams: parseInt(remainingGrams) || 250,
      flavorNotes: flavorNotesInput.split(',').map(s => s.trim()).filter(Boolean)
    });
    setShowModal(false);
    setName(''); setRoaster(''); setOrigin(''); setScanNotice('');
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

      {/* ── Header ───────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>Beans</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {beans.length} beans · Track freshness & inventory
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <label className="btn btn-secondary" style={{
            padding: '10px 16px', fontSize: '13px', cursor: 'pointer',
            borderRadius: 'var(--radius-full)', width: 'auto',
            display: 'inline-flex', alignItems: 'center', gap: '6px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent-sage)' }}>photo_camera</span>
            {isScanning ? 'Scanning...' : 'Scan Bag'}
            <input type="file" accept="image/*" onChange={handlePhotoScan} style={{ display: 'none' }} />
          </label>
          <button
            className="btn btn-primary"
            onClick={() => { setScanNotice(''); setShowModal(true); }}
            style={{ padding: '10px 20px', fontSize: '13px', borderRadius: 'var(--radius-full)', width: 'auto' }}
          >
            + Add Bean
          </button>
        </div>
      </div>

      {/* ── Beans Grid ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
        {beans && beans.map(bean => {
          const isActive = bean.id === activeBeanId;
          const degasInfo = predictDegassingAdvice(bean.roastDate);
          const notesArray = Array.isArray(bean.flavorNotes)
            ? bean.flavorNotes
            : (bean.notes || 'Jasmine, Citrus, Berry').split(',').map(s => s.trim());
          const beanElevation = bean.elevation || bean.altitude || '1950m';
          const remaining = bean.remainingGrams || 250;
          const remainPct = Math.round((remaining / 250) * 100);

          return (
            <div
              key={bean.id}
              className="glass-card card-interactive"
              onClick={() => onSelectActiveBean(bean.id)}
              style={{
                display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)',
                border: isActive ? '2px solid var(--accent-sage)' : '1px solid var(--border)',
                boxShadow: isActive ? '0 8px 32px var(--accent-sage-light)' : 'var(--shadow-sm)'
              }}
            >
              {/* Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="text-caption" style={{ marginBottom: '2px', display: 'block' }}>
                    {bean.roaster || 'Specialty Roaster'}
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{bean.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {bean.origin || 'Single Origin'} · {bean.process || 'Washed'} · {beanElevation}
                  </p>
                </div>
                {isActive && (
                  <span className="badge badge-sage" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check</span> Active
                  </span>
                )}
              </div>

              {/* Degassing */}
              <div className="card-secondary" style={{
                padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'
              }}>
                <span className="material-symbols-outlined" style={{
                  color: degasInfo.status.includes('Peak') ? 'var(--accent-green)' : 'var(--accent)',
                  fontSize: '18px'
                }}>
                  {degasInfo.status.includes('Peak') ? 'check_circle' : 'schedule'}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>
                    {degasInfo.status} ({degasInfo.days}d)
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{degasInfo.advice}</p>
                </div>
              </div>

              {/* Flavor chips */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {notesArray.map((note, i) => (
                  <span key={i} className="chip" style={{ fontSize: '11px', padding: '3px 8px', cursor: 'default' }}>{note}</span>
                ))}
              </div>

              {/* Remaining bar */}
              <div style={{ marginTop: 'auto', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Roasted {bean.roastDate || 'Fresh'}
                  </span>
                  <span className="text-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-sage)' }}>
                    {remaining}g
                  </span>
                </div>
                <div style={{
                  height: '4px', width: '100%', background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-full)', overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', width: `${remainPct}%`,
                    background: remainPct > 30 ? 'var(--accent-sage)' : 'var(--accent-red)',
                    borderRadius: 'var(--radius-full)', transition: 'width 300ms var(--ease-out)'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Bean Modal ───────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay">
          <form className="modal-sheet" onSubmit={handleSubmitNewBean}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Add Coffee Bean</h2>
              <button type="button" className="btn-icon" onClick={() => setShowModal(false)} aria-label="Close">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            {scanNotice && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-sage-light)', color: 'var(--accent-sage)',
                fontSize: '13px', fontWeight: 600
              }}>
                {scanNotice}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="text-label">Bean Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input-field" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="text-label">Roaster</label>
                <input type="text" required value={roaster} onChange={e => setRoaster(e.target.value)} className="input-field" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="text-label">Origin</label>
                <input type="text" required value={origin} onChange={e => setOrigin(e.target.value)} className="input-field" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="text-label">Roast Level</label>
                <select value={roastLevel} onChange={e => setRoastLevel(e.target.value)} className="input-field">
                  <option value="light">Light</option>
                  <option value="medium-light">Medium-Light</option>
                  <option value="medium">Medium</option>
                  <option value="medium-dark">Medium-Dark</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="text-label">Roast Date</label>
                <input type="date" value={roastDate} onChange={e => setRoastDate(e.target.value)} className="input-field" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="text-label">Flavor Notes (comma separated)</label>
              <input type="text" value={flavorNotesInput} onChange={e => setFlavorNotesInput(e.target.value)} className="input-field" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-md)' }}>
              Save Bean
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
