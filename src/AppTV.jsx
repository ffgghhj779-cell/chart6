import React from 'react';
import TradingChartTV from './TradingChartTV';

const AppTV = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden" dir="rtl">
      
      {/* 1. Top Tickers & Video Section */}
      <div className="w-full bg-[#f8f9fa] flex flex-col" style={{ height: '35vh' }}>
        
        {/* Top Ticker Dashboard */}
        <div className="flex-1 flex w-full">
          {/* Market Data Grid (Left side in LTR, Right side in RTL -> so it's on the right) */}
          <div className="w-2/3 md:w-3/4 flex flex-col p-2 gap-2 h-full justify-between bg-white border-b-4 border-blue-600">
            {/* Ticker Row 1 */}
            <div className="flex items-center justify-between border-b border-gray-300 pb-1">
              <span className="font-bold text-gray-800 text-sm md:text-xl w-1/4">الذهب</span>
              <span className="text-xl md:text-3xl font-black text-gray-800">4716.38</span>
              <span className="text-green-600 text-2xl">▲</span>
              <span className="text-gray-600 font-bold">31.2023 [ 0.67% ]</span>
            </div>
            {/* Ticker Row 2 */}
            <div className="flex items-center justify-between border-b border-gray-300 pb-1">
              <span className="font-bold text-gray-800 text-sm md:text-xl w-1/4">خام برنت</span>
              <span className="text-xl md:text-3xl font-black text-gray-800">100.6</span>
              <span className="text-green-600 text-2xl">▲</span>
              <span className="text-gray-600 font-bold">0.54%</span>
            </div>
            {/* Ticker Row 3 */}
            <div className="flex items-center justify-between border-b border-gray-300 pb-1">
              <span className="font-bold text-gray-800 text-sm md:text-xl w-1/4">عوائد السندات</span>
              <span className="text-xl md:text-3xl font-black text-gray-800">4.37</span>
              <span className="text-red-600 text-2xl">▼</span>
              <span className="text-gray-600 font-bold">0.5%</span>
            </div>
            {/* Ticker Row 4 */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 text-sm md:text-xl w-1/4">Bitcoin</span>
              <span className="text-xl md:text-3xl font-black text-gray-800">79823.73</span>
              <span className="text-green-600 text-2xl">▲</span>
              <span className="text-gray-600 font-bold">0.06%</span>
            </div>
          </div>

          {/* Video Placeholder (Left side) */}
          <div className="w-1/3 md:w-1/4 h-full bg-black relative border-b-4 border-blue-600">
             {/* Fake video controls/overlay */}
             <div className="absolute top-2 right-2 flex gap-2">
                <span className="bg-red-600 text-white text-xs px-2 py-1 font-bold rounded animate-pulse">مباشر</span>
             </div>
             {/* Presenter Name Overlay */}
             <div className="absolute bottom-2 left-2 bg-blue-900 text-white text-xs px-2 py-1 bg-opacity-80">أشرف العايدي</div>
             {/* Placeholder Image of presenter (or empty box) */}
             <div className="w-full h-full bg-gradient-to-t from-gray-900 to-gray-700 flex items-center justify-center">
                <span className="text-white/30 text-sm">مساحة فيديو البث</span>
             </div>
          </div>
        </div>

        {/* Lower Blue News Bar (Marquee) */}
        <div className="h-10 bg-[#0d47a1] text-white flex items-center overflow-hidden whitespace-nowrap border-b-2 border-white">
          <div className="w-full relative flex items-center">
             <div className="bg-blue-600 text-white font-bold h-10 px-4 flex items-center absolute right-0 z-10 shadow-lg">عاجل</div>
             <marquee className="font-bold text-lg mr-24" scrollamount="6">
                معدل المشاركة في سوق العمل الأمريكي يرتفع بشكل ملحوظ ... تداولات الذهب تشهد تذبذبات قوية وسط ترقب لبيانات التضخم ... البنك المركزي يبقي على معدلات الفائدة دون تغيير
             </marquee>
          </div>
        </div>
      </div>

      {/* 2. Main TV Chart Section */}
      <div className="w-full flex-1 bg-red-600 p-2 md:p-3 relative flex flex-col">
         {/* Inner Chart Container */}
         <div className="flex-1 w-full bg-[#000040] relative border-4 border-white shadow-inner flex flex-col overflow-hidden">
            <TradingChartTV onDataProcessed={(data) => {}} />
         </div>

         {/* Bottom Red Ticker / Presenter Bar */}
         <div className="h-12 w-full mt-2 bg-red-800 text-white flex items-center px-4 overflow-hidden border-2 border-white/20">
            <div className="flex items-center gap-4 w-full">
              <span className="bg-red-600 px-3 py-1 font-bold text-lg rounded shadow">إستراتيجية تداول الذهب</span>
              <marquee className="font-bold text-md text-white/90" scrollamount="5">
                  تداول وتحليل فني لمختلف فئات الأصول العالمية مع أشرف العايدي ... ترقب لاختراق مستويات المقاومة الرئيسية للذهب
              </marquee>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AppTV;
