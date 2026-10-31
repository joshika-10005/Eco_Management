import React, { useState, useEffect } from 'react';
import DataSourceBanner from './components/DataSourceBanner';
import Navbar from './components/Navbar';
import HeroHome from './components/HeroHome';
import RequestTracker from './components/RequestTracker';
import PickupManager from './components/PickupManager';
import AdminPanel from './components/AdminPanel';
import SubmitRequestModal from './components/SubmitRequestModal';
import AuthModal from './components/AuthModal';
import { dataService } from './services/dataService';
import { storageService } from './services/storageService';
import { Leaf, Heart, Shield, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(() => dataService.getCurrentUser());
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    storageService.init();
    if (!currentUser) {
      const defaultCitizen = storageService.getUsers().find(u => u.role === 'CITIZEN');
      if (defaultCitizen) {
        setCurrentUser(defaultCitizen);
        storageService.setCurrentUser(defaultCitizen);
      }
    }
  }, []);

  const addNotification = (type, message) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  const handleRequestCreated = () => {
    setActiveTab('tracker');
    // Refresh current user points if changed
    setCurrentUser(dataService.getCurrentUser());
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Integration Mode Banner */}
      <DataSourceBanner onNotification={addNotification} />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenSubmitModal={() => setSubmitModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <HeroHome
            onOpenSubmitModal={() => setSubmitModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tracker' && (
          <RequestTracker
            currentUser={currentUser}
            onOpenScheduleModal={() => setActiveTab('pickups')}
            onNotification={addNotification}
          />
        )}

        {activeTab === 'pickups' && (
          <PickupManager
            onNotification={addNotification}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            onNotification={addNotification}
          />
        )}
      </main>

      {/* Footnote & Architecture Footer */}
      <footer style={{
        background: '#091217',
        borderTop: '1px solid var(--border-subtle)',
        padding: '36px 24px',
        color: 'var(--text-dim)',
        fontSize: '0.85rem'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Leaf size={16} />
            </div>
            <div>
              <span style={{ fontWeight: 700, color: '#fff' }}>EcoDrop E-Waste Network</span>
              <p style={{ margin: 0, fontSize: '0.75rem' }}>
                Full-Stack Architecture: React (Vite) + Spring Boot + Spring Data MongoDB + Docker + K8s
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.8rem' }}>
            <span>Collections: <code>users</code>, <code>ewaste_requests</code>, <code>pickup_details</code></span>
            <span>•</span>
            <span>Cloud Database: <strong>MongoDB Atlas</strong></span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SubmitRequestModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        currentUser={currentUser}
        onRequestCreated={handleRequestCreated}
        onNotification={addNotification}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onNotification={addNotification}
      />

      {/* Floating Toast Notification Container */}
      <div className="toast-container">
        {notifications.map((n) => (
          <div key={n.id} className={`toast-item toast-${n.type}`}>
            {n.type === 'success' && <CheckCircle2 size={18} color="var(--primary-light)" />}
            {n.type === 'error' && <AlertCircle size={18} color="var(--accent-rose)" />}
            {n.type === 'info' && <Info size={18} color="var(--accent-cyan)" />}
            <span>{n.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
