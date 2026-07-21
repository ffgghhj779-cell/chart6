import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppSMC from './AppSMC.jsx'
import AppTV from './AppTV.jsx'

const Main = () => {
  const [view, setView] = useState('classic'); // 'classic', 'smc', 'tv'

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 9999,
          display: 'flex',
          gap: '8px',
          background: 'rgba(0,0,0,0.7)',
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        <button 
          onClick={() => setView('classic')}
          style={{
            padding: '8px 16px', backgroundColor: view === 'classic' ? '#D4AF37' : '#333', color: view === 'classic' ? 'black' : 'white',
            border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          الشكل الكلاسيكي
        </button>
        <button 
          onClick={() => setView('smc')}
          style={{
            padding: '8px 16px', backgroundColor: view === 'smc' ? '#D4AF37' : '#333', color: view === 'smc' ? 'black' : 'white',
            border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          شارت SMC
        </button>
        <button 
          onClick={() => setView('tv')}
          style={{
            padding: '8px 16px', backgroundColor: view === 'tv' ? '#D4AF37' : '#333', color: view === 'tv' ? 'black' : 'white',
            border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          البث التلفزيوني
        </button>
      </div>

      {view === 'classic' && <App />}
      {view === 'smc' && <AppSMC />}
      {view === 'tv' && <AppTV />}
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
