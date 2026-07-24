import React, { useState } from 'react';
import TradingChart from './TradingChart';

const GoldenBadge = ({ className = "", size = "lg" }) => {
  const sizeClasses = {
    sm: "w-16 h-16 text-xs",
    lg: "w-20 h-20 text-sm md:w-24 md:h-24"
  };

  return (
    <div className={`relative rounded-full bg-gradient-to-br from-yellow-300 via-yellow-600 to-yellow-800 p-1 shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-1 rounded-full bg-[#0a0a0a] border border-yellow-500/50 flex flex-col items-center justify-center">
        <span className="text-yellow-500 font-serif italic leading-none mb-1">Gold</span>
        <span className="text-yellow-400 font-bold text-2xl leading-none shadow-black drop-shadow-md">2</span>
        <span className="text-yellow-600 font-serif italic leading-none mt-1 text-[10px]">Today</span>
      </div>
      <div className="absolute -bottom-2 w-3/4 h-4 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 rounded-sm z-10" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)'}}></div>
    </div>
  );
};

function App() {
  const [chartData, setChartData] = useState({
    currentPrice: null,
    support: null,
    resistance: null,
    demandZone: null
  });

  const handleDataProcessed = (data) => {
    setChartData(data);
  };

  const isDataReady = chartData.currentPrice !== null;
  const buyTarget1 = isDataReady ? Math.floor(chartData.demandZone) : "---";
  const buyTarget2 = isDataReady ? Math.ceil(chartData.support) : "---";

  return (
    <div className="min-h-screen bg-[#051024] flex items-center justify-center p-3 md:p-8 relative overflow-hidden">
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-[#051024] rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden flex flex-col z-10">
        
        {/* Decorative corners */}
        <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-bl from-[#D4AF37] to-yellow-600 opacity-90 z-20" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-[#D4AF37] to-yellow-600 opacity-90 z-20" style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }}></div>

        {/* Header */}
        <header className="w-full flex items-center justify-between px-4 py-3 md:p-8 z-30">
          <div className="flex flex-col items-start gap-0.5">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white drop-shadow-md tracking-tight">
              سعر الذهب اليوم
            </h1>
            <h2 className="text-xs sm:text-base md:text-2xl font-bold text-[#FADB5F] drop-shadow-sm">
              أخبار الذهب والأسواق العالمية
            </h2>
          </div>
          <div className="flex-shrink-0 z-30">
            <GoldenBadge size="lg" />
          </div>
        </header>

        {/* Chart Section */}
        <main className="w-full px-3 md:px-12 z-20 flex flex-col items-center">
          <div
            className="relative w-full bg-white border-[3px] md:border-[5px] border-black shadow-2xl rounded-sm overflow-hidden"
            dir="ltr"
            style={{ height: 'clamp(260px, 48vw, 480px)' }}
          >
            <TradingChart onDataProcessed={handleDataProcessed} />
          </div>

          {/* Badge below chart — in flow, not absolute */}
          <div className="z-30 -mt-7 pointer-events-none">
            <GoldenBadge size="sm" />
          </div>
        </main>

        {/* Footer — all in normal flow, NO absolute children */}
        <footer className="w-full z-30 flex flex-col items-center pb-6 mt-3">
          
          {/* Breaking News Ribbon — right-aligned, in flow */}
          <div className="w-full flex justify-end mb-2">
            <div className="h-9 md:h-12 w-44 md:w-64 bg-gradient-to-r from-[#FADB5F] to-[#D4AF37] text-black font-black text-sm md:text-2xl flex items-center justify-end px-4 md:px-6 shadow-lg rounded-l-md relative">
              <div className="absolute left-2 top-0 bottom-0 w-9 flex gap-1 skew-x-[30deg]">
                <div className="w-1.5 h-full bg-black/80"></div>
                <div className="w-1.5 h-full bg-black/80"></div>
                <div className="w-1.5 h-full bg-black/80"></div>
              </div>
              <span className="relative z-10 ml-5 md:ml-12">خبر عاجل</span>
            </div>
          </div>

          {/* News Text */}
          <div className="w-full text-center px-3">
            <h3 className="text-base sm:text-2xl md:text-4xl font-black leading-snug mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="text-white">فرصة شراء للذهب بين </span>
              <span className="text-[#FADB5F]" style={{ transition: 'all 0.5s ease-in-out' }}>{buyTarget1} و {buyTarget2}</span>
            </h3>
            <p className="text-sm sm:text-xl md:text-2xl font-bold text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              دولار وسط مؤشرات فنية داعمة للصعود
            </p>
          </div>

          {/* Footer logo */}
          <div className="w-full flex justify-end px-4 mt-3">
            <span className="text-white/60 font-black text-sm md:text-xl tracking-wider drop-shadow-md">GOLD2TODAY</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
