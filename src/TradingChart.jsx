import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

// Generate realistic dummy data that looks like the trend in the image
const generateDummyData = () => {
  const data = [];
  let currentDate = new Date(2026, 0, 1);
  // Start high around 4200, drop to 3950, then bounce up, to simulate the Elliott waves
  let currentPrice = 4220;
  
  for (let i = 0; i < 150; i++) {
    const volatility = 20;
    const isDowntrend = i < 70; // First half is down
    const isUptrend = i >= 70;  // Second half is up
    
    let moveBias = (Math.random() - 0.5) * 10;
    if (isDowntrend) moveBias -= 4;
    if (isUptrend) moveBias += 4;

    const open = currentPrice + moveBias;
    const maxMove = Math.random() * volatility;
    const high = open + maxMove;
    const low = open - Math.random() * volatility;
    const close = low + Math.random() * (high - low);
    
    // YYYY-MM-DD string format (safest for lightweight-charts daily data)
    const time = currentDate.toISOString().split('T')[0];
    
    data.push({ 
      time, 
      open: Number(open.toFixed(2)), 
      high: Number(high.toFixed(2)), 
      low: Number(low.toFixed(2)), 
      close: Number(close.toFixed(2)) 
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
    currentPrice = close;
  }
  return data;
};

export const TradingChart = ({ data, containerClassName = "" }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(data || generateDummyData());

  useEffect(() => {
    if (data) setChartData(data);
  }, [data]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    let chart;
    let resizeObserver;

    try {
      // White theme config matching the requested original design
      const chartOptions = {
        width: chartContainerRef.current.clientWidth || 600,
        height: chartContainerRef.current.clientHeight || 400,
        layout: {
          background: { type: ColorType.Solid, color: '#ffffff' },
          textColor: '#333333',
          attributionLogo: false,
        },
        grid: {
          vertLines: { color: 'rgba(0, 0, 0, 0.05)' },
          horzLines: { color: 'rgba(0, 0, 0, 0.05)' },
        },
        crosshair: {
          vertLine: { color: '#758696', width: 1, style: 1, labelBackgroundColor: '#758696' },
          horzLine: { color: '#758696', width: 1, style: 1, labelBackgroundColor: '#758696' },
        },
        rightPriceScale: { borderColor: 'rgba(0, 0, 0, 0.1)' },
        timeScale: { borderColor: 'rgba(0, 0, 0, 0.1)', timeVisible: true },
      };

      chart = createChart(chartContainerRef.current, chartOptions);
      chartRef.current = chart;

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      candlestickSeries.setData(chartData);

      // Add Support & Resistance Lines just like the image
      candlestickSeries.createPriceLine({
          price: 4104.0,
          color: '#f59e0b',
          lineWidth: 2,
          lineStyle: 0,
          axisLabelVisible: true,
          title: 'Resistance',
      });
      
      candlestickSeries.createPriceLine({
          price: 4014.4,
          color: '#f59e0b',
          lineWidth: 2,
          lineStyle: 0,
          axisLabelVisible: true,
          title: 'Support',
      });
      
      candlestickSeries.createPriceLine({
          price: 3945.0,
          color: '#8b5cf6',
          lineWidth: 2,
          lineStyle: 0,
          axisLabelVisible: true,
          title: 'Demand Zone',
      });

      chart.timeScale().fitContent();

      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(chartContainerRef.current);

    } catch (error) {
      console.error("Chart initialization failed:", error);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (chart) chart.remove();
    };
  }, [chartData]);

  return (
    <div 
      ref={chartContainerRef} 
      className={`w-full h-full relative font-sans ${containerClassName}`} 
    >
      {/* Top toolbar mockup matching TradingView interface */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-gray-200 flex items-center px-2 text-[10px] text-gray-500 gap-2 rtl:flex-row-reverse bg-white/90 z-10 pointer-events-none">
        <span>TradingView.com 05:28 2026 ,17 يوليو UTC+1</span>
        <span>الذهب / دولار أمريكي · 1 سا · OANDA</span>
        <span className="text-red-500">O 3,991.415 H 3,991.765 L 3,985.240 C 3,986.675 -4.760 (-0.12%)</span>
      </div>
    </div>
  );
};

export default TradingChart;
