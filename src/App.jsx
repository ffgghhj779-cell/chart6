import React from 'react';
import TradingChart from './TradingChart';

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
          <div className="relative w-full aspect-[16/9] md:h-[450px] bg-white border-[5px] border-black shadow-2xl rounded-sm overflow-hidden" dir="ltr">
            
            {/* Chart inside */}
            <TradingChart />

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
