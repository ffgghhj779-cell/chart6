import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppSMC from './AppSMC.jsx'

const Main = () => {
  const [showSMC, setShowSMC] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowSMC(!showSMC)}
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 9999,
          padding: '8px 16px',
          backgroundColor: '#D4AF37',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}
      >
        {showSMC ? 'عرض التصميم القديم' : 'عرض تصميم SMC الجديد'}
      </button>
      {showSMC ? <AppSMC /> : <App />}
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
