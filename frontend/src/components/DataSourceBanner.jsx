import React, { useState, useEffect } from 'react';
import { Database, Server, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Layers } from 'lucide-react';
import { dataService } from '../services/dataService';

export default function DataSourceBanner({ onNotification }) {
  const [mode, setMode] = useState(dataService.getMode());
  const [isChecking, setIsChecking] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null);

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
      // Trying to switch to Spring Boot API
      setIsChecking(true);
      const online = await dataService.checkBackendConnection();
      setIsChecking(false);
      setBackendOnline(online);

      if (online) {
        dataService.setMode('api');
        setMode('api');
        onNotification?.('success', 'Connected to Spring Boot REST API & MongoDB Atlas!');
      } else {
        onNotification?.(
          'error',
          'Spring Boot backend not reachable on port 8080. Start backend using `mvn spring-boot:run` to switch to MongoDB Atlas.'
        );
      }
    } else {
      // Switch back to LocalStorage
      dataService.setMode('local');
      setMode('local');
      onNotification?.('info', 'Switched to offline LocalStorage mode.');
    }
  };

  return (
    <div style={{
      background: mode === 'local' 
        ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)'
        : 'linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.12) 100%)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '8px 20px',
      fontSize: '0.84rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: mode === 'local' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
          color: mode === 'local' ? '#34d399' : '#60a5fa',
          padding: '3px 10px',
          borderRadius: '9999px',
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.03em'
        }}>
          {mode === 'local' ? <Database size={13} /> : <Server size={13} />}
          {mode === 'local' ? 'ACTIVE DATA SOURCE: LOCALSTORAGE' : 'ACTIVE DATA SOURCE: SPRING BOOT & ATLAS'}
        </div>

        <span style={{ color: 'var(--text-muted)' }}>
          {mode === 'local' ? (
            <>
              Client running self-contained in <strong>localStorage</strong> (Collections: <code>users</code>, <code>ewaste_requests</code>, <code>pickup_details</code>).
            </>
          ) : (
            <>
              Live integration active with <strong>Spring Boot REST APIs</strong> &amp; <strong>MongoDB Atlas</strong> cloud database.
            </>
          )}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={checkStatus}
          disabled={isChecking}
          title="Ping Spring Boot backend (http://localhost:8080)"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem'
          }}
        >
          <RefreshCw size={12} className={isChecking ? 'spin-anim' : ''} />
          {backendOnline === true ? (
            <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> Backend Port 8080 Online
            </span>
          ) : backendOnline === false ? (
            <span style={{ color: '#fb7185', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={12} /> Backend Port 8080 Offline
            </span>
          ) : (
            'Check Backend'
          )}
        </button>

        <button
          onClick={toggleMode}
          className="btn-secondary"
          style={{
            padding: '4px 12px',
            fontSize: '0.78rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          {mode === 'local' ? (
            <>
              <span>Switch to Spring Boot API</span>
              <ArrowRight size={12} />
            </>
          ) : (
            <>
              <span>Switch to LocalStorage Mode</span>
              <Database size={12} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
