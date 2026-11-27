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
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

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
    setCurrentUser(dataService.getCurrentUser());
  };

  return (
    <>
      {/* Discreet Data Source Switcher in Bottom Corner */}
      <DataSourceBanner onNotification={addNotification} />

      {/* Main Floating Rounded Canvas Container Inspired by Reference */}
      <div className="app-container">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          onOpenSubmitModal={() => setSubmitModalOpen(true)}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main style={{ flex: 1 }}>
          {activeTab === 'home' && (
            <HeroHome
              onOpenSubmitModal={() => setSubmitModalOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'tracker' && (
            <div style={{ padding: '0 32px 48px' }}>
              <RequestTracker
                currentUser={currentUser}
                onOpenScheduleModal={() => setActiveTab('pickups')}
                onNotification={addNotification}
              />
            </div>
          )}

          {activeTab === 'pickups' && (
            <div style={{ padding: '0 32px 48px' }}>
              <PickupManager
                onNotification={addNotification}
              />
            </div>
          )}

          {activeTab === 'admin' && (
            <div style={{ padding: '0 32px 48px' }}>
              <AdminPanel
                onNotification={addNotification}
              />
            </div>
          )}
        </main>
      </div>

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
            {n.type === 'success' && <CheckCircle2 size={18} color="var(--forest-green)" />}
            {n.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
            {n.type === 'info' && <Info size={18} color="#0284c7" />}
            <span>{n.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
