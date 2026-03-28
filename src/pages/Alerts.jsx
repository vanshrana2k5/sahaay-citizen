import { useEffect, useState } from 'react'
import axios from 'axios'

const severityConfig = {
  High:   { color: '#ef4444', bg: 'rgba(239,68,68,.06)', border: 'rgba(239,68,68,.2)', glow: 'rgba(239,68,68,.15)', tag: '#ef4444', icon: '🔴', pulse: true },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,.06)', border: 'rgba(245,158,11,.2)', glow: 'rgba(245,158,11,.1)', tag: '#f59e0b', icon: '🟡', pulse: false },
  Low:    { color: '#22c55e', bg: 'rgba(34,197,94,.06)',  border: 'rgba(34,197,94,.2)',  glow: 'rgba(34,197,94,.1)',  tag: '#22c55e', icon: '🟢', pulse: false },
}

const FILTERS = ['All', 'High', 'Medium', 'Low']

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const fetchAlerts = () => {
      axios.get('http://localhost:8000/alerts')
        .then(res => { setAlerts(res.data); setLoading(false) })
        .catch(() => setLoading(false))
    }

  fetchAlerts()
  const interval = setInterval(fetchAlerts, 5000)
  return () => clearInterval(interval)
  }, [])

  const filtered = filter === 'All' ? alerts : alerts.filter(a => a.severity === filter)
  const counts = { High: 0, Medium: 0, Low: 0 }
  alerts.forEach(a => { if (counts[a.severity] !== undefined) counts[a.severity]++ })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c14', color: '#e2e8f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:.3; } }
        @keyframes spin { to { transform:rotate(360deg); } }

        .nav-link { color: #64748b; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: .5px; padding: 6px 0; border-bottom: 2px solid transparent; transition: all .2s; }
        .nav-link:hover { color: #e2e8f0; border-bottom-color: #38bdf8; }
        .nav-link.active { color: #e2e8f0; border-bottom-color: #38bdf8; }

        .filter-btn { background: none; border: 1px solid #0f2035; color: #64748b; padding: 7px 16px; border-radius: 6px; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 1.5px; transition: all .2s; }
        .filter-btn:hover { border-color: #1e3a5f; color: #94a3b8; }
        .filter-btn.active { border-color: #38bdf8; color: #38bdf8; background: rgba(56,189,248,.06); }

        .alert-card { background: #0a1628; border: 1px solid #0f2035; border-radius: 14px; padding: 20px 24px; cursor: pointer; transition: all .2s; }
        .alert-card:hover { border-color: #1e3a5f; transform: translateY(-1px); }
        .alert-card.high { border-color: rgba(239,68,68,.2); }
        .alert-card.high:hover { border-color: rgba(239,68,68,.4); box-shadow: 0 4px 24px rgba(239,68,68,.1); }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #0f2035', padding: '0 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🛡️</div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '2px', color: '#e2e8f0' }}>SAHAAY</span>
          </a>
          <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            <a href="/" className="nav-link">DASHBOARD</a>
            <a href="/alerts" className="nav-link active">ALERTS</a>
            <a href="/shelters" className="nav-link">SHELTERS</a>
            <a href="/sos" style={{ background: '#dc2626', color: 'white', padding: '7px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif" }}>SOS</a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px', animation: 'fadeUp .5s ease' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#38bdf8', letterSpacing: '3px', fontFamily: "'DM Mono', monospace", marginBottom: '8px' }}>EMERGENCY BROADCAST</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', letterSpacing: '2px', lineHeight: 1 }}>ACTIVE ALERTS</h1>
            <p style={{ color: '#475569', marginTop: '8px', fontSize: '15px' }}>Official alerts from emergency coordinators</p>
          </div>

          {/* Live indicator */}
          {!loading && alerts.length > 0 && (
            <div style={{ background: '#0a1628', border: '1px solid #0f2035', borderRadius: '10px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: counts.High > 0 ? '#ef4444' : '#22c55e', boxShadow: `0 0 6px ${counts.High > 0 ? '#ef4444' : '#22c55e'}`, animation: 'blink 1.5s infinite' }} />
              <div>
                <div style={{ fontSize: '11px', color: '#475569', fontFamily: "'DM Mono', monospace", letterSpacing: '1px' }}>LIVE FEED</div>
                <div style={{ fontWeight: '700', fontSize: '18px', color: '#e2e8f0' }}>{alerts.length} <span style={{ fontSize: '13px', fontWeight: '400', color: '#64748b' }}>active</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Summary cards */}
        {!loading && alerts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '28px', animation: 'fadeUp .5s .1s ease both' }}>
            {['High', 'Medium', 'Low'].map(s => {
              const cfg = severityConfig[s]
              return (
                <button key={s} onClick={() => setFilter(filter === s ? 'All' : s)} style={{ background: filter === s ? cfg.bg : '#0a1628', border: `1px solid ${filter === s ? cfg.border : '#0f2035'}`, borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', textAlign: 'left', transition: 'all .2s', display: 'block' }}>
                  <div style={{ fontSize: '11px', color: cfg.color, fontFamily: "'DM Mono', monospace", letterSpacing: '1.5px', marginBottom: '6px' }}>{s.toUpperCase()}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: filter === s ? cfg.color : '#e2e8f0', letterSpacing: '2px' }}>{counts[s]}</div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>alerts</div>
                </button>
              )
            })}
          </div>
        )}

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', animation: 'fadeUp .5s .15s ease both' }}>
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.toUpperCase()}
              {f !== 'All' && <span style={{ marginLeft: '6px', opacity: .7 }}>({counts[f] || 0})</span>}
            </button>
          ))}
        </div>

        {/* Alerts list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeUp .5s ease' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'linear-gradient(90deg, #0a1628 25%, #0f2035 50%, #0a1628 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '14px', height: '90px' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: '#0a1628', border: '1px solid #0f2035', borderRadius: '16px', padding: '60px 40px', textAlign: 'center', animation: 'fadeUp .4s ease' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#22c55e', letterSpacing: '2px', marginBottom: '8px' }}>ALL CLEAR</div>
            <div style={{ color: '#475569', fontSize: '15px' }}>No {filter !== 'All' ? filter.toLowerCase() + ' severity ' : ''}alerts at this time.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((alert, i) => {
              const cfg = severityConfig[alert.severity] || severityConfig.Low
              const isOpen = expanded === i
              return (
                <div key={i}
                  className={`alert-card ${alert.severity === 'High' ? 'high' : ''}`}
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: '14px',
                    padding: '20px 24px',
                    cursor: 'pointer',
                    transition: 'all .2s',
                    animation: `fadeUp .4s ${i * 0.05}s ease both`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>

                  {/* Glow for high severity */}
                  {alert.severity === 'High' && (
                    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: cfg.glow, borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        {/* Severity badge */}
                        <span style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1.5px', fontFamily: "'DM Mono', monospace", display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {alert.severity === 'High' && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.color, display: 'inline-block', animation: 'blink 1s infinite' }} />}
                          {alert.severity?.toUpperCase() || 'INFO'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#334155', fontFamily: "'DM Mono', monospace" }}>{alert.timestamp}</span>
                      </div>

                      <div style={{ fontWeight: '700', fontSize: '17px', color: '#f1f5f9', marginBottom: '6px' }}>{alert.zone}</div>
                      <div style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>{alert.message}</div>
                    </div>

                    <div style={{ color: '#334155', fontSize: '16px', flexShrink: 0, marginTop: '4px', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</div>
                  </div>

                  {/* Expanded content */}
                  {isOpen && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${cfg.border}`, animation: 'fadeUp .2s ease' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ background: 'rgba(0,0,0,.2)', borderRadius: '8px', padding: '12px 14px' }}>
                          <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '1.5px', fontFamily: "'DM Mono', monospace", marginBottom: '4px' }}>AFFECTED ZONE</div>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{alert.zone}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,.2)', borderRadius: '8px', padding: '12px 14px' }}>
                          <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '1.5px', fontFamily: "'DM Mono', monospace", marginBottom: '4px' }}>ISSUED AT</div>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{alert.timestamp}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <a href="/shelters" style={{ flex: 1, textAlign: 'center', background: 'rgba(0,0,0,.2)', border: `1px solid ${cfg.border}`, color: cfg.color, borderRadius: '8px', padding: '10px', fontSize: '12px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px', textDecoration: 'none', transition: 'all .2s' }}>FIND SHELTER →</a>
                        <a href="/sos" style={{ flex: 1, textAlign: 'center', background: '#dc2626', color: 'white', borderRadius: '8px', padding: '10px', fontSize: '12px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px', textDecoration: 'none' }}>EMERGENCY SOS</a>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: '1px solid #0f2035', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155' }}>
          <span style={{ fontFamily: "'DM Mono', monospace" }}>SAHAAY CITIZEN PORTAL v2.0</span>
          <span>Emergency: <strong style={{ color: '#ef4444' }}>112</strong></span>
        </div>
      </div>

      <style>{`@keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }`}</style>
    </div>
  )
}