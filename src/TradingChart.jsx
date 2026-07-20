import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

// Generate realistic dummy OHLC data
const generateDummyData = () => {
  const data = [];
  let currentDate = new Date(2026, 0, 1);
  let currentPrice = 4220;
  
  for (let i = 0; i < 150; i++) {
    const volatility = 20;
    
    let moveBias = (Math.random() - 0.5) * 10;
    if (i < 70) moveBias -= 4;  // downtrend first half
    else moveBias += 4;          // uptrend second half

    const open = currentPrice + moveBias;
    const high = open + Math.random() * volatility;
    const low = open - Math.random() * volatility;
    const close = low + Math.random() * (high - low);
    
    data.push({ 
      time: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2,'0')}-${String(currentDate.getDate()).padStart(2,'0')}`,
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

export const TradingChart = ({ data }) => {
  const chartContainerRef = useRef(null);
  const chartData = useRef(data || generateDummyData());

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // Force explicit pixel dimensions
    const W = container.offsetWidth || 550;
    const H = container.offsetHeight || 350;

    const chart = createChart(container, {
      width: W,
      height: H,
      layout: {
        background: { type: 'solid', color: '#ffffff' },
        textColor: '#333333',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(0,0,0,0.04)' },
        horzLines: { color: 'rgba(0,0,0,0.04)' },
      },
      crosshair: {
        vertLine: { color: '#758696', width: 1, style: 1, labelBackgroundColor: '#758696' },
        horzLine: { color: '#758696', width: 1, style: 1, labelBackgroundColor: '#758696' },
      },
      rightPriceScale: { borderColor: 'rgba(0,0,0,0.1)' },
      timeScale: { borderColor: 'rgba(0,0,0,0.1)', timeVisible: false },
    });

    const series = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    series.setData(chartData.current);

    // Price Lines (like Resistance/Support in the image)
    series.createPriceLine({ price: 4104.0, color: '#f59e0b', lineWidth: 2, axisLabelVisible: true, title: 'Resistance' });
    series.createPriceLine({ price: 4014.4, color: '#f59e0b', lineWidth: 2, axisLabelVisible: true, title: 'Support' });
    series.createPriceLine({ price: 3945.0, color: '#8b5cf6', lineWidth: 2, axisLabelVisible: true, title: 'Demand Zone' });

    chart.timeScale().fitContent();

    // Resize observer
    const ro = new ResizeObserver(() => {
      if (!container) return;
      chart.applyOptions({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Top toolbar header row */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '28px',
        background: 'white', borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', padding: '0 8px',
        fontSize: '10px', color: '#6b7280', gap: '8px',
        zIndex: 10, pointerEvents: 'none', flexDirection: 'row-reverse'
      }}>
        <span>TradingView.com 05:28 2026 ,17 يوليو UTC+1</span>
        <span>الذهب / دولار أمريكي · 1 سا · OANDA</span>
        <span style={{color:'#ef4444'}}>O 3,991.415 H 3,991.765 L 3,985.240 C 3,986.675 -4.760 (-0.12%)</span>
      </div>
      {/* Chart mounts here - pushed down by 28px to avoid overlap with header */}
      <div
        ref={chartContainerRef}
        style={{ position: 'absolute', top: '28px', left: 0, right: 0, bottom: 0 }}
      />
    </div>
  );
};

export default TradingChart;
