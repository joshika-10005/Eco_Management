import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Smartphone, 
  Laptop, 
  BatteryCharging, 
  Tv, 
  Cpu, 
  CheckCircle2, 
  Calculator, 
  Award, 
  Server, 
  Database, 
  Container, 
  GitBranch 
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'smartphones',
    name: 'Smartphones & Tablets',
    icon: Smartphone,
    hazard: 'High (Lithium-Ion)',
    hazardColor: '#f59e0b',
    description: 'Recovers gold contacts, cobalt, lithium cathode salts, and rare-earth neodymium magnets.',
    defaultWeightKg: 0.25,
    pointsPerUnit: 70
  },
  {
    id: 'laptops',
    name: 'Laptops & Computers',
    icon: Laptop,
    hazard: 'Medium',
    hazardColor: '#06b6d4',
    description: 'Certified shredding of motherboards, CPU silicon recovery, tantalum capacitors, and copper heatsinks.',
    defaultWeightKg: 2.4,
    pointsPerUnit: 120
  },
  {
    id: 'batteries',
    name: 'Lithium & Lead Batteries',
    icon: BatteryCharging,
    hazard: 'Critical (Toxic)',
    hazardColor: '#f43f5e',
    description: 'Closed-loop hydrometallurgical neutralization preventing underground aquifer poisoning.',
    defaultWeightKg: 0.8,
    pointsPerUnit: 90
  },
  {
    id: 'monitors',
    name: 'Monitors & Displays',
    icon: Tv,
    hazard: 'Medium',
    hazardColor: '#06b6d4',
    description: 'Safe extraction of mercury fluorescent backlights, indium tin oxide (ITO), and tempered glass.',
    defaultWeightKg: 4.5,
    pointsPerUnit: 110
  },
  {
    id: 'appliances',
    name: 'Printers & Peripherals',
    icon: Cpu,
    hazard: 'Low',
    hazardColor: '#10b981',
    description: 'High-impact circular recovery of engineering ABS plastics, stepper motors, and copper wiring.',
    defaultWeightKg: 5.2,
    pointsPerUnit: 80
  }
];

