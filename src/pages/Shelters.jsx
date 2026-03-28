import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Shelters() {
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:8000/shelters')
      .then(res => { setShelters(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = shelters.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  )

  const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c14', color: '#e2e8f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }

        .nav-link { color: #64748b; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: .5px; padding: 6px 0; border-bottom: 2px solid transparent; transition: all .2s; }
        .nav-link:hover { color: #e2e8f0; border-bottom-color: #38bdf8; }
        .nav-link.active { color: #e2e8f0; border-bottom-color: #38bdf8; }

        .shelter-card { background: #0a1628; border: 1px solid #0f2035; border-radius: 14px; padding: 22px; cursor: pointer; transition: all .25s; }
        .shelter-card:hover { border-color: #1e3a5f; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,.4); }
        .shelter-card.selected { border-color: #38bdf8; background: rgba(14,165,233,.05); box-shadow: 0 0 0 1px rgba(56,189,248,.2), 0 8px 32px rgba(14,165,233,.1); }

        .search-input { width: 100%; background: #0a1628; border: 1px solid #0f2035; color: #e2e8f0; padding: 12px 16px 12px 44px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color .2s; }
        .search-input:focus { border-color: #38bdf8; }
        .search-input::placeholder { color: #334155; }

        .capacity-bar-fill { height: '100%'; border-radius: 4px; transition: width 1s ease; }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #0f2035', padding: '0 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🛡️</div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '2px', color: '#e2e8f0' }}>SAHAAY</span>
          </a>
          <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            <a href="/" className="nav-link">DASHBOARD</a>
            <a href="/alerts" className="nav-link">ALERTS</a>
            <a href="/shelters" className="nav-link active">SHELTERS</a>
            <a href="/sos" style={{ background: '#dc2626', color: 'white', padding: '7px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif" }}>SOS</a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px', animation: 'fadeUp .5s ease' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#38bdf8', letterSpacing: '3px', fontFamily: "'DM Mono', monospace", marginBottom: '8px' }}>EMERGENCY INFRASTRUCTURE</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', letterSpacing: '2px', lineHeight: 1 }}>NEAREST SHELTERS</h1>
            <p style={{ color: '#475569', marginTop: '8px', fontSize: '15px' }}>Emergency shelters available in your region</p>
          </div>
        </div>

        {/* Stats row */}
        {!loading && shelters.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px', animation: 'fadeUp .5s .1s ease both' }}>
            {[
              { label: 'TOTAL SHELTERS', value: shelters.length, icon: '🏕️', color: '#38bdf8' },
              { label: 'TOTAL CAPACITY', value: totalCapacity.toLocaleString(), icon: '👥', color: '#22c55e' },
              { label: 'STATUS', value: 'OPERATIONAL', icon: '✅', color: '#22c55e' },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#0a1628', border: '1px solid #0f2035', borderRadius: '12px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#475569', letterSpacing: '1.5px', fontFamily: "'DM Mono', monospace", marginBottom: '8px' }}>{stat.label}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: stat.color, letterSpacing: '2px' }}>{stat.value}</div>
                  </div>
                  <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '24px', animation: 'fadeUp .5s .15s ease both' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#334155', fontSize: '16px' }}>🔍</span>
          <input
            className="search-input"
            placeholder="Search shelters by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '20px', animation: 'fadeUp .5s .2s ease both' }}>

          {/* Shelter grid */}
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ background: 'linear-gradient(90deg, #0a1628 25%, #0f2035 50%, #0a1628 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '14px', height: '150px' }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ background: '#0a1628', border: '1px solid #0f2035', borderRadius: '14px', padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                <div style={{ color: '#475569', fontSize: '15px' }}>No shelters found matching "{search}"</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr' : '1fr 1fr', gap: '14px' }}>
                {filtered.map((shelter, i) => {
                  const occupancyPct = shelter.occupancy ? Math.min((shelter.occupancy / shelter.capacity) * 100, 100) : null
                  const isSelected = selected === i

                  return (
                    <div key={i}
                      className={`shelter-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelected(isSelected ? null : i)}
                      style={{ animationDelay: `${i * 0.04}s`, animation: 'fadeUp .4s ease both' }}>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                        <div style={{ fontSize: '28px' }}>
                          {i % 3 === 0 ? '🏫' : i % 3 === 1 ? '🏟️' : '🏕️'}
                        </div>
                        <span style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', color: '#22c55e', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '1.5px', padding: '3px 10px', borderRadius: '20px' }}>
                          OPEN
                        </span>
                      </div>

                      <div style={{ fontWeight: '700', fontSize: '16px', color: '#f1f5f9', marginBottom: '8px', lineHeight: '1.3' }}>{shelter.name}</div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                        <span style={{ fontSize: '12px', color: '#475569' }}>📍</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#334155' }}>
                          {shelter.lat?.toFixed(4)}, {shelter.lng?.toFixed(4)}
                        </span>
                      </div>

                      {/* Capacity bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#475569', fontFamily: "'DM Mono', monospace", letterSpacing: '1px' }}>CAPACITY</span>
                          <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>{shelter.capacity?.toLocaleString()}</span>
                        </div>
                        <div style={{ background: '#0f2035', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', width: `${Math.min(100, (100 / (shelter.capacity || 100)) * 20)}%`, transition: 'width 1s ease' }} />
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #0f2035' }}>
                          <a
                            href={`https://maps.google.com/?q=${shelter.lat},${shelter.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'block', textAlign: 'center', background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.2)', color: '#38bdf8', borderRadius: '8px', padding: '10px', fontSize: '12px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px', textDecoration: 'none' }}
                            onClick={e => e.stopPropagation()}>
                            OPEN IN MAPS →
                          </a>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected !== null && filtered[selected] && (
            <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: '16px', padding: '28px', animation: 'fadeUp .3s ease', alignSelf: 'flex-start', position: 'sticky', top: '20px' }}>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px', marginBottom: '20px', padding: 0 }}>← BACK</button>

              <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                {selected % 3 === 0 ? '🏫' : selected % 3 === 1 ? '🏟️' : '🏕️'}
              </div>

              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '1.5px', marginBottom: '20px', color: '#f1f5f9' }}>{filtered[selected].name}</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {[
                  { label: 'STATUS', value: 'Operational', color: '#22c55e' },
                  { label: 'CAPACITY', value: `${filtered[selected].capacity?.toLocaleString()} people`, color: '#38bdf8' },
                  { label: 'COORDINATES', value: `${filtered[selected].lat?.toFixed(5)}, ${filtered[selected].lng?.toFixed(5)}`, mono: true },
                  { label: 'TYPE', value: 'Emergency Shelter', color: '#e2e8f0' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#060c14', borderRadius: '8px', border: '1px solid #0f2035' }}>
                    <span style={{ fontSize: '11px', color: '#475569', fontFamily: "'DM Mono', monospace", letterSpacing: '1.5px' }}>{item.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: item.color || '#e2e8f0', fontFamily: item.mono ? "'DM Mono', monospace" : 'inherit', fontSize: item.mono ? '11px' : '14px' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href={`https://maps.google.com/?q=${filtered[selected].lat},${filtered[selected].lng}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', borderRadius: '10px', padding: '13px', fontSize: '13px', fontFamily: "'DM Mono', monospace", letterSpacing: '1.5px', textDecoration: 'none', fontWeight: '600' }}>
                  📍 GET DIRECTIONS
                </a>
                <a href="/sos" style={{ display: 'block', textAlign: 'center', background: '#dc2626', color: 'white', borderRadius: '10px', padding: '13px', fontSize: '13px', fontFamily: "'DM Mono', monospace", letterSpacing: '1.5px', textDecoration: 'none', fontWeight: '600' }}>
                  🆘 SOS EMERGENCY
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #0f2035', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155' }}>
          <span style={{ fontFamily: "'DM Mono', monospace" }}>SAHAAY CITIZEN PORTAL v2.0</span>
          <span>Emergency: <strong style={{ color: '#ef4444' }}>112</strong></span>
        </div>
      </div>
    </div>
  )
}