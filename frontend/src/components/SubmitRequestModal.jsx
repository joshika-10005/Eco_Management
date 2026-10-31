import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, Leaf, ShieldAlert, Calendar, MapPin, Package, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataService } from '../services/dataService';

const CATEGORIES = [
  'Smartphones & Tablets',
  'Laptops & Computers',
  'Lithium Batteries',
  'Monitors & Displays',
  'Home Appliances',
  'Other Electronic Scrap'
];

export default function SubmitRequestModal({ isOpen, onClose, currentUser, onRequestCreated, onNotification }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [brandModel, setBrandModel] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [weightKg, setWeightKg] = useState(2.0);
  const [condition, setCondition] = useState('Damaged');
  const [hazardLevel, setHazardLevel] = useState('Medium');
  const [address, setAddress] = useState(currentUser?.address || '742 Evergreen Terrace, Austin, TX');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Estimated points
  const estReward = Math.round(50 + (weightKg * 20) + ((quantity - 1) * 25));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandModel.trim()) {
      onNotification?.('error', 'Please specify device brand and model.');
      return;
    }

    setSubmitting(true);
    try {
      const newRequest = await dataService.createRequest({
        userName: currentUser?.fullName || 'Alex Rivera (Citizen)',
        userEmail: currentUser?.email || 'citizen@ecodrop.org',
        userPhone: currentUser?.phone || '+1 555-0144',
        deviceCategory: category,
        brandModel: brandModel.trim(),
        quantity: parseInt(quantity) || 1,
        estimatedWeightKg: parseFloat(weightKg) || 1.0,
        condition,
        hazardLevel,
        pickupAddress: address.trim(),
        preferredDate,
        notes: notes.trim()
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // non-blocking
      }

      onNotification?.('success', `E-Waste request ${newRequest.id} created! +${estReward} EcoPoints pending verification.`);
      onRequestCreated?.(newRequest);
      onClose();
    } catch (err) {
      onNotification?.('error', err.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-light)'
            }}>
              <Leaf size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Submit E-Waste for Recycling</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>
                Doorstep collection with verifiable material chain of custody
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              borderRadius: '50%',
              padding: '6px',
              display: 'flex'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Category */}
          <div>
            <label className="form-label">Device Category</label>
            <select 
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value.includes('Batteries')) setHazardLevel('High (Toxic/Battery)');
                else if (e.target.value.includes('Appliances')) setHazardLevel('Low');
                else setHazardLevel('Medium');
              }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Brand & Model */}
          <div>
            <label className="form-label">Brand &amp; Model Details *</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g., Apple iPhone 12 Pro (Cracked) + Lenovo ThinkPad" 
              value={brandModel}
              onChange={(e) => setBrandModel(e.target.value)}
              required
            />
          </div>

          {/* Quantity & Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Item Quantity</label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Estimated Weight (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                min="0.1" 
                max="100" 
                className="form-input"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </div>
          </div>

          {/* Condition & Hazard Level */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Physical Condition</label>
              <select 
                className="form-select"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="Working">Working (Refurbishable)</option>
                <option value="Damaged">Damaged / Broken Parts</option>
                <option value="Dead / Scrap">Dead / Scrap Metal Only</option>
              </select>
            </div>
            <div>
              <label className="form-label">Hazard Level</label>
              <select 
                className="form-select"
                value={hazardLevel}
                onChange={(e) => setHazardLevel(e.target.value)}
              >
                <option value="Low">Low (Plastics & Cables)</option>
                <option value="Medium">Medium (PCBs & Monitors)</option>
                <option value="High (Toxic/Battery)">High (Toxic/Battery/Lead)</option>
              </select>
            </div>
          </div>

          {/* Address & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Pickup Address</label>
              <input 
                type="text" 
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Doorstep address"
                required
              />
            </div>
            <div>
              <label className="form-label">Preferred Date</label>
              <input 
                type="date" 
                className="form-input"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="form-label">Special Notes (Optional)</label>
            <textarea 
              className="form-textarea"
              rows={2}
              placeholder="e.g. Swollen battery, requires anti-static pouch, gate code #401"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Estimated reward badge */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles color="var(--primary-light)" size={18} />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Calculated Reward Credit</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
                  Credited upon verified recycling completion
                </p>
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-light)' }}>
              +{estReward} EcoPoints
            </div>
          </div>

          {/* Submit CTA */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              <Leaf size={16} />
              <span>{submitting ? 'Submitting...' : 'Confirm Collection Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