export default function HeroHome({ onOpenSubmitModal, setActiveTab }) {
  // Calculator state
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [quantity, setQuantity] = useState(3);

  const calcWeight = Math.round(selectedCategory.defaultWeightKg * quantity * 10) / 10;
  const calcCo2 = Math.round(calcWeight * 1.82 * 10) / 10;
  const calcPoints = selectedCategory.pointsPerUnit * quantity;
  const calcToxicLeadGrams = Math.round(calcWeight * 42);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 64px' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '50px 20px 60px',
        position: 'relative'
      }}>
        {/* Glowing Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '6px 18px',
          borderRadius: '9999px',
          color: '#34d399',
          fontSize: '0.86rem',
          fontWeight: 700,
          marginBottom: '24px',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)'
        }}>
          <Sparkles size={15} />
          <span>ZERO-LANDFILL CERTIFIED E-WASTE INITIATIVE</span>
        </div>

        {/* Main Title */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: 1.1,
          fontWeight: 800,
          maxWidth: '940px',
          margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Responsible E-Waste Recycling with <span style={{
            background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Real-Time Tracking</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Safely dispose of decommissioned electronics. Schedule verified doorstep collection, prevent toxic heavy metal leaching, and earn redeemable EcoPoints.
        </p>

        {/* Hero CTA buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onOpenSubmitModal}
            className="btn-primary"
            style={{ padding: '14px 32px', fontSize: '1.05rem', borderRadius: 'var(--radius-lg)' }}
          >
            <Leaf size={20} />
            <span>Request Free Doorstep Pickup</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className="btn-secondary"
            style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: 'var(--radius-lg)' }}
          >
            <span>Track Existing Request</span>
          </button>
        </div>

        {/* Impact Ticker Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginTop: '56px',
          textAlign: 'left'
        }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ color: 'var(--primary-light)', fontSize: '2rem', fontWeight: 800 }}>14,820 kg</div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>E-Waste Diverted</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>From municipal landfills into certified circular plants</div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '2rem', fontWeight: 800 }}>26.9 Tons</div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>CO₂ Emissions Saved</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>Avoiding virgin raw metal mining and smelting</div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ color: '#fbbf24', fontSize: '2rem', fontWeight: 800 }}>620 kg</div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>Toxic Lead Prevented</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>Neutralized cathode ray &amp; solder toxins safely</div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ color: '#c084fc', fontSize: '2rem', fontWeight: 800 }}>99.4%</div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>Recovery Efficiency</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>ISO 14001 / R2 compliant processing facilities</div>
          </div>
        </div>
      </section>

      {/* Accepted E-Waste Categories Showcase */}
      <section style={{ marginTop: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Accepted E-Waste Categories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Specialized handling protocols according to toxicity and resource classification
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '20px'
        }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.id} 
                className="glass-panel-interactive"
                onClick={onOpenSubmitModal}
                style={{ padding: '24px', cursor: 'pointer' }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-light)',
                  marginBottom: '16px'
                }}>
                  <Icon size={24} />
                </div>

                <div style={{
                  display: 'inline-block',
                  background: `${cat.hazardColor}18`,
                  color: cat.hazardColor,
                  border: `1px solid ${cat.hazardColor}33`,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  marginBottom: '10px'
                }}>
                  Hazard: {cat.hazard}
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  {cat.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Earn ~{cat.pointsPerUnit} pts / unit</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Recycling Impact Estimator */}
      <section style={{ marginTop: '64px' }}>
        <div className="glass-panel" style={{
          padding: '40px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          background: 'linear-gradient(135deg, rgba(14, 26, 34, 0.9) 0%, rgba(10, 18, 24, 0.95) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Calculator color="var(--primary-light)" size={24} />
            <h2 style={{ fontSize: '1.8rem' }}>Interactive Recycling Impact Calculator</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            Simulate your positive ecological contribution and calculated reward points before scheduling.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '36px'
          }}>
            {/* Input Controls */}
            <div>
              <label className="form-label">1. Select Electronic Category</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c)}
                    style={{
                      background: selectedCategory.id === c.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: selectedCategory.id === c.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: selectedCategory.id === c.id ? '#34d399' : 'var(--text-main)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>{c.name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{c.hazard}</span>
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0 }}>2. Item Quantity</label>
                  <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{quantity} units</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>
            </div>

            {/* Calculated Output Cards */}
            <div style={{
              background: 'rgba(7, 14, 18, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                  Estimated Environmental Return
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Est. Weight Diverted:</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{calcWeight} kg</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CO₂ Avoided:</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-light)' }}>{calcCo2} kg</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toxins Isolated:</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>~{calcToxicLeadGrams} g</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>EcoPoints Reward:</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc' }}>+{calcPoints} pts</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '28px' }}>
                <button
                  onClick={onOpenSubmitModal}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  <Leaf size={16} />
                  <span>Claim {calcPoints} EcoPoints &amp; Schedule Pickup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Stack Section */}
      <section style={{ marginTop: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Enterprise System Architecture</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Production-grade stack bridging React Vite, Spring Boot REST APIs, MongoDB Atlas, and DevOps
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '12px' }}>
              <Cpu size={20} />
              <h3 style={{ fontSize: '1.1rem' }}>Frontend Layer</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <li>• React.js &amp; Vite Build Tool</li>
              <li>• Vanilla Design System (Emerald Dark Glass)</li>
              <li>• LocalStorage Offline Persistence Engine</li>
              <li>• Seamless Spring Boot API Toggle</li>
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', marginBottom: '12px' }}>
              <Server size={20} />
              <h3 style={{ fontSize: '1.1rem' }}>Spring Boot Backend</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <li>• Java 21 &amp; Spring Boot 3.3.4</li>
              <li>• Spring Data MongoDB Repositories</li>
              <li>• REST Controllers: Auth, Requests, Pickups</li>
              <li>• Dynamic CORS &amp; Automated Data Seeding</li>
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '12px' }}>
              <Database size={20} />
              <h3 style={{ fontSize: '1.1rem' }}>MongoDB Atlas Cloud</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <li>• Collections: <code>users</code></li>
              <li>• Collections: <code>ewaste_requests</code></li>
              <li>• Collections: <code>pickup_details</code></li>
              <li>• Credential safety via <code>MONGODB_URI</code></li>
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', marginBottom: '12px' }}>
              <Container size={20} />
              <h3 style={{ fontSize: '1.1rem' }}>DevOps &amp; Cloud Native</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <li>• Multi-Stage Dockerfiles (Client &amp; Server)</li>
              <li>• Docker Compose Orchestration</li>
              <li>• Kubernetes Deployments &amp; Secrets</li>
              <li>• Multi-Stage Jenkinsfile CI/CD Pipeline</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
