import React, { useState, useEffect } from 'react';
import { Database, Server, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { dataService } from '../services/dataService';

export default function DataSourceBanner({ onNotification }) {
  const [mode, setMode] = useState(dataService.getMode());
  const [isChecking, setIsChecking] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    checkStatus();
    const handleModeChange = (e) => setMode(e.detail.mode);
    window.addEventListener('ecodrop:mode-changed', handleModeChange);
    return () => window.removeEventListener('ecodrop:mode-changed', handleModeChange);
  }, []);

  const checkStatus = async () => {
    setIsChecking(true);
    const online = await dataService.checkBackendConnection();
    setBackendOnline(online);
    setIsChecking(false);
  };

  const toggleMode = async () => {
    if (mode === 'local') {
      setIsChecking(true);
      const online = await dataService.checkBackendConnection();
      setIsChecking(false);
      setBackendOnline(online);

      if (online) {
        dataService.setMode('api');
        setMode('api');
        onNotification?.('success', 'Connected to Spring Boot REST API & MongoDB Atlas on port 8081!');
      } else {
        onNotification?.(
          'error',
          'Spring Boot backend not reachable on port 8081. Start backend using `mvn spring-boot:run` to switch to MongoDB Atlas.'
        );
      }
    } else {
      dataService.setMode('local');
      setMode('local');
      onNotification?.('info', 'Switched to offline LocalStorage mode.');
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#ffffff',
        padding: '6px 14px',
        borderRadius: 'var(--radius-pill)',
        boxShadow: '0 8px 24px rgba(25, 56, 40, 0.15)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-body)'
      }}
    >
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          fontWeight: 700,
          color: mode === 'local' ? '#047857' : '#1d4ed8'
        }}
      >
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: mode === 'local' ? '#10b981' : '#3b82f6',
          boxShadow: '0 0 8px currentColor'
        }} />
        <span>{mode === 'local' ? 'LocalStorage' : 'Spring Boot (8081)'}</span>
      </div>

      <span style={{ color: 'var(--border-subtle)' }}>|</span>

      <button
        onClick={toggleMode}
        title="Toggle between LocalStorage and Spring Boot REST API"
        style={{
          background: 'var(--bg-pill-soft)',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          padding: '3px 10px',
          fontSize: '0.74rem',
          fontWeight: 600,
          color: 'var(--forest-green)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <span>{mode === 'local' ? 'Connect 8081' : 'Switch Local'}</span>
        <ArrowRight size={11} />
      </button>

      <button
        onClick={checkStatus}
        disabled={isChecking}
        title="Ping backend on port 8081"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          color: backendOnline === true ? '#10b981' : backendOnline === false ? '#ef4444' : 'var(--text-dim)'
        }}
      >
        <RefreshCw size={12} className={isChecking ? 'spin-anim' : ''} />
      </button>
    </div>
  );
}
