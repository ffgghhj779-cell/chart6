import React from 'react';

const GoldenBadge = ({ className = "", size = "lg" }) => {
  const sizeClasses = {
    sm: "w-16 h-16 text-xs",
    lg: "w-24 h-24 text-sm"
  };

  return (
    <div className={`relative rounded-full bg-gradient-to-br from-yellow-300 via-yellow-600 to-yellow-800 p-1 shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-1 rounded-full bg-[#0a0a0a] border border-yellow-500/50 flex flex-col items-center justify-center">
        <span className="text-yellow-500 font-serif italic leading-none mb-1">Gold</span>
        <span className="text-yellow-400 font-bold text-2xl leading-none shadow-black drop-shadow-md">2</span>
        <span className="text-yellow-600 font-serif italic leading-none mt-1 text-[10px]">Today</span>
      </div>
      {/* Decorative ribbon at bottom of badge */}
      <div className="absolute -bottom-2 w-3/4 h-4 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 rounded-sm z-10 clip-diagonal-bl" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)'}}></div>
    </div>
  );
};

const ChartMockup = () => {
  return (
    <div className="relative w-full h-full bg-white font-sans text-gray-800 overflow-hidden select-none">
      {/* Top toolbar mockup */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-gray-200 flex items-center px-2 text-[10px] text-gray-500 gap-2 rtl:flex-row-reverse">
        <span>TradingView.com 05:28 2026 ,17 يوليو UTC+1</span>
        <span>الذهب / دولار أمريكي · 1 سا · OANDA</span>
        <span className="text-red-500">O 3,991.415 H 3,991.765 L 3,985.240 C 3,986.675 -4.760 (-0.12%)</span>
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 top-8 bottom-6 right-16 border-r border-gray-200 flex flex-col justify-between">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-full border-b border-gray-100 h-full"></div>
        ))}
      </div>

      {/* Y Axis Labels */}
      <div className="absolute top-8 bottom-6 right-0 w-16 bg-white flex flex-col justify-between text-[10px] text-gray-500 items-start pl-1 py-4 z-10 border-l border-gray-200">
        <span>4,275.0</span>
        <span>4,235.0</span>
        <span>4,195.0</span>
        <span>4,155.0</span>
        <span>4,115.0</span>
        <span>4,075.0</span>
        <span>4,045.0</span>
        <span>4,025.0</span>
        <span>4,005.0</span>
        <span className="bg-red-500 text-white px-1">3,986.6</span>
        <span>3,965.0</span>
        <span>3,945.0</span>
        <span>3,925.0</span>
      </div>

      {/* Chart SVG */}
      <div className="absolute inset-0 top-8 bottom-6 right-16 left-0">
        <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="none">
          {/* Trend lines */}
          <line x1="200" y1="50" x2="700" y2="250" stroke="#8b5cf6" strokeWidth="2" /> {/* Purple descending */}
          <line x1="150" y1="350" x2="750" y2="150" stroke="#ef4444" strokeWidth="2" /> {/* Red ascending */}
          
          {/* Support / Resistance Horizontal Lines */}
          <line x1="0" y1="200" x2="800" y2="200" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="0" y1="280" x2="800" y2="280" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="0" y1="340" x2="800" y2="340" stroke="#8b5cf6" strokeWidth="1.5" />
          <line x1="0" y1="360" x2="800" y2="360" stroke="#8b5cf6" strokeWidth="1.5" />

          {/* Elliot Waves (Black zigzags) */}
          <polyline points="200,50 300,180 350,110 400,280 450,150 550,330 650,220" fill="none" stroke="#000" strokeWidth="2" />

          {/* Demand zone box at bottom */}
          <rect x="520" y="325" width="80" height="20" fill="#f3e8ff" stroke="#8b5cf6" strokeWidth="1.5" />
          {/* Blue arrow up from demand zone */}
          <path d="M 560 320 L 550 280 L 570 280 Z" fill="#3b82f6" />
          <line x1="560" y1="320" x2="560" y2="280" stroke="#3b82f6" strokeWidth="2" />

          {/* Another blue arrow earlier */}
          <path d="M 140 100 L 130 140 L 150 140 Z" fill="#3b82f6" />
          <line x1="140" y1="100" x2="140" y2="160" stroke="#3b82f6" strokeWidth="2" />
          
          <path d="M 680 180 L 670 210 L 690 210 Z" fill="#3b82f6" />
          <line x1="680" y1="180" x2="680" y2="220" stroke="#3b82f6" strokeWidth="2" />

          {/* Dummy Candlesticks (Group 1 - up to 200,50) */}
          <rect x="80" y="250" width="4" height="60" fill="#ef4444" />
          <rect x="78" y="270" width="8" height="30" fill="#ef4444" />
          
          <rect x="100" y="150" width="4" height="110" fill="#22c55e" />
          <rect x="98" y="170" width="8" height="70" fill="#22c55e" />

          <rect x="120" y="120" width="4" height="50" fill="#22c55e" />
          <rect x="118" y="130" width="8" height="30" fill="#22c55e" />

          <rect x="140" y="60" width="4" height="80" fill="#22c55e" />
          <rect x="138" y="70" width="8" height="50" fill="#22c55e" />
          
          {/* Dummy Candlesticks (Group 2 - down) */}
          <rect x="250" y="90" width="4" height="70" fill="#ef4444" />
          <rect x="248" y="100" width="8" height="40" fill="#ef4444" />

          <rect x="280" y="140" width="4" height="90" fill="#ef4444" />
          <rect x="278" y="160" width="8" height="50" fill="#ef4444" />

          <rect x="350" y="120" width="4" height="80" fill="#22c55e" />
          <rect x="348" y="140" width="8" height="40" fill="#22c55e" />

          <rect x="400" y="190" width="4" height="90" fill="#ef4444" />
          <rect x="398" y="210" width="8" height="50" fill="#ef4444" />

          <rect x="450" y="160" width="4" height="70" fill="#22c55e" />
          <rect x="448" y="170" width="8" height="40" fill="#22c55e" />
          
          <rect x="550" y="260" width="4" height="70" fill="#ef4444" />
          <rect x="548" y="270" width="8" height="40" fill="#ef4444" />
        </svg>

        {/* Price callout boxes */}
        <div className="absolute left-[30%] top-[25%] bg-white border border-blue-500 text-blue-700 text-[10px] px-1 py-0.5 rounded-sm z-20 font-bold -translate-x-1/2 -translate-y-1/2">
          4,180.520
        </div>
        <div className="absolute left-[45%] top-[30%] bg-white border border-blue-500 text-blue-700 text-[10px] px-1 py-0.5 rounded-sm z-20 font-bold -translate-x-1/2 -translate-y-1/2">
          4,138.035
        </div>
        <div className="absolute left-[58%] top-[38%] bg-white border border-blue-500 text-blue-700 text-[10px] px-1 py-0.5 rounded-sm z-20 font-bold -translate-x-1/2 -translate-y-1/2">
          4,104.050
        </div>
        <div className="absolute left-[66%] top-[45%] bg-white border border-blue-500 text-blue-700 text-[10px] px-1 py-0.5 rounded-sm z-20 font-bold -translate-x-1/2 -translate-y-1/2">
          4,081.520
        </div>
        <div className="absolute left-[40%] top-[65%] bg-white border border-blue-500 text-blue-700 text-[10px] px-1 py-0.5 rounded-sm z-20 font-bold -translate-x-1/2 -translate-y-1/2">
          4,021.815
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#051024] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background World Map / Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
      
      {/* Subtle radial gradient to center focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Main Graphic Container */}
      <div className="relative w-full max-w-4xl bg-[#051024] rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden flex flex-col z-10 aspect-[4/5] md:aspect-auto md:min-h-[850px]">
        
        {/* Decorative corner cuts */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37] to-yellow-600 clip-diagonal-tr opacity-90 z-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#D4AF37] to-yellow-600 clip-diagonal-bl opacity-90 z-20"></div>

        {/* Top Header Section */}
        <header className="w-full flex items-center justify-between p-6 md:p-8 z-30">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-md tracking-tight">
              سعر الذهب اليوم
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-[#FADB5F] drop-shadow-sm">
              أخبار الذهب والأسواق العالمية
            </h2>
          </div>
          <div className="flex-shrink-0">
            <GoldenBadge size="lg" />
          </div>
        </header>

        {/* Center Chart Section */}
        <main className="flex-1 w-full px-6 md:px-12 relative z-20 flex flex-col items-center justify-center mb-8">
          <div className="relative w-full aspect-[16/9] md:h-[450px] bg-white border-[5px] border-black shadow-2xl rounded-sm">
            
            {/* Chart inside */}
            <ChartMockup />

            {/* Overlapping badge at bottom center */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-30">
              <GoldenBadge size="sm" />
            </div>
          </div>
        </main>

        {/* Bottom Section */}
        <footer className="w-full relative z-30 pb-8 pt-4 flex flex-col items-center mt-auto">
          
          {/* Breaking News Ribbon (Starts from Right edge) */}
          <div className="absolute right-0 top-0 h-12 w-64 bg-gradient-to-r from-[#FADB5F] to-[#D4AF37] text-black font-black text-2xl flex items-center justify-end px-6 shadow-lg rounded-l-md z-40 clip-ribbon-left group">
            {/* 3 Diagonal Stripes */}
            <div className="absolute left-2 top-0 bottom-0 w-12 flex space-x-1.5 space-x-reverse skew-x-[30deg]">
              <div className="w-2 h-full bg-black/80"></div>
              <div className="w-2 h-full bg-black/80"></div>
              <div className="w-2 h-full bg-black/80"></div>
            </div>
            <span className="relative z-10 ml-12">خبر عاجل</span>
          </div>

          <div className="w-full text-center mt-20 px-4">
            {/* Main Headline */}
            <h3 className="text-3xl md:text-5xl font-black leading-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="text-white">فرصة شراء للذهب بين </span>
              <span className="text-[#FADB5F]">3981 و 4030</span>
            </h3>
            
            {/* Subtext */}
            <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              دولار وسط مؤشرات فنية داعمة للصعود
            </p>
          </div>

          {/* Footer Logo text */}
          <div className="absolute bottom-4 right-6 text-white font-black text-xl tracking-wider opacity-90 drop-shadow-md">
            GOLD2TODAY
          </div>
        </footer>
        
      </div>
    </div>
  );
}

export default App;
