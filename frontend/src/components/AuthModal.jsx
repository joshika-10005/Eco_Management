import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Sparkles, Shield, Truck } from 'lucide-react';
import { dataService } from '../services/dataService';
import { storageService } from '../services/storageService';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, onNotification }) {
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = async (personaEmail) => {
    try {
      const res = await dataService.login(personaEmail, 'password');
      onNotification?.('success', `Welcome back, ${res.user.fullName}!`);
      onLoginSuccess(res.user);
      onClose();
    } catch (err) {
      onNotification?.('error', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (tab === 'login') {
        const res = await dataService.login(email.trim(), password);
        onNotification?.('success', `Welcome back, ${res.user.fullName}!`);
        onLoginSuccess(res.user);
      } else {
        const res = await dataService.register({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          role: 'CITIZEN',
          phone: phone.trim(),
          address: address.trim()
        });
        onNotification?.('success', `Account created! +50 welcome EcoPoints granted.`);
        onLoginSuccess(res.user);
      }
      onClose();
    } catch (err) {
      onNotification?.('error', err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
              {tab === 'login' ? 'Access EcoDrop Network' : 'Create Citizen Profile'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>
              Secure recycling tracking &amp; eco reward ledger
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              borderRadius: '50%',
              padding: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1-Click Demo Personas */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 10px' }}>
            ⚡ Instant 1-Click Demo Login
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('citizen@ecodrop.org')}
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              <span>🌱 Alex Rivera (Citizen Donor)</span>
              <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>Login &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('recycler@ecodrop.org')}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#60a5fa',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              <span>🚚 Marcus Reed (Logistics Driver)</span>
              <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>Login &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@ecodrop.org')}
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: '#fb7185',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              <span>🛡️ Dr. Elena Vance (System Admin)</span>
              <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>Login &rarr;</span>
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '18px'
        }}>
          <button
            type="button"
            onClick={() => setTab('login')}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid var(--primary)' : '2px solid transparent',
              color: tab === 'login' ? '#fff' : 'var(--text-dim)',
              fontWeight: 700,
              padding: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Sign In with Email
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid var(--primary)' : '2px solid transparent',
              color: tab === 'register' ? '#fff' : 'var(--text-dim)',
              fontWeight: 700,
              padding: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Register New Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tab === 'register' && (
            <>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Jordan Hayes"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="+1 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">City Address</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Austin, TX"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {submitting ? 'Authenticating...' : tab === 'login' ? 'Sign In to Account' : 'Create Citizen Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
