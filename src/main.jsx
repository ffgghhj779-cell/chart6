import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppSMC from './AppSMC.jsx'
import AppTV from './AppTV.jsx'

const Main = () => {
  const [view, setView] = useState('classic'); // 'classic', 'smc', 'tv'

  const btnBase = {
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    padding: '7px 12px',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      {/* Mobile-first fixed nav bar at bottom of screen */}
      <div
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          background: 'rgba(5,16,36,0.97)',
          padding: '10px 12px',
          borderTop: '1px solid rgba(212,175,55,0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <button
          onClick={() => setView('classic')}
          style={{
            ...btnBase,
            backgroundColor: view === 'classic' ? '#D4AF37' : 'rgba(255,255,255,0.08)',
            color: view === 'classic' ? '#000' : '#ccc',
            flex: 1,
            maxWidth: '130px',
          }}
        >
          الكلاسيكي
        </button>
        <button
          onClick={() => setView('smc')}
          style={{
            ...btnBase,
            backgroundColor: view === 'smc' ? '#D4AF37' : 'rgba(255,255,255,0.08)',
            color: view === 'smc' ? '#000' : '#ccc',
            flex: 1,
            maxWidth: '130px',
          }}
        >
          شارت SMC
        </button>
        <button
          onClick={() => setView('tv')}
          style={{
            ...btnBase,
            backgroundColor: view === 'tv' ? '#D4AF37' : 'rgba(255,255,255,0.08)',
            color: view === 'tv' ? '#000' : '#ccc',
            flex: 1,
            maxWidth: '130px',
          }}
        >
          البث التلفزيوني
        </button>
      </div>

      {/* Content — add bottom padding so nav bar doesn't overlap */}
      <div style={{ paddingBottom: '60px' }}>
        {view === 'classic' && <App />}
        {view === 'smc' && <AppSMC />}
        {view === 'tv' && <AppTV />}
      </div>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
