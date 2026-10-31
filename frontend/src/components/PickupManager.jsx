import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  KeyRound, 
  AlertCircle, 
  ChevronRight, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataService } from '../services/dataService';

export default function PickupManager({ onNotification }) {
  const [pickups, setPickups] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // OTP Verification modal state
  const [verifyingPickup, setVerifyingPickup] = useState(null);
  const [inputOtp, setInputOtp] = useState('');

  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Morning (09:00 - 12:00)');
  const [agentName, setAgentName] = useState('Marcus Reed (GreenFleet #3)');
  const [agentPhone, setAgentPhone] = useState('+1 (555) 018-8765');
  const [vehicleNumber, setVehicleNumber] = useState('EV-RECYCLE-42');
  const [instructions, setInstructions] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const pList = await dataService.getPickups();
      const rList = await dataService.getRequests();
      setPickups(pList);
      setRequests(rList);
    } catch (err) {
      console.error(err);
      onNotification?.('error', 'Failed to load logistics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequestId) {
      onNotification?.('error', 'Please choose an e-waste request to schedule.');
      return;
    }

    try {
      const scheduled = await dataService.schedulePickup(selectedRequestId, {
        scheduledDate: pickupDate,
        timeSlot,
        agentName,
        agentPhone,
        vehicleNumber,
        instructions
      });

      onNotification?.('success', `Pickup scheduled! Verification OTP is: ${scheduled.confirmationOtp}`);
      setShowScheduleModal(false);
      setSelectedRequestId('');
      loadData();
    } catch (err) {
      onNotification?.('error', err.message);
    }
  };

  const handleCompletePickupWithOtp = async (e) => {
    e.preventDefault();
    if (!verifyingPickup) return;

    if (inputOtp.trim() !== verifyingPickup.confirmationOtp) {
      onNotification?.('error', 'Invalid verification OTP! Please check with the citizen.');
      return;
    }

    try {
      await dataService.updatePickupStatus(verifyingPickup.id, 'COMPLETED');

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}

      onNotification?.('success', `Pickup ${verifyingPickup.id} confirmed and marked collected!`);
      setVerifyingPickup(null);
      setInputOtp('');
      loadData();
    } catch (err) {
      onNotification?.('error', err.message);
    }
  };

  const eligibleForPickup = requests.filter(r => r.status === 'PENDING' || r.status === 'APPROVED');

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 64px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Truck color="var(--primary-light)" size={28} />
            <span>Fleet &amp; Doorstep Logistics</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Dispatch green recycling fleet, coordinate doorstep pickups, and verify handoffs with OTP
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          <PlusCircle size={17} />
          <span>Schedule New Dispatch</span>
        </button>
      </div>

      {/* Logistics Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading dispatch records...
        </div>
      ) : pickups.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Truck size={40} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No active dispatches scheduled</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            Click &quot;Schedule New Dispatch&quot; to assign a vehicle and time slot to an approved collection request.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px'
        }}>
          {pickups.map((pick) => {
            const req = requests.find(r => r.id === pick.requestId);
            const isCompleted = pick.pickupStatus === 'COMPLETED';

            return (
              <div 
                key={pick.id} 
                className="glass-panel"
                style={{
                  padding: '24px',
                  border: isCompleted ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                        DISPATCH #{pick.id}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: '2px 0 0' }}>
                        Ref: {pick.requestId}
                      </h3>
                      {req && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                          {req.brandModel} ({req.deviceCategory})
                        </p>
                      )}
                    </div>

                    <span className={`badge-status badge-${pick.pickupStatus.toLowerCase()}`}>
                      <span className="pulse-dot" />
                      {pick.pickupStatus}
                    </span>
                  </div>

                  {/* Route & Schedule details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={15} color="var(--primary-light)" />
                      <span>{pick.scheduledDate} • {pick.timeSlot}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color="#38bdf8" />
                      <span>{pick.pickupAddress}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={15} color="#c084fc" />
                      <span>Donor: <strong>{pick.userName}</strong> ({pick.userPhone})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Truck size={15} color="#fbbf24" />
                      <span>Vehicle: <strong>{pick.vehicleNumber}</strong> • Driver: {pick.agentName}</span>
                    </div>

                    {pick.instructions && (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        marginTop: '4px'
                      }}>
                        📝 Instructions: {pick.instructions}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions & OTP */}
                <div style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#34d399' }}>
                    <KeyRound size={14} />
                    <span>Handoff OTP: <strong>{pick.confirmationOtp}</strong></span>
                  </div>

                  {!isCompleted ? (
                    <button
                      onClick={() => {
                        setVerifyingPickup(pick);
                        setInputOtp('');
                      }}
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Verify &amp; Collect</span>
                    </button>
                  ) : (
                    <span style={{ color: 'var(--primary-light)', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Collected &amp; Verified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dispatch Scheduling Modal */}
      {showScheduleModal && (
        <div className="modal-backdrop" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={22} color="var(--primary-light)" />
              <span>Schedule Logistics Pickup</span>
            </h2>

            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Select Collection Request *</label>
                <select
                  className="form-select"
                  value={selectedRequestId}
                  onChange={(e) => setSelectedRequestId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Pending Request --</option>
                  {eligibleForPickup.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.id}: {r.brandModel} ({r.userName}) - {r.status}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Scheduled Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Time Window</label>
                  <select
                    className="form-select"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                    <option value="Afternoon (12:00 - 16:00)">Afternoon (12:00 - 16:00)</option>
                    <option value="Evening (16:00 - 19:00)">Evening (16:00 - 19:00)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Assigned Agent</label>
                  <input
                    type="text"
                    className="form-input"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Vehicle Identifier</label>
                  <input
                    type="text"
                    className="form-input"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Agent Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Special Driver Notes</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Ring back gate bell; customer requested hazard battery crate"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <CheckCircle2 size={16} />
                  <span>Confirm Dispatch Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {verifyingPickup && (
        <div className="modal-backdrop" onClick={() => setVerifyingPickup(null)}>
          <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <KeyRound size={26} />
            </div>

            <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Doorstep OTP Verification</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Ask citizen <strong>{verifyingPickup.userName}</strong> for the 4-digit code displayed on their tracker.
            </p>

            <form onSubmit={handleCompletePickupWithOtp}>
              <input
                type="text"
                maxLength={4}
                autoFocus
                placeholder="0000"
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                className="form-input"
                style={{
                  fontSize: '1.8rem',
                  letterSpacing: '0.4em',
                  textAlign: 'center',
                  fontWeight: 800,
                  marginBottom: '20px',
                  color: 'var(--primary-light)'
                }}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setVerifyingPickup(null)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Confirm OTP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
