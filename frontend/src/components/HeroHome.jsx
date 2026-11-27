import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Smartphone, 
  Laptop, 
  BatteryCharging, 
  CheckCircle2, 
  Search,
  MapPin,
  User,
  ShoppingBag,
  Award,
  Layers,
  Heart,
  Truck
} from 'lucide-react';

export default function HeroHome({ onOpenSubmitModal, setActiveTab }) {
  const [deviceSearch, setDeviceSearch] = useState('');
  const [cityLocation, setCityLocation] = useState('Austin, TX');

  const handleBarSubmit = (e) => {
    e.preventDefault();
    onOpenSubmitModal();
  };

  return (
    <div style={{ padding: '0 32px 48px' }}>
      {/* 1. HERO BANNER: SUNLIT ECO-RECYCLING FACILITY */}
      <section style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        height: '490px',
        background: 'url(/assets/hero_ewaste_nature.jpg) center/cover no-repeat',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-container)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 56px'
      }}>
        {/* Soft Left Shadow Gradient for Legibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(18, 42, 28, 0.82) 0%, rgba(18, 42, 28, 0.52) 52%, rgba(0, 0, 0, 0.08) 100%)',
          borderRadius: 'var(--radius-xl)'
        }} />

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '530px' }}>
          {/* Floating Pill Badge from Reference */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(37, 82, 59, 0.9)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            padding: '6px 16px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <Leaf size={14} />
            <span>Certified Zero-Landfill Facility</span>
          </div>

          {/* Headline Inspired by Reference Typography */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 4.8vw, 3.5rem)',
            lineHeight: 1.12,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '14px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Recycle E-Waste<br />Protect Nature
          </h1>

          <p style={{
            fontSize: '0.98rem',
            color: 'rgba(255, 255, 255, 0.92)',
            lineHeight: 1.55,
            marginBottom: '26px'
          }}>
            Doorstep electronic waste collection and certified recovery. Divert toxic lead &amp; mercury from soil while harvesting precious minerals back to circular tech.
          </p>

          <button
            onClick={onOpenSubmitModal}
            className="btn-forest-pill"
            style={{
              padding: '12px 28px',
              fontSize: '0.92rem',
              background: '#24533a',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Leaf size={15} />
            <span>Request Pickup</span>
          </button>
        </div>
      </section>

      {/* 2. FLOATING SAGE OVERLAPPING SEARCH PILL BAR */}
      <div style={{
        maxWidth: '920px',
        margin: '-34px auto 64px',
        position: 'relative',
        zIndex: 10
      }}>
        <form 
          onSubmit={handleBarSubmit}
          style={{
            background: 'var(--bg-pill-green)',
            borderRadius: 'var(--radius-pill)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-pill)',
            border: '1px solid var(--border-pill)'
          }}
        >
          {/* Device input pill */}
          <div style={{
            flex: 1.25,
            background: '#ffffff',
            borderRadius: 'var(--radius-pill)',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <Smartphone size={16} color="var(--forest-green)" />
            <input 
              type="text" 
              placeholder="Search device (laptop, phone, battery)..."
              value={deviceSearch}
              onChange={(e) => setDeviceSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.88rem',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-body)',
                background: 'transparent'
              }}
            />
          </div>

          {/* Location input pill */}
          <div style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: 'var(--radius-pill)',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <MapPin size={16} color="var(--forest-green)" />
            <input 
              type="text" 
              placeholder="Austin, TX • Nearest Depot"
              value={cityLocation}
              onChange={(e) => setCityLocation(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.88rem',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-body)',
                background: 'transparent'
              }}
            />
          </div>

          {/* User profile icon pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 8px',
            color: 'var(--forest-green)'
          }}>
            <User size={18} />
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--forest-green)'
            }} />
          </div>

          {/* Action pill button */}
          <button
            type="submit"
            className="btn-forest-pill"
            style={{
              padding: '11px 28px',
              fontSize: '0.9rem'
            }}
          >
            <span>Recycle</span>
          </button>
        </form>
      </div>

      {/* 3. WELCOME SECTION (2 COLUMNS INSPIRED BY REFERENCE) */}
      <section style={{
        maxWidth: '1020px',
        margin: '0 auto 72px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* Left column: Photo card with floating overlapping circular badges */}
        <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
          <div style={{
            width: '370px',
            height: '250px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            border: '4px solid #ffffff'
          }}>
            <img 
              src="/assets/facility_ewaste_dropoff.jpg" 
              alt="Certified Eco-friendly e-waste drop-off pavilion" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Top-Left Floating Green Circle Badge */}
          <div style={{
            position: 'absolute',
            top: '-14px',
            left: '-14px',
            width: '66px',
            height: '66px',
            borderRadius: '50%',
            background: 'var(--forest-green)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 18px rgba(37, 82, 59, 0.35)',
            border: '2px solid #ffffff'
          }}>
            <Leaf size={18} />
            <span style={{ fontSize: '0.58rem', fontWeight: 800, marginTop: '2px', letterSpacing: '0.04em' }}>VERIFIED</span>
          </div>

          {/* Bottom-Right Floating Warm Peach Flower Badge */}
          <div style={{
            position: 'absolute',
            bottom: '-12px',
            right: '-12px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#e07a5f',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 18px rgba(224, 122, 95, 0.35)',
            border: '2px solid #ffffff'
          }}>
            <Sparkles size={22} />
          </div>
        </div>

        {/* Right column: Heading, text, and pill buttons */}
        <div>
          <h2 style={{
            fontSize: '2.1rem',
            color: 'var(--text-main)',
            marginBottom: '14px',
            letterSpacing: '-0.02em'
          }}>
            Welcome to EcoDrop
          </h2>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.94rem',
            lineHeight: 1.65,
            marginBottom: '26px'
          }}>
            Every year, millions of obsolete gadgets end up in landfills, leaking toxic chemicals into groundwater. EcoDrop bridges homes and businesses with certified zero-landfill e-waste processing. We guarantee secure data destruction, transparent custody tracking, and precious mineral recovery.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onOpenSubmitModal}
              className="btn-forest-pill"
              style={{ padding: '11px 26px', fontSize: '0.88rem' }}
            >
              <Leaf size={15} />
              <span>Request Collection</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--forest-green)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>Track custody chain</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. 3 SUSTAINABLE CARDS ROW (IN THE EXACT REFERENCE LAYOUT) */}
      <section style={{ maxWidth: '1080px', margin: '0 auto 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '34px' }}>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--text-main)', marginBottom: '8px' }}>
            Certified E-Waste Recycling Programs
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
            Compliant disposal categorized by toxicity grade and circular mineral reclamation
          </p>
        </div>

        {/* 3 Reference Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '24px'
        }}>
          {/* Card 1: Computers & Smart Devices */}
          <div className="eco-card" style={{ overflow: 'hidden', padding: '14px' }}>
            <div style={{
              height: '190px',
              borderRadius: '18px',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <img 
                src="/assets/card_ewaste_devices.jpg" 
                alt="Computers, laptops and circuit boards recycling" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '0 6px 6px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: 'var(--text-main)' }}>
                Computers &amp; Smart Devices
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '18px' }}>
                Hardware inspection, certified physical memory wiping, and reclamation of gold, silver, and copper.
              </p>
              <button 
                onClick={onOpenSubmitModal}
                className="btn-forest-pill"
                style={{ width: '100%', padding: '10px', fontSize: '0.86rem' }}
              >
                <span>Request Pickup</span>
              </button>
            </div>
          </div>

          {/* Card 2: Lithium & Power Cells */}
          <div className="eco-card" style={{ overflow: 'hidden', padding: '14px' }}>
            <div style={{
              height: '190px',
              borderRadius: '18px',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <img 
                src="/assets/card_ewaste_batteries.jpg" 
                alt="Lithium battery circular eco testing and recycling" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '0 6px 6px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: 'var(--text-main)' }}>
                Lithium &amp; Power Cells
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '18px' }}>
                Safe hydrometallurgical processing for lithium-ion, cobalt, and nickel cells with zero risk of combustion.
              </p>
              <button 
                onClick={onOpenSubmitModal}
                className="btn-forest-pill"
                style={{ width: '100%', padding: '10px', fontSize: '0.86rem' }}
              >
                <span>Schedule Drop-off</span>
              </button>
            </div>
          </div>

          {/* Card 3: Electric Fleet Logistics */}
          <div className="eco-card" style={{ overflow: 'hidden', padding: '14px' }}>
            <div style={{
              height: '190px',
              borderRadius: '18px',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <img 
                src="/assets/card_ewaste_logistics.jpg" 
                alt="100 percent electric collection van for doorstep pickup" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '0 6px 6px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: 'var(--text-main)' }}>
                Doorstep Fleet Logistics
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '18px' }}>
                100% electric collection fleet for residential and office bulk IT equipment retirement with chain of custody.
              </p>
              <button 
                onClick={() => setActiveTab('pickups')}
                className="btn-forest-pill"
                style={{ width: '100%', padding: '10px', fontSize: '0.86rem' }}
              >
                <span>Book Logistics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reference Bottom Pagination Dots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '38px'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--forest-green)' }} />
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#c8d4cc' }} />
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#c8d4cc' }} />
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#c8d4cc' }} />
        </div>
      </section>
    </div>
  );
}
