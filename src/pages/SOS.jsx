import { useState, useRef } from 'react'
import axios from 'axios'

const BASE = 'http://localhost:8000'

export default function SOS() {
  const [step, setStep]               = useState('form')   // form → holding → sent
  const [status, setStatus]           = useState('')
  const [pressing, setPressing]       = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [coords, setCoords]           = useState(null)
  const [sosId, setSosId]             = useState(null)
  const [files, setFiles]             = useState([])
  const [uploading, setUploading]     = useState(false)

  const [form, setForm] = useState({
    name:         '',
    people_count: 1,
    message:      ''
  })

  const holdTimer        = useRef(null)
  const progressInterval = useRef(null)
  const trackingInterval = useRef(null)

  // ── Hold logic ──────────────────────────────────
  const startHold = () => {
    if (step !== 'holding' && step !== 'form') return
    if (!form.name.trim()) { setStatus('no_name'); return }
    setStep('holding')
    setPressing(true)
    setHoldProgress(0)

    progressInterval.current = setInterval(() => {
      setHoldProgress(p => {
        if (p >= 100) { clearInterval(progressInterval.current); return 100 }
        return p + 3.33
      })
    }, 100)

    holdTimer.current = setTimeout(() => {
      clearInterval(progressInterval.current)
      setHoldProgress(100)
      triggerSOS()
    }, 3000)
  }

  const cancelHold = () => {
    setPressing(false)
    setHoldProgress(0)
    clearTimeout(holdTimer.current)
    clearInterval(progressInterval.current)
    if (step === 'holding') setStep('form')
  }

  // ── Send SOS ────────────────────────────────────
  const triggerSOS = () => {
    setPressing(false)
    setStatus('locating')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCoords({ lat: latitude, lng: longitude })

        try {
          const res = await axios.post(`${BASE}/sos`, {
            name:         form.name,
            location:     `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            latitude,
            longitude,
            people_count: form.people_count,
            message:      form.message || 'SOS from Citizen App'
          })

          const id = res.data.sos.id
          setSosId(id)

          // Upload media if any
          if (files.length > 0) {
            setUploading(true)
            const fd = new FormData()
            files.forEach(f => fd.append('files', f))
            await axios.post(`${BASE}/sos/${id}/media`, fd)
            setUploading(false)
          }

          // Start live GPS tracking
          trackingInterval.current = setInterval(() => {
            navigator.geolocation.getCurrentPosition(pos => {
              axios.put(`${BASE}/sos/${id}/location`, null, {
                params: { lat: pos.coords.latitude, lng: pos.coords.longitude }
              })
              setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            })
          }, 10000)

          setStep('sent')
          setStatus('success')

        } catch {
          setStatus('error')
          setStep('form')
        }
      },
      () => { setStatus('location_denied'); setStep('form') }
    )
  }

  const reset = () => {
    clearInterval(trackingInterval.current)
    setStep('form')
    setStatus('')
    setCoords(null)
    setSosId(null)
    setFiles([])
    setHoldProgress(0)
    setForm({ name: '', people_count: 1, message: '' })
  }

  const circumference = 2 * Math.PI * 104

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c14', color: '#e2e8f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-outer { 0%,100%{transform:scale(1);opacity:.3;}50%{transform:scale(1.15);opacity:.1;} }
        @keyframes pulse-mid   { 0%,100%{transform:scale(1);opacity:.4;}50%{transform:scale(1.1);opacity:.2;} }
        @keyframes shake { 0%,100%{transform:translateX(0);}25%{transform:translateX(-6px);}75%{transform:translateX(6px);} }
        @keyframes spin  { to { transform:rotate(360deg); } }
        @keyframes success-pop { 0%{transform:scale(.5);opacity:0;}70%{transform:scale(1.1);}100%{transform:scale(1);opacity:1;} }
        .sos-ring-outer { position:absolute;inset:-40px;border-radius:50%;background:rgba(220,38,38,.15);animation:pulse-outer 2s infinite; }
        .sos-ring-mid   { position:absolute;inset:-20px;border-radius:50%;background:rgba(220,38,38,.2);animation:pulse-mid 2s infinite; }
        input,textarea { background:#0a1628;border:1px solid #1e3a5f;border-radius:8px;color:#e2e8f0;padding:10px 14px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s; }
        input:focus,textarea:focus { border-color:#38bdf8; }
        input[type=number]::-webkit-inner-spin-button { opacity:1; }
        .nav-link { color:#64748b;text-decoration:none;font-size:13px;font-weight:500;letter-spacing:.5px;padding:6px 0;border-bottom:2px solid transparent;transition:all .2s; }
        .nav-link:hover { color:#e2e8f0;border-bottom-color:#38bdf8; }
        .nav-link.active { color:#e2e8f0;border-bottom-color:#ef4444; }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom:'1px solid #0f2035', padding:'0 24px' }}>
        <div style={{ maxWidth:'900px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:'60px' }}>
          <a href="/" style={{ display:'flex',alignItems:'center',gap:'10px',textDecoration:'none' }}>
            <div style={{ width:'32px',height:'32px',background:'linear-gradient(135deg,#0ea5e9,#0284c7)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px' }}>🛡️</div>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'20px',letterSpacing:'2px',color:'#e2e8f0' }}>SAHAAY</span>
          </a>
          <div style={{ display:'flex',gap:'28px' }}>
            <a href="/"        className="nav-link">DASHBOARD</a>
            <a href="/alerts"  className="nav-link">ALERTS</a>
            <a href="/shelters"className="nav-link">SHELTERS</a>
            <a href="/sos"     className="nav-link active">SOS</a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:'600px',margin:'0 auto',padding:'48px 24px',animation:'fadeUp .5s ease' }}>

        {/* Header */}
        <div style={{ textAlign:'center',marginBottom:'32px' }}>
          <div style={{ fontSize:'11px',color:'#ef4444',letterSpacing:'3px',fontFamily:"'DM Mono',monospace",marginBottom:'10px' }}>EMERGENCY SERVICES</div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'52px',letterSpacing:'3px',color:'#f1f5f9' }}>EMERGENCY SOS</h1>
          <p style={{ color:'#475569',marginTop:'10px',fontSize:'15px' }}>
            {step === 'sent' ? 'Help is on the way. Stay calm.' : 'Fill your details, then hold the button for 3 seconds.'}
          </p>
        </div>

        {/* ── FORM (shown until sent) ── */}
        {step !== 'sent' && (
          <div style={{ display:'flex',flexDirection:'column',gap:'14px',marginBottom:'36px' }}>

            {/* Name */}
            <div>
              <label style={{ fontSize:'12px',color:'#64748b',letterSpacing:'1px',fontFamily:"'DM Mono',monospace",display:'block',marginBottom:'6px' }}>YOUR NAME *</label>
              <input
                style={{ width:'100%' }}
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={e => { setForm(f=>({...f,name:e.target.value})); setStatus('') }}
              />
              {status === 'no_name' && <p style={{ color:'#ef4444',fontSize:'12px',marginTop:'4px' }}>⚠ Please enter your name before sending SOS</p>}
            </div>

            {/* People count */}
            <div>
              <label style={{ fontSize:'12px',color:'#64748b',letterSpacing:'1px',fontFamily:"'DM Mono',monospace",display:'block',marginBottom:'6px' }}>PEOPLE AFFECTED</label>
              <input
                type="number" min="1" max="999"
                style={{ width:'140px' }}
                value={form.people_count}
                onChange={e => setForm(f=>({...f,people_count:parseInt(e.target.value)||1}))}
              />
            </div>

            {/* Message */}
            <div>
              <label style={{ fontSize:'12px',color:'#64748b',letterSpacing:'1px',fontFamily:"'DM Mono',monospace",display:'block',marginBottom:'6px' }}>SITUATION (OPTIONAL)</label>
              <textarea
                rows={3} style={{ width:'100%',resize:'vertical' }}
                placeholder="Describe your situation briefly..."
                value={form.message}
                onChange={e => setForm(f=>({...f,message:e.target.value}))}
              />
            </div>

            {/* Media upload */}
            <div>
              <label style={{ fontSize:'12px',color:'#64748b',letterSpacing:'1px',fontFamily:"'DM Mono',monospace",display:'block',marginBottom:'6px' }}>PHOTOS / VIDEOS (OPTIONAL)</label>
              <input
                type="file" multiple accept="image/*,video/*"
                style={{ width:'100%',cursor:'pointer' }}
                onChange={e => setFiles(Array.from(e.target.files))}
              />
              {files.length > 0 && (
                <p style={{ color:'#38bdf8',fontSize:'12px',marginTop:'4px' }}>
                  📎 {files.length} file{files.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

          </div>
        )}

        {/* ── SOS BUTTON ── */}
        {step !== 'sent' && (
          <div style={{ textAlign:'center' }}>
            <div style={{ position:'relative',width:'220px',height:'220px',margin:'0 auto' }}>

              {!pressing && (
                <>
                  <div className="sos-ring-outer" />
                  <div className="sos-ring-mid" />
                </>
              )}

              <svg style={{ position:'absolute',inset:'-6px',width:'232px',height:'232px',transform:'rotate(-90deg)' }}>
                <circle cx="116" cy="116" r="104" fill="none" stroke="#0f2035" strokeWidth="4" />
                {pressing && (
                  <circle cx="116" cy="116" r="104" fill="none" stroke="#ef4444" strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - holdProgress / 100)}
                    style={{ transition:'stroke-dashoffset .1s linear' }}
                    strokeLinecap="round"
                  />
                )}
              </svg>

              <button
                onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold}
                onTouchStart={startHold} onTouchEnd={cancelHold}
                style={{
                  position:'absolute',inset:0,width:'100%',height:'100%',borderRadius:'50%',
                  backgroundColor: pressing ? '#7f1d1d' : '#1a0505',
                  border:`3px solid #ef4444`,
                  color:'#ef4444',
                  fontFamily:"'Bebas Neue',sans-serif",fontSize:'56px',letterSpacing:'4px',
                  cursor:'pointer',transition:'all .2s',
                  boxShadow: pressing
                    ? '0 0 50px rgba(220,38,38,.5),inset 0 0 30px rgba(220,38,38,.1)'
                    : '0 0 30px rgba(220,38,38,.2),inset 0 0 20px rgba(220,38,38,.05)',
                  display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'4px',
                  userSelect:'none',WebkitUserSelect:'none',
                  animation: status==='location_denied'||status==='error' ? 'shake .4s ease' : 'none'
                }}
              >
                {status === 'locating' ? (
                  <>
                    <div style={{ width:'28px',height:'28px',border:'3px solid #ef444440',borderTopColor:'#ef4444',borderRadius:'50%',animation:'spin .8s linear infinite' }} />
                    <span style={{ fontSize:'13px',letterSpacing:'2px',marginTop:'4px' }}>LOCATING</span>
                  </>
                ) : (
                  <>
                    <span>SOS</span>
                    {pressing && <span style={{ fontSize:'13px',letterSpacing:'1px',opacity:.8 }}>{Math.round(holdProgress)}%</span>}
                  </>
                )}
              </button>
            </div>

            <p style={{ color:'#334155',fontSize:'13px',fontFamily:"'DM Mono',monospace",letterSpacing:'1px',marginTop:'16px' }}>
              {pressing ? `HOLD... ${(3 - holdProgress * 0.03).toFixed(1)}s` : '— HOLD 3 SECONDS TO ACTIVATE —'}
            </p>
          </div>
        )}

        {/* ── SENT STATE ── */}
        {step === 'sent' && (
          <div style={{ textAlign:'center',animation:'fadeUp .4s ease' }}>

            {/* Big checkmark */}
            <div style={{ position:'relative',width:'220px',height:'220px',margin:'0 auto 32px' }}>
              <svg style={{ position:'absolute',inset:'-6px',width:'232px',height:'232px',transform:'rotate(-90deg)' }}>
                <circle cx="116" cy="116" r="104" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset="0" />
              </svg>
              <div style={{ position:'absolute',inset:0,borderRadius:'50%',backgroundColor:'#052e16',border:'3px solid #22c55e',color:'#22c55e',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'4px',animation:'success-pop .4s ease' }}>
                <span style={{ fontSize:'48px' }}>✓</span>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'20px',letterSpacing:'2px' }}>SENT</span>
              </div>
            </div>

            {/* Info card */}
            <div style={{ background:'rgba(34,197,94,.08)',border:'1px solid rgba(34,197,94,.3)',borderRadius:'12px',padding:'20px 24px',marginBottom:'16px',textAlign:'left' }}>
              <div style={{ color:'#22c55e',fontWeight:'700',fontSize:'16px',marginBottom:'12px' }}>✅ SOS Alert Transmitted</div>
              <div style={{ display:'flex',flexDirection:'column',gap:'6px',fontSize:'14px',color:'#94a3b8' }}>
                <span>👤 {form.name}</span>
                <span>👥 {form.people_count} {form.people_count === 1 ? 'person' : 'people'} affected</span>
                {coords && <span>📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} <span style={{ color:'#22c55e',fontSize:'12px' }}>● Live tracking active</span></span>}
                {uploading && <span>⏳ Uploading media...</span>}
                {files.length > 0 && !uploading && <span>📎 {files.length} file{files.length > 1 ? 's' : ''} uploaded</span>}
              </div>
            </div>

            <p style={{ color:'#475569',fontSize:'13px',marginBottom:'24px' }}>
              Your location is being tracked and sent to rescue teams every 10 seconds.
            </p>

            <button onClick={reset} style={{ background:'none',border:'1px solid #1e3a5f',color:'#64748b',padding:'10px 28px',borderRadius:'8px',cursor:'pointer',fontSize:'14px' }}>
              Send Another SOS
            </button>
          </div>
        )}

        {/* Error messages */}
        {(status === 'error' || status === 'location_denied') && (
          <div style={{ background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.3)',borderRadius:'12px',padding:'16px 20px',marginTop:'16px',animation:'fadeUp .3s ease' }}>
            <div style={{ color:'#ef4444',fontWeight:'700',fontSize:'15px' }}>
              {status === 'location_denied' ? '📍 Location Access Denied' : '❌ Transmission Failed'}
            </div>
            <div style={{ color:'#64748b',fontSize:'14px',marginTop:'6px' }}>
              {status === 'location_denied'
                ? 'Please enable location permissions in your browser and try again.'
                : 'Could not reach the server. Check your connection and retry.'}
            </div>
          </div>
        )}

        {/* Emergency contacts */}
        <div style={{ marginTop:'48px',borderTop:'1px solid #0f2035',paddingTop:'28px' }}>
          <div style={{ fontSize:'11px',color:'#475569',letterSpacing:'2px',fontFamily:"'DM Mono',monospace",marginBottom:'16px',textAlign:'center' }}>EMERGENCY CONTACTS</div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px' }}>
            {[
              { label:'National Emergency', number:'112' },
              { label:'NDMA Helpline',      number:'1078' },
              { label:'Disaster Mgmt',      number:'1070' },
            ].map(c => (
              <a key={c.number} href={`tel:${c.number}`} style={{ textDecoration:'none',background:'#0a1628',border:'1px solid #0f2035',borderRadius:'10px',padding:'14px 12px',transition:'border-color .2s',display:'block',textAlign:'center' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#ef4444'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='#0f2035'}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',color:'#ef4444',letterSpacing:'2px' }}>{c.number}</div>
                <div style={{ fontSize:'11px',color:'#475569',marginTop:'4px',letterSpacing:'.5px' }}>{c.label}</div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}