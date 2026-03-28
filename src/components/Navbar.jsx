import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const links = [
    { path: '/home', label: '🌍 Home' },
    { path: '/sos', label: '🆘 SOS' },
    { path: '/alerts', label: '📢 Alerts' },
    { path: '/shelters', label: '🏠 Shelters' },
  ]

  return (
    <nav style={{
      backgroundColor: '#0d1b2a',
      borderBottom: '2px solid #1e3a5f',
      padding: '0 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🛡️</span>
        <span style={{ fontWeight: '900', fontSize: '20px', color: '#4fc3f7', letterSpacing: '2px' }}>
          SAHAAY
        </span>
        <span style={{ fontSize: '11px', color: '#546e7a', marginLeft: '4px', letterSpacing: '1px' }}>
          CITIZEN APP
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: location.pathname === link.path ? '#1e3a5f' : 'transparent',
              color: location.pathname === link.path ? '#4fc3f7' : '#90a4ae',
              border: location.pathname === link.path ? '1px solid #4fc3f7' : '1px solid transparent',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar