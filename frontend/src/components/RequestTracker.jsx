import React, { useState, useEffect } from 'react';
import { 
  ListOrdered, 
  Search, 
  Calendar, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  Award, 
  Sparkles, 
  XCircle,
  KeyRound,
  FileText
} from 'lucide-react';
import { dataService } from '../services/dataService';

const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'SCHEDULED', 'PICKED_UP', 'RECYCLED'];

const TIMELINE_STEPS = [
  { key: 'PENDING', label: '1. Request Logged', desc: 'Registered in database' },
  { key: 'APPROVED', label: '2. Hazard Review', desc: 'Toxicity check passed' },
  { key: 'SCHEDULED', label: '3. Logistics Assigned', desc: 'Fleet driver dispatched' },
  { key: 'PICKED_UP', label: '4. Scrap Collected', desc: 'Loaded into green transport' },
  { key: 'RECYCLED', label: '5. Refined & Recycled', desc: 'Zero-landfill certified' }
];

export default function RequestTracker({ currentUser, onOpenScheduleModal, onNotification }) {
  const [requests, setRequests] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const isRoleAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'RECYCLER';
      const reqList = await dataService.getRequests(isRoleAdmin ? null : currentUser?.id);
      const pickList = await dataService.getPickups();
      setRequests(reqList);
      setPickups(pickList);
    } catch (err) {
      console.error(err);
      onNotification?.('error', 'Failed to load e-waste requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await dataService.updateRequestStatus(id, 'REJECTED', 'Cancelled by citizen');
      onNotification?.('info', `Request ${id} has been cancelled.`);
      fetchData();
    } catch (err) {
      onNotification?.('error', err.message);
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'APPROVED': return 1;
      case 'SCHEDULED': return 2;
      case 'PICKED_UP': return 3;
      case 'RECYCLED': return 4;
      default: return 0;
    }
  };

  const filtered = requests.filter(r => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const matchesSearch = 
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.brandModel.toLowerCase().includes(search.toLowerCase()) ||
      r.deviceCategory.toLowerCase().includes(search.toLowerCase()) ||
      r.userName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px 64px' }}>
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
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#132a20' }}>
            <ListOrdered color="#059669" size={28} />
            <span>Recycling Request Tracker</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Live status of your submitted e-waste collections and verified recycling milestones
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search by device, ID, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '24px'
      }}>
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              background: filter === s ? '#d1fae5' : '#ffffff',
              color: filter === s ? '#047857' : 'var(--text-muted)',
              border: filter === s ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              padding: '7px 16px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: filter === s ? '0 2px 8px rgba(16, 185, 129, 0.12)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            {s === 'ALL' ? 'ALL REQUESTS' : s}
            <span style={{ marginLeft: '6px', opacity: 0.75 }}>
              ({s === 'ALL' ? requests.length : requests.filter(r => r.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading collection records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff' }}>
          <Clock size={40} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: '#132a20' }}>No matching requests found</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            {search ? 'Try adjusting your search criteria.' : 'Submit your first e-waste item for collection to see it here!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.map((req) => {
            const currentStepIdx = getStepIndex(req.status);
            const pickup = pickups.find(p => p.requestId === req.id);

            return (
              <div 
                key={req.id} 
                className="glass-panel"
                style={{
                  padding: '28px',
                  background: '#ffffff',
                  border: req.status === 'RECYCLED' ? '1px solid #a7f3d0' : '1px solid var(--border-subtle)'
                }}
              >
                {/* Top Info Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#047857', letterSpacing: '0.02em' }}>
                      {req.id}
                    </span>
                    <span className={`badge-status badge-${req.status.toLowerCase()}`}>
                      <span className="pulse-dot" />
                      {req.status}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      Submitted {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#d1fae5',
                      color: '#047857',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      fontSize: '0.82rem'
                    }}>
                      <Award size={14} />
                      <span>+{req.rewardPoints} EcoPoints</span>
                    </div>

                    {req.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(req.id)}
                        className="btn-danger"
                        title="Cancel this request"
                      >
                        <XCircle size={14} />
                        <span>Cancel</span>
                      </button>
                    )}

                    {req.status === 'RECYCLED' && (
                      <button
                        onClick={() => setSelectedReceipt(req)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <FileText size={14} />
                        <span>Recycling Certificate</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Device Model
                    </span>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                      {req.brandModel}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {req.deviceCategory} ({req.quantity} unit{req.quantity > 1 ? 's' : ''})
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Weight &amp; Toxicity
                    </span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                      {req.estimatedWeightKg} kg • Condition: {req.condition}
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      color: req.hazardLevel.includes('High') ? '#e11d48' : req.hazardLevel.includes('Medium') ? '#0284c7' : '#059669',
                      fontWeight: 600
                    }}>
                      Hazard: {req.hazardLevel}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Pickup Logistics
                    </span>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="#059669" />
                      <span>{req.pickupAddress}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <Calendar size={13} />
                      <span>Preferred: {req.preferredDate}</span>
                    </div>
                  </div>

                  {/* Pickup Agent Info if scheduled */}
                  {pickup && (
                    <div style={{
                      background: '#f3e8ff',
                      border: '1px solid #e9d5ff',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 14px'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Truck size={13} />
                        <span>DISPATCHED FLEET</span>
                      </div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#132a20', marginTop: '2px' }}>
                        {pickup.agentName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        Slot: {pickup.timeSlot}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <KeyRound size={12} />
                        <span>Verification OTP: <strong>{pickup.confirmationOtp}</strong></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5-Step Visual Progress Bar */}
                <div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                    position: 'relative',
                    marginBottom: '10px'
                  }}>
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isComplete = idx <= currentStepIdx && req.status !== 'REJECTED';

                      return (
                        <div key={step.key} style={{ textAlign: 'center' }}>
                          <div style={{
                            height: '6px',
                            borderRadius: '3px',
                            background: isComplete 
                              ? 'linear-gradient(90deg, #34d399 0%, #059669 100%)' 
                              : '#e2ece5',
                            marginBottom: '8px',
                            transition: 'all 0.3s'
                          }} />
                          <div style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: isComplete ? '#047857' : 'var(--text-dim)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            {isComplete && <CheckCircle2 size={12} color="#059669" />}
                            <span>{step.label}</span>
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                            {step.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Action if Approved but not yet Scheduled */}
                {req.status === 'APPROVED' && !pickup && (
                  <div style={{
                    marginTop: '16px',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#047857' }}>
                      ✅ Environmental clearance granted. Schedule a pickup driver to finalize collection time.
                    </div>
                    <button
                      onClick={() => onOpenScheduleModal(req)}
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    >
                      <Truck size={14} />
                      <span>Book Pickup Slot</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Recycling Certificate Modal */}
      {selectedReceipt && (
        <div className="modal-backdrop" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#d1fae5',
                color: '#047857',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <ShieldCheck size={32} />
              </div>
              <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#132a20' }}>Certified E-Waste Recycling Certificate</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>
                Zero-Landfill Diversion &amp; Hazardous Material Isolation Guarantee
              </p>
            </div>

            <div style={{ padding: '20px 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f3', padding: '6px 0' }}>
                <span>Certificate Serial:</span>
                <strong style={{ color: '#132a20' }}>ECD-{selectedReceipt.id}-R2X</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f3', padding: '6px 0' }}>
                <span>Donor Citizen:</span>
                <strong style={{ color: '#132a20' }}>{selectedReceipt.userName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f3', padding: '6px 0' }}>
                <span>Item Processed:</span>
                <strong style={{ color: '#132a20' }}>{selectedReceipt.brandModel} ({selectedReceipt.quantity} unit)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f3', padding: '6px 0' }}>
                <span>Total Scrap Diverted:</span>
                <strong style={{ color: '#047857' }}>{selectedReceipt.estimatedWeightKg} KG</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f3', padding: '6px 0' }}>
                <span>CO₂ Avoided:</span>
                <strong style={{ color: '#0284c7' }}>~{Math.round(selectedReceipt.estimatedWeightKg * 1.82 * 10) / 10} KG</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span>EcoPoints Credited:</span>
                <strong style={{ color: '#7c3aed' }}>+{selectedReceipt.rewardPoints} Points</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
