import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Download, 
  RotateCcw, 
  Database, 
  ShieldCheck, 
  AlertTriangle,
  ArrowUpRight,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { storageService } from '../services/storageService';

export default function AdminPanel({ onNotification }) {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const s = await dataService.getDashboardStats();
      const r = await dataService.getRequests();
      setStats(s);
      setRequests(r);
    } catch (err) {
      console.error(err);
      onNotification?.('error', 'Failed to load admin intelligence data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await dataService.updateRequestStatus(requestId, newStatus);
      onNotification?.('success', `Request ${requestId} status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      onNotification?.('error', err.message);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to clean sample records in LocalStorage?')) {
      dataService.resetDemoData();
      onNotification?.('info', 'Demo seed data reset successfully!');
      loadData();
    }
  };

  const handleExportJson = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      collections: {
        users: storageService.getUsers(),
        ewaste_requests: storageService.getRequests(),
        pickup_details: storageService.getPickups()
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecodrop_mongodb_collections_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotification?.('success', 'MongoDB collections exported to JSON!');
  };

  const filteredRequests = requests.filter(r => filter === 'ALL' || r.status === filter);

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
            <BarChart3 color="var(--primary-light)" size={28} />
            <span>Admin Intelligence &amp; Control</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Oversee circular recycling supply chain, review collections, and audit environmental impact
          </p>
        </div>

        {/* Global Control Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportJson}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
          >
            <Download size={15} />
            <span>Export Collections (JSON)</span>
          </button>

          <button
            onClick={handleResetData}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.84rem', color: '#fb7185' }}
          >
            <RotateCcw size={15} />
            <span>Reset Demo Seed</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px',
          marginBottom: '36px'
        }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Requests</span>
              <Layers size={16} color="var(--primary-light)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{stats.totalRequests}</div>
            <span style={{ fontSize: '0.78rem', color: '#34d399' }}>Logged across platform</span>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Awaiting Review</span>
              <Clock size={16} color="#fbbf24" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>{stats.pendingRequests}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Require hazard check</span>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Scheduled Pickups</span>
              <Users size={16} color="#c084fc" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc' }}>{stats.scheduledPickups}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Fleet units assigned</span>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Diverted Scrap</span>
              <CheckCircle2 size={16} color="var(--primary-light)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-light)' }}>
              {stats.kgDivertedFromLandfills} <span style={{ fontSize: '1rem', fontWeight: 500 }}>kg</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>~{stats.co2AvoidedKg} kg CO₂ saved</span>
          </div>
        </div>
      )}

      {/* Master Requests Table Panel */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>All E-Waste Collection Requests</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>
              Directly transition workflow status from the dropdown
            </p>
          </div>

          {/* Quick Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} color="var(--text-dim)" />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Statuses ({requests.length})</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="PICKED_UP">PICKED_UP</option>
              <option value="RECYCLED">RECYCLED</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>ID &amp; Donor</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Device Item</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Weight / Hazard</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Address</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{r.id}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.userName}</div>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{r.brandModel}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{r.deviceCategory} (Qty: {r.quantity})</div>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <div>{r.estimatedWeightKg} kg</div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: r.hazardLevel.includes('High') ? '#fb7185' : r.hazardLevel.includes('Medium') ? '#38bdf8' : '#34d399'
                    }}>
                      {r.hazardLevel}
                    </span>
                  </td>

                  <td style={{ padding: '14px', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span title={r.pickupAddress}>{r.pickupAddress}</span>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <span className={`badge-status badge-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <select
                      className="form-select"
                      style={{ padding: '4px 10px', fontSize: '0.8rem', width: '130px' }}
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="PICKED_UP">PICKED_UP</option>
                      <option value="RECYCLED">RECYCLED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MongoDB Atlas Collections Schema Reference */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} color="var(--primary-light)" />
          <span>MongoDB Atlas Collection Mappings</span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ color: '#34d399', marginBottom: '8px' }}>Collection: <code>users</code></h4>
            <pre style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', overflowX: 'auto' }}>
{`{
  "_id": ObjectId("..."),
  "fullName": "Alex Rivera",
  "email": "citizen@ecodrop.org",
  "role": "CITIZEN", // CITIZEN, ADMIN, RECYCLER
  "phone": "+1-555-0144",
  "address": "Austin, TX",
  "ecoPoints": 280,
  "createdAt": ISODate("...")
}`}
            </pre>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ color: '#38bdf8', marginBottom: '8px' }}>Collection: <code>ewaste_requests</code></h4>
            <pre style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', overflowX: 'auto' }}>
{`{
  "_id": ObjectId("..."),
  "userId": "user-citizen",
  "deviceCategory": "Laptops & Computers",
  "brandModel": "ThinkPad T480",
  "quantity": 2,
  "estimatedWeightKg": 4.8,
  "condition": "Damaged",
  "hazardLevel": "Medium",
  "status": "SCHEDULED",
  "rewardPoints": 210,
  "createdAt": ISODate("...")
}`}
            </pre>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ color: '#c084fc', marginBottom: '8px' }}>Collection: <code>pickup_details</code></h4>
            <pre style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', overflowX: 'auto' }}>
{`{
  "_id": ObjectId("..."),
  "requestId": "REQ-1001",
  "scheduledDate": "2026-11-04",
  "timeSlot": "Morning (09:00 - 12:00)",
  "agentName": "Marcus Reed (GreenFleet #3)",
  "vehicleNumber": "EV-RECYCLE-42",
  "confirmationOtp": "5821",
  "pickupStatus": "SCHEDULED"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
