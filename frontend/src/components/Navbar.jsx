import React, { useState } from 'react';
import { 
  Recycle, 
  Sparkles, 
  PlusCircle, 
  ListOrdered, 
  Truck, 
  BarChart3, 
  UserCircle2, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  Award,
  Layers
} from 'lucide-react';
import { storageService } from '../services/storageService';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  setCurrentUser, 
  onOpenSubmitModal,
  onOpenAuthModal 
}) {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const users = storageService.getUsers();

  const handleSwitchPersona = (selectedUser) => {
    storageService.setCurrentUser(selectedUser);
    setCurrentUser(selectedUser);
    setShowPersonaMenu(false);
  };

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setCurrentUser(null);
    setShowPersonaMenu(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fb7185', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>ADMIN</span>;
      case 'RECYCLER':
        return <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>LOGISTICS</span>;
      default:
        return <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>CITIZEN</span>;
    }
  };

  return (
    <header style={{
      background: 'rgba(11, 22, 29, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Recycle size={24} color="#ffffff" style={{ animation: 'spin-slow 20s linear infinite' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                EcoDrop<span style={{ color: 'var(--primary)' }}>.ai</span>
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                v2.4
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 500, margin: 0 }}>
              Smart E-Waste Recycling Hub
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('home')}
            style={{
              background: activeTab === 'home' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: activeTab === 'home' ? 'var(--primary-light)' : 'var(--text-muted)',
              border: activeTab === 'home' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={16} />
            <span>Impact Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            style={{
              background: activeTab === 'tracker' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: activeTab === 'tracker' ? 'var(--primary-light)' : 'var(--text-muted)',
              border: activeTab === 'tracker' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <ListOrdered size={16} />
            <span>Live Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('pickups')}
            style={{
              background: activeTab === 'pickups' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: activeTab === 'pickups' ? 'var(--primary-light)' : 'var(--text-muted)',
              border: activeTab === 'pickups' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Truck size={16} />
            <span>Pickups & Fleet</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            style={{
              background: activeTab === 'admin' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: activeTab === 'admin' ? 'var(--primary-light)' : 'var(--text-muted)',
              border: activeTab === 'admin' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <BarChart3 size={16} />
            <span>Admin Intelligence</span>
          </button>
        </nav>

        {/* Right side CTA & User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Submit Request Button */}
          <button
            onClick={onOpenSubmitModal}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            <PlusCircle size={17} />
            <span>Submit E-Waste</span>
          </button>

          {/* User Persona & Points */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {/* Eco points badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#34d399',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(16, 185, 129, 0.25)'
                }}>
                  <Award size={13} />
                  <span>{currentUser.ecoPoints || 0} pts</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                    {currentUser.fullName?.split(' ')[0]}
                  </span>
                  {getRoleBadge(currentUser.role)}
                  <ChevronDown size={14} color="var(--text-muted)" />
                </div>
              </div>

              {/* Persona Switcher Dropdown */}
              {showPersonaMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '270px',
                  background: '#0e1a22',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  zIndex: 200,
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Quick Switch Persona
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                      Logged in as <strong>{currentUser.email}</strong>
                    </p>
                  </div>

                  <div style={{ padding: '4px 0' }}>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchPersona(u)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: u.id === currentUser.id ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          color: '#fff',
                          fontSize: '0.84rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{u.email}</div>
                        </div>
                        {getRoleBadge(u.role)}
                      </button>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4px' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#fb7185',
                        cursor: 'pointer',
                        fontSize: '0.84rem'
                      }}
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.86rem' }}
            >
              <UserCircle2 size={16} />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
