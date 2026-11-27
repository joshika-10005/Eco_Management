import React, { useState } from 'react';
import { 
  Recycle, 
  Search,
  PlusCircle, 
  ListOrdered, 
  Truck, 
  BarChart3, 
  UserCircle2, 
  LogOut, 
  ChevronDown, 
  Award,
  Leaf,
  ShoppingBag
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
        return <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 700 }}>ADMIN</span>;
      case 'RECYCLER':
        return <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 700 }}>LOGISTICS</span>;
      default:
        return <span style={{ background: '#dcf0e2', color: '#25523b', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 700 }}>CITIZEN</span>;
    }
  };

  return (
    <header style={{
      padding: '24px 36px 18px',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px'
    }}>
      {/* Brand Logo - Inspired by Poulls Organic Forest Green Typography */}
      <div 
        onClick={() => setActiveTab('home')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        <span style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--forest-green)',
          fontFamily: 'var(--font-heading)'
        }}>
          EcoDrop
        </span>
      </div>

      {/* Center Nav Links: Home, Recycle, Tracker, Logistics, Council */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <button
          onClick={() => setActiveTab('home')}
          style={{
            background: 'transparent',
            border: 'none',
            color: activeTab === 'home' ? 'var(--forest-green)' : 'var(--text-muted)',
            fontWeight: activeTab === 'home' ? 700 : 500,
            fontSize: '0.94rem',
            cursor: 'pointer',
            padding: '4px 0',
            borderBottom: activeTab === 'home' ? '2px solid var(--forest-green)' : '2px solid transparent',
            transition: 'var(--transition)'
          }}
        >
          Home
        </button>

        <button
          onClick={onOpenSubmitModal}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontWeight: 500,
            fontSize: '0.94rem',
            cursor: 'pointer',
            padding: '4px 0',
            transition: 'var(--transition)'
          }}
        >
          Recycle
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
          style={{
            background: 'transparent',
            border: 'none',
            color: activeTab === 'tracker' ? 'var(--forest-green)' : 'var(--text-muted)',
            fontWeight: activeTab === 'tracker' ? 700 : 500,
            fontSize: '0.94rem',
            cursor: 'pointer',
            padding: '4px 0',
            borderBottom: activeTab === 'tracker' ? '2px solid var(--forest-green)' : '2px solid transparent',
            transition: 'var(--transition)'
          }}
        >
          Tracker
        </button>

        <button
          onClick={() => setActiveTab('pickups')}
          style={{
            background: 'transparent',
            border: 'none',
            color: activeTab === 'pickups' ? 'var(--forest-green)' : 'var(--text-muted)',
            fontWeight: activeTab === 'pickups' ? 700 : 500,
            fontSize: '0.94rem',
            cursor: 'pointer',
            padding: '4px 0',
            borderBottom: activeTab === 'pickups' ? '2px solid var(--forest-green)' : '2px solid transparent',
            transition: 'var(--transition)'
          }}
        >
          Logistics
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          style={{
            background: 'transparent',
            border: 'none',
            color: activeTab === 'admin' ? 'var(--forest-green)' : 'var(--text-muted)',
            fontWeight: activeTab === 'admin' ? 700 : 500,
            fontSize: '0.94rem',
            cursor: 'pointer',
            padding: '4px 0',
            borderBottom: activeTab === 'admin' ? '2px solid var(--forest-green)' : '2px solid transparent',
            transition: 'var(--transition)'
          }}
        >
          Council
        </button>
      </nav>

      {/* Right Action Icons matching reference (Search icon + Forest Green Pill Button) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Search icon button */}
        <button
          onClick={() => setActiveTab('tracker')}
          title="Search requests"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
            transition: 'var(--transition)'
          }}
        >
          <Search size={16} />
        </button>

        {/* Forest Green Pill Button */}
        <button
          onClick={onOpenSubmitModal}
          className="btn-forest-pill"
          style={{ padding: '10px 22px', fontSize: '0.88rem' }}
        >
          <Leaf size={14} />
          <span>Get Pickup</span>
        </button>

        {/* User Persona Profile Pill */}
        {currentUser ? (
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                padding: '5px 12px',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                transition: 'var(--transition)'
              }}
            >
              <div style={{
                background: 'var(--forest-green-subtle)',
                color: 'var(--forest-green)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Award size={12} />
                <span>{currentUser.ecoPoints || 0} pts</span>
              </div>

              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {currentUser.fullName?.split(' ')[0]}
              </span>
              {getRoleBadge(currentUser.role)}
              <ChevronDown size={13} color="var(--text-dim)" />
            </div>

            {showPersonaMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                width: '260px',
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-container)',
                padding: '8px',
                zIndex: 200,
                animation: 'fadeIn 0.15s ease-out'
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                    Switch Persona
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    {currentUser.email}
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
                        background: u.id === currentUser.id ? 'var(--forest-green-subtle)' : 'transparent',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{u.email}</div>
                      </div>
                      {getRoleBadge(u.role)}
                    </button>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    onClick={() => { setShowPersonaMenu(false); onOpenAuthModal(); }}
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
                      color: 'var(--forest-green)',
                      cursor: 'pointer',
                      fontSize: '0.84rem',
                      fontWeight: 600
                    }}
                  >
                    <UserCircle2 size={14} />
                    <span>Login or Register New</span>
                  </button>

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
                      color: '#b91c1c',
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
            className="btn-secondary-pill"
            style={{ padding: '7px 16px', fontSize: '0.84rem' }}
          >
            <UserCircle2 size={15} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
