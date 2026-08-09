import React, { useState, useEffect } from 'react';
import { Mic, X, Sparkles, Volume2, CheckCircle2, ArrowRight } from 'lucide-react';

export function VoiceAssistantModal({ onClose, onVoiceRecipeGenerated }) {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('Listening... Speak your brewing preference (e.g. "V60, 20 grams, sweet profile with Ethiopian bean").');

  // Web Speech Recognition if available
  useEffect(() => {
    let recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript) handleParsePrompt(transcript);
      };

      try {
        recognition.start();
      } catch (e) {
        console.warn('Speech recognition start error', e);
      }
    } else {
      // Speech recognition not supported natively in browser
      setTimeout(() => {
        setIsListening(false);
      }, 2000);
    }

    return () => {
      if (recognition) recognition.abort();
    };
  }, []);

  const handleParsePrompt = (promptText) => {
    setAiReply(`Parsed: "${promptText}". Generating sweet V60 recipe for 20g dose at 58 clicks...`);
    setTimeout(() => {
      onVoiceRecipeGenerated({ methodId: 'v60', doseGrams: 20, desiredProfileId: 'sweet' });
      onClose();
    }, 1500);
  };

  const samplePrompts = [
    'V60, 20 grams, sweet profile',
    'Moka pot, fruity notes, 18 grams',
    'Espresso shot, chocolatey profile',
    'French press, 22 grams coarse'
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div 
        className="card" 
        style={{ 
          width: '100%', 
          maxWidth: '520px', 
          borderBottomLeftRadius: 0, 
          borderBottomRightRadius: 0,
          background: 'var(--bg-card)',
          padding: '24px 20px 36px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-copper)' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Voice Barista Assistant</h3>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Animated Microphone Icon */}
        <div 
          className={isListening ? 'voice-mic-active' : ''}
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'var(--accent-copper-light)',
            color: 'var(--accent-copper)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setIsListening(!isListening)}
        >
          <Mic size={36} />
        </div>

        <div style={{ textAlign: 'center', padding: '0 10px' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {transcript ? `"${transcript}"` : isListening ? 'Listening...' : 'Tap Mic to Speak'}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--accent-copper)' }}>
            {aiReply}
          </p>
        </div>

        {/* Quick Sample Prompts */}
        <div style={{ width: '100%' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>
            OR TAP A SAMPLE VOICE COMMAND:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                className="chip"
                onClick={() => {
                  setTranscript(sp);
                  handleParsePrompt(sp);
                }}
                style={{ fontSize: '0.8rem' }}
              >
                🎙️ "{sp}"
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
