import React, { useState } from 'react';
import TradingChart from './TradingChartSMC';

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


function AppSMC() {
  const [chartData, setChartData] = useState({
    currentPrice: null,
    resistance: null,
    demandZone: null,
    bslPrice: null,
    obPrice: null,
    liqPrice: null,
    smallObPrice: null,
    poiPrice: null,
  });

  const handleDataProcessed = (data) => {
    setChartData(data);
  };

  const isDataReady = chartData.currentPrice !== null;

  // Dynamic news logic: determine what zone the price is in RIGHT NOW
  const getSmcHeadline = () => {
    if (!isDataReady) return "جاري تحليل هيكل السوق...";
    const { currentPrice, bslPrice, obPrice, liqPrice, smallObPrice, poiPrice, demandZone } = chartData;
    if (currentPrice >= bslPrice)         return `الذهب اختبر السيولة (BSL) عند ${Math.round(bslPrice)}`;
    if (currentPrice >= obPrice)          return `الذهب في منطقة Order Block عند ${Math.round(obPrice)}`;
    if (currentPrice >= liqPrice)         return `الذهب عند مستوى السيولة ${Math.round(liqPrice)}`;
    if (currentPrice >= smallObPrice)     return `الذهب في Small OB عند ${Math.round(smallObPrice)}`;
    if (currentPrice >= poiPrice)         return `الذهب في منطقة الاهتمام (POI) عند ${Math.round(poiPrice)}`;
    return `الذهب يحاول التعافي من منطقة الطلب ${Math.round(demandZone)}`;
  };

  const getSmcSubtext1 = () => {
    if (!isDataReady) return "";
    const { currentPrice, obPrice, liqPrice } = chartData;
    if (currentPrice >= obPrice)  return "مؤشرات ضغط بيعي | ترقب للانعكاس";
    if (currentPrice >= liqPrice) return "مؤشرات صعودية مؤقتة";
    return "هيكل السوق لا يزال تحت الضغط";
  };

  const getSmcSubtext2 = () => {
    if (!isDataReady) return "";
    const { currentPrice, bslPrice, demandZone } = chartData;
    const midPoint = (bslPrice + demandZone) / 2;
    if (currentPrice >= midPoint) return `وسط اقتراب من المقاومة الرئيسية ${Math.round(bslPrice)}`;
    return `وسط هيكل عام بعيد عن القمة ${Math.round(bslPrice)}`;
  };

  return (
    <div className="min-h-screen bg-[#051024] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background World Map / Grid overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
      
      {/* Subtle radial gradient to center focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Main Graphic Container */}
      <div className="relative w-full max-w-4xl bg-[#051024] rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden flex flex-col z-10">
        
        {/* Decorative corner cuts */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37] to-yellow-600 clip-diagonal-tr opacity-90 z-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#D4AF37] to-yellow-600 clip-diagonal-bl opacity-90 z-20"></div>

        {/* Top Header Section */}
        <header className="w-full flex items-center justify-between p-4 md:p-8 z-30">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-2xl md:text-5xl font-black text-white drop-shadow-md tracking-tight">
              سعر الذهب اليوم
            </h1>
            <h2 className="text-sm md:text-2xl font-bold text-[#FADB5F] drop-shadow-sm">
              أخبار الذهب والأسواق العالمية
            </h2>
          </div>
          <div className="flex-shrink-0">
            <GoldenBadge size="lg" />
          </div>
        </header>

        {/* Center Chart Section */}
        <main className="flex-1 w-full px-3 md:px-12 relative z-20 flex flex-col items-center justify-center mb-8">
          <div
            className="relative w-full bg-white border-[3px] md:border-[5px] border-black shadow-2xl rounded-sm overflow-hidden"
            dir="ltr"
            style={{ height: 'clamp(280px, 50vw, 480px)' }}
          >
            {/* Live Interactive Chart */}
            <TradingChart onDataProcessed={handleDataProcessed} />

            {/* Overlapping badge at bottom center */}
            <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
              <GoldenBadge size="sm" />
            </div>
          </div>
        </main>

        {/* Bottom Section */}
        <footer className="w-full relative z-30 pb-8 pt-12 flex flex-col items-center mt-auto">
          
          {/* Breaking News Ribbon */}
          <div className="absolute right-0 top-0 h-9 md:h-12 w-44 md:w-64 bg-gradient-to-r from-[#FADB5F] to-[#D4AF37] text-black font-black text-base md:text-2xl flex items-center justify-end px-4 md:px-6 shadow-lg rounded-l-md z-40">
            <div className="absolute left-2 top-0 bottom-0 w-10 flex space-x-1.5 space-x-reverse skew-x-[30deg]">
              <div className="w-1.5 h-full bg-black/80"></div>
              <div className="w-1.5 h-full bg-black/80"></div>
              <div className="w-1.5 h-full bg-black/80"></div>
            </div>
            <span className="relative z-10 ml-6 md:ml-12">خبر عاجل</span>
          </div>

          <div className="w-full text-center px-3 relative z-20">
            {/* Main Headline - 100% Dynamic based on live SMC zone */}
            <h3 className="text-base md:text-4xl font-black leading-snug mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ transition: 'all 0.5s ease-in-out' }}>
              <span className="text-[#FADB5F]">{getSmcHeadline()}</span>
            </h3>
            
            {/* Subtext 1 - Dynamic based on zone */}
            <p className="text-sm md:text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1" style={{ transition: 'all 0.5s ease-in-out' }}>
              {getSmcSubtext1()}
            </p>

            {/* Subtext 2 - Dynamic based on distance from BSL */}
            <p className="text-sm md:text-2xl font-bold text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ transition: 'all 0.5s ease-in-out' }}>
              {getSmcSubtext2()}
            </p>
          </div>

          {/* Footer Logo text */}
          <div className="absolute bottom-3 right-4 text-white/60 font-black text-base md:text-xl tracking-wider drop-shadow-md pointer-events-none">
            GOLD2TODAY
          </div>
        </footer>
        
      </div>
    </div>
  );
}

export default AppSMC;
