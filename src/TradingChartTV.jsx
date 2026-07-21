import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

export const TradingChart = ({ onDataProcessed }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let chart;
    let ro;
    
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=1d&limit=150');
        const rawData = await response.json();
        
        const candles = [];
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        let lastClose = 0;

        rawData.forEach(d => {
          const date = new Date(d[0]);
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          
          const open = parseFloat(d[1]);
          const high = parseFloat(d[2]);
          const low = parseFloat(d[3]);
          const close = parseFloat(d[4]);
          
          if (low < minPrice) minPrice = low;
          if (high > maxPrice) maxPrice = high;
          lastClose = close;

          candles.push({
            time: `${y}-${m}-${day}`,
            open, high, low, close
          });
        });

        // Calculate Simple Moving Average (SMA - 20 period for visual fit on 150 limit)
        const smaPeriod = 20;
        const smaData = [];
        for (let i = 0; i < candles.length; i++) {
          if (i < smaPeriod - 1) continue;
          let sum = 0;
          for (let j = 0; j < smaPeriod; j++) {
            sum += candles[i - j].close;
          }
          smaData.push({ time: candles[i].time, value: sum / smaPeriod });
        }

        // Initialize Chart Container
        const el = containerRef.current;
        if (!el) return;

        chart = createChart(el, {
          width: el.offsetWidth || 800,
          height: el.offsetHeight || 500,
          layout: { background: { type: 'solid', color: '#000040' }, textColor: '#b0bec5', attributionLogo: false }, // Dark Navy Blue
          grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
          crosshair: { vertLine: { color: '#94a3b8', labelBackgroundColor: '#94a3b8', style: 1 }, horzLine: { color: '#94a3b8', labelBackgroundColor: '#94a3b8', style: 1 } },
          rightPriceScale: { borderColor: 'rgba(255,255,255,0.2)' },
          timeScale: { borderColor: 'rgba(255,255,255,0.2)', timeVisible: false },
          handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
          handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
        });

        // Add Main Candlesticks (TV Style: Solid Blue)
        const series = chart.addCandlestickSeries({ 
            upColor: '#3b82f6', 
            downColor: '#3b82f6', 
            borderVisible: false, 
            wickUpColor: '#3b82f6', 
            wickDownColor: '#3b82f6' 
        });
        series.setData(candles);

        // Add SMA Line (Green Dashed)
        const smaSeries = chart.addLineSeries({
            color: '#22c55e',
            lineWidth: 2,
            lineStyle: 2, // Dashed
            crosshairMarkerVisible: false,
            priceLineVisible: false,
            lastValueVisible: false
        });
        smaSeries.setData(smaData);

        // Calculate Fibonacci Levels
        const diff = maxPrice - minPrice;
        const fibLevels = [
            { level: 1.0, value: minPrice + diff * 1.0, color: '#ef4444', label: '100.0%' },
            { level: 0.764, value: minPrice + diff * 0.764, color: '#8b5cf6', label: '76.4%' },
            { level: 0.618, value: minPrice + diff * 0.618, color: '#22c55e', label: '61.8%' },
            { level: 0.5, value: minPrice + diff * 0.5, color: '#8b5cf6', label: '50.0%' },
            { level: 0.382, value: minPrice + diff * 0.382, color: '#22c55e', label: '38.2%' },
            { level: 0.236, value: minPrice + diff * 0.236, color: '#8b5cf6', label: '23.6%' },
            { level: 0.0, value: minPrice, color: '#ef4444', label: '0.0%' },
        ];

        // Draw Price Lines for Fibonacci
        fibLevels.forEach(fib => {
            series.createPriceLine({
                price: fib.value,
                color: fib.color,
                lineWidth: 1,
                axisLabelVisible: true,
                title: fib.label
            });
        });

        chart.timeScale().fitContent();

        ro = new ResizeObserver(() => {
          if (!el) return;
          chart.applyOptions({ width: el.offsetWidth, height: el.offsetHeight });
        });
        ro.observe(el);

        setLoading(false);

        if (onDataProcessed) {
            onDataProcessed({ fibLevels, minPrice, maxPrice });
        }

      } catch (err) {
        console.error(err);
        setError("فشل في جلب البيانات");
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (ro) ro.disconnect();
      if (chart) chart.remove();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Title 'XAUUSD' */}
      {!loading && !error && (
          <div style={{
              position: 'absolute',
              top: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#fbbf24', // Amber 400
              fontFamily: 'serif',
              fontWeight: '900',
              fontSize: '36px',
              zIndex: 10,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
              XAUUSD
          </div>
      )}

      {loading && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, color: '#fff', background: '#000040', fontWeight: 'bold'}}>جاري تحميل البيانات...</div>}
      {error && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'red', zIndex:50, background: '#000040', fontWeight: 'bold'}}>{error}</div>}
      
      <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: loading ? 0 : 1 }} />
    </div>
  );
};

export default TradingChart;
