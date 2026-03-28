import { useEffect, useState } from 'react'
import axios from 'axios'

const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bengaluru', 'Hyderabad', 'Pune', 'Ahmedabad']

const riskConfig = {
  LOW:    { color: '#22c55e', glow: '#22c55e40', bg: 'linear-gradient(135deg, #052e1620, #022c1640)', border: '#22c55e30', label: 'Low Risk', icon: '▲', desc: 'Conditions are stable. Stay alert.' },
  MEDIUM: { color: '#f59e0b', glow: '#f59e0b40', bg: 'linear-gradient(135deg, #2d1f0020, #2a1a0040)', border: '#f59e0b30', label: 'Medium Risk', icon: '◆', desc: 'Exercise caution. Follow advisories.' },
  HIGH:   { color: '#ef4444', glow: '#ef444440', bg: 'linear-gradient(135deg, #2d000020, #2a000040)', border: '#ef444430', label: 'High Risk', icon: '⬛', desc: 'Immediate attention required.' },
}

export default function Home() {
  const [risk, setRisk] = useState(null)
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('Delhi')
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:8000/predict/${city}`)
      .then(res => { setRisk(res.data.risk); setWeather(res.data.weather); setLoading(false) })
      .catch(() => setLoading(false))
  }, [city])

  const cfg = risk ? riskConfig[risk.risk_level] : null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c14', color: '#e2e8f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060c14; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-ring { 0%,100% { transform:scale(1); opacity:.6; } 50% { transform:scale(1.08); opacity:.9; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }

        .city-btn { background: none; border: none; color: #94a3b8; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; transition: all .2s; white-space: nowrap; }
        .city-btn:hover, .city-btn.active { background: #0f2035; color: #e2e8f0; }
        .city-btn.active { color: #38bdf8; }

        .weather-cell { background: #0a1628; border: 1px solid #0f2035; border-radius: 12px; padding: 16px 20px; transition: border-color .2s; }
        .weather-cell:hover { border-color: #1e3a5f; }

        .nav-link { color: #64748b; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: .5px; padding: 6px 0; border-bottom: 2px solid transparent; transition: all .2s; }
        .nav-link:hover, .nav-link.active { color: #e2e8f0; border-bottom-color: #38bdf8; }

        .sos-btn { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; border: none; padding: 14px 32px; border-radius: 10px; font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 3px; cursor: pointer; transition: all .2s; box-shadow: 0 4px 20px #dc262640; }
        .sos-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px #dc262660; }

        .skeleton { background: linear-gradient(90deg, #0a1628 25%, #0f2035 50%, #0a1628 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
      `}</style>

      {/* Top ticker */}
      <div style={{ background: '#0a1628', borderBottom: '1px solid #0f2035', padding: '8px 0', overflow: 'hidden' }}>
        <div style={{ animation: 'ticker 25s linear infinite', whiteSpace: 'nowrap', fontSize: '12px', color: '#64748b', letterSpacing: '.5px', fontFamily: "'DM Mono', monospace" }}>
          &nbsp;&nbsp;&nbsp;&nbsp;⚡ SAHAAY CITIZEN PORTAL &nbsp;•&nbsp; REAL-TIME DISASTER RISK MONITORING &nbsp;•&nbsp; GOVERNMENT OF INDIA INITIATIVE &nbsp;•&nbsp; EMERGENCY HELPLINE: 112 &nbsp;•&nbsp; NDMA ALERT SYSTEM ACTIVE &nbsp;•&nbsp; STAY INFORMED • STAY SAFE &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>



      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px', animation: 'fadeUp .5s ease' }}>
          <div style={{ fontSize: '11px', color: '#38bdf8', letterSpacing: '3px', fontFamily: "'DM Mono', monospace", marginBottom: '8px' }}>REAL-TIME MONITORING</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', letterSpacing: '2px', lineHeight: 1, color: '#f1f5f9' }}>DISASTER RISK MONITOR</h1>
          <p style={{ color: '#475569', marginTop: '10px', fontSize: '15px' }}>Live risk assessment and weather intelligence for your area</p>
        </div>

        {/* City selector */}
        <div style={{ marginBottom: '28px', animation: 'fadeUp .5s .1s ease both' }}>
          <div style={{ fontSize: '11px', color: '#475569', letterSpacing: '2px', fontFamily: "'DM Mono', monospace", marginBottom: '10px' }}>SELECT CITY</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', background: '#0a1628', border: '1px solid #0f2035', borderRadius: '12px', padding: '8px' }}>
            {CITIES.map(c => (
              <button key={c} className={`city-btn ${city === c ? 'active' : ''}`} onClick={() => setCity(c)}>{c}</button>
            ))}
          </div>
        </div>

        {/* Risk display */}
        <div style={{ animation: 'fadeUp .5s .2s ease both', marginBottom: '20px' }}>
          {loading ? (
            <div style={{ background: '#0a1628', border: '1px solid #0f2035', borderRadius: '16px', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid #0f2035', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
              <span style={{ color: '#475569', fontSize: '14px', fontFamily: "'DM Mono', monospace" }}>FETCHING RISK DATA...</span>
            </div>
          ) : risk && cfg ? (
            <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '16px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
              {/* Glow effect */}
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: cfg.glow, borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', position: 'relative' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ animation: 'pulse-ring 2s infinite' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
                    </div>
                    <span style={{ fontSize: '11px', color: cfg.color, letterSpacing: '3px', fontFamily: "'DM Mono', monospace" }}>LIVE ASSESSMENT</span>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', color: cfg.color, lineHeight: 1, letterSpacing: '2px' }}>{risk.risk_level}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#94a3b8', letterSpacing: '3px' }}>RISK LEVEL</div>
                  <div style={{ color: '#64748b', fontSize: '14px', marginTop: '10px' }}>{city} • {cfg.desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#475569', letterSpacing: '2px', fontFamily: "'DM Mono', monospace", marginBottom: '8px' }}>RISK FACTORS</div>
                  {risk.reasons?.map((r, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color, display: 'inline-block', flexShrink: 0 }} />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#0a1628', border: '1px solid #ef444430', borderRadius: '16px', padding: '36px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
              <div style={{ color: '#ef4444', fontSize: '15px' }}>Could not fetch data. Is the backend running?</div>
            </div>
          )}
        </div>

        {/* Weather grid */}
        {weather && !loading && (
          <div style={{ animation: 'fadeUp .5s .3s ease both', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#475569', letterSpacing: '2px', fontFamily: "'DM Mono', monospace", marginBottom: '12px' }}>WEATHER CONDITIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { label: 'TEMPERATURE', value: `${weather.temperature}°C`, icon: '🌡️' },
                { label: 'HUMIDITY', value: `${weather.humidity}%`, icon: '💧' },
                { label: 'WIND SPEED', value: `${weather.wind_speed} m/s`, icon: '💨' },
                { label: 'CONDITIONS', value: weather.description, icon: '🌤️' },
              ].map(item => (
                <div key={item.label} className="weather-cell">
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{ fontSize: '11px', color: '#475569', letterSpacing: '1.5px', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>{item.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#e2e8f0', textTransform: 'capitalize' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div style={{ animation: 'fadeUp .5s .4s ease both', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
          <a href="/alerts" style={{ textDecoration: 'none', background: '#0a1628', border: '1px solid #0f2035', borderRadius: '12px', padding: '20px', transition: 'border-color .2s', display: 'block' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#38bdf8'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#0f2035'}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📢</div>
            <div style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '14px' }}>Active Alerts</div>
            <div style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>Official emergency broadcasts</div>
          </a>
          <a href="/shelters" style={{ textDecoration: 'none', background: '#0a1628', border: '1px solid #0f2035', borderRadius: '12px', padding: '20px', transition: 'border-color .2s', display: 'block' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#38bdf8'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#0f2035'}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏠</div>
            <div style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '14px' }}>Find Shelters</div>
            <div style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>Nearest emergency shelters</div>
          </a>
          <div style={{ background: 'linear-gradient(135deg, #1a0505, #200808)', border: '1px solid #ef444420', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🆘</div>
              <div style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '14px' }}>Emergency SOS</div>
              <div style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>Alert rescue teams instantly</div>
            </div>
            <a href="/sos" className="sos-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '12px', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: 'white', padding: '10px', borderRadius: '8px', fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '2px', boxShadow: '0 4px 16px #dc262640' }}>SEND SOS</a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #0f2035', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#334155' }}>
          <span style={{ fontFamily: "'DM Mono', monospace" }}>SAHAAY CITIZEN PORTAL v2.0</span>
          <span>Emergency: <strong style={{ color: '#ef4444' }}>112</strong> &nbsp;•&nbsp; NDMA: <strong style={{ color: '#ef4444' }}>1078</strong></span>
        </div>
      </div>
    </div>
  )
}