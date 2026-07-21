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
        // PAXG/USDT on Binance perfectly tracks real Gold (XAU) prices in USD.
        // It's a free, public API with no CORS issues.
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

        const supportPrice = minPrice + (maxPrice-minPrice)*0.25;
        const demandPrice = minPrice;
        
        if (onDataProcessed) {
           onDataProcessed({
               currentPrice: lastClose,
               support: supportPrice,
               resistance: maxPrice,
               demandZone: demandPrice
           });
        }

        // 1. Dynamic ZigZag Algorithm for Elliot Waves simulation
        const deviation = (maxPrice - minPrice) * 0.10; // 10% of total range as reversal threshold
        const wavePoints = [];
        const markers = [];
        
        let isLookingForPeak = true;
        let lastExtreme = candles[0];
        
        candles.forEach((candle) => {
          if (isLookingForPeak) {
            if (candle.high > lastExtreme.high) {
              lastExtreme = candle;
            } else if (candle.close < lastExtreme.high - deviation) {
              // Trend reversal downwards
              wavePoints.push({ time: lastExtreme.time, value: lastExtreme.high });
              markers.push({ time: lastExtreme.time, position: 'aboveBar', color: '#3b82f6', shape: 'arrowDown', text: lastExtreme.high.toFixed(2), size: 1.5 });
              isLookingForPeak = false;
              lastExtreme = candle;
            }
          } else {
            if (candle.low < lastExtreme.low) {
              lastExtreme = candle;
            } else if (candle.close > lastExtreme.low + deviation) {
              // Trend reversal upwards
              wavePoints.push({ time: lastExtreme.time, value: lastExtreme.low });
              markers.push({ time: lastExtreme.time, position: 'belowBar', color: '#3b82f6', shape: 'arrowUp', text: lastExtreme.low.toFixed(2), size: 1.5 });
              isLookingForPeak = true;
              lastExtreme = candle;
            }
          }
        });
        
        // Push the final current point
        wavePoints.push({ time: lastExtreme.time, value: isLookingForPeak ? lastExtreme.high : lastExtreme.low });

        // 2. Dynamic Trendlines calculation
        const peaks = wavePoints.filter((_, i) => i % 2 === (wavePoints[0].value > candles[0].open ? 0 : 1));
        const troughs = wavePoints.filter((_, i) => i % 2 !== (wavePoints[0].value > candles[0].open ? 0 : 1));
        
        // Draw purple trendline between first and last significant peaks
        const purpleLine = peaks.length >= 2 ? [
          { time: peaks[0].time, value: peaks[0].value },
          { time: peaks[peaks.length-1].time, value: peaks[peaks.length-1].value }
        ] : [];

        // Draw red trendline between first and last significant troughs
        const redLine = troughs.length >= 2 ? [
          { time: troughs[0].time, value: troughs[0].value },
          { time: troughs[troughs.length-1].time, value: troughs[troughs.length-1].value }
        ] : [];

        // Initialize Chart Container
        const el = containerRef.current;
        if (!el) return;

        chart = createChart(el, {
          width: el.offsetWidth || 800,
          height: el.offsetHeight || 500,
          layout: { background: { type: 'solid', color: '#ffffff' }, textColor: '#333333', attributionLogo: false },
          grid: { vertLines: { color: 'rgba(0,0,0,0.04)' }, horzLines: { color: 'rgba(0,0,0,0.04)' } },
          crosshair: { vertLine: { color: '#758696', labelBackgroundColor: '#758696', style: 1 }, horzLine: { color: '#758696', labelBackgroundColor: '#758696', style: 1 } },
          rightPriceScale: { borderColor: 'rgba(0,0,0,0.1)' },
          timeScale: { borderColor: 'rgba(0,0,0,0.1)', timeVisible: false },
          handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
            horzTouchDrag: true,
            vertTouchDrag: true,
          },
          handleScale: {
            axisPressedMouseMove: true,
            mouseWheel: true,
            pinch: true,
          },
        });

        // Add Main Candlesticks
        const series = chart.addCandlestickSeries({ upColor: '#22c55e', downColor: '#ef4444', borderVisible: false, wickUpColor: '#22c55e', wickDownColor: '#ef4444' });
        series.setData(candles);
        
        if (markers.length > 0) {
            series.setMarkers(markers);
        }

        // Add Dynamic Support & Resistance Zones
        series.createPriceLine({ price: maxPrice, color: '#f59e0b', lineWidth: 2, axisLabelVisible: true, title: 'مقاومة' });
        series.createPriceLine({ price: minPrice + (maxPrice-minPrice)*0.25, color: '#f59e0b', lineWidth: 2, axisLabelVisible: true, title: 'دعم' });
        series.createPriceLine({ price: minPrice, color: '#8b5cf6', lineWidth: 2, axisLabelVisible: true, title: 'منطقة طلب' });

        // Add Wave Lines (Black)
        const waveSeries = chart.addLineSeries({ color: '#000000', lineWidth: 2, crosshairMarkerVisible: false, priceLineVisible: false, lastValueVisible: false });
        waveSeries.setData(wavePoints);

        // Add Purple Trendline
        if (purpleLine.length > 0) {
          const purpleSeries = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 2, crosshairMarkerVisible: false, priceLineVisible: false, lastValueVisible: false });
          purpleSeries.setData(purpleLine);
        }

        // Add Red Trendline
        if (redLine.length > 0) {
          const redSeries = chart.addLineSeries({ color: '#ef4444', lineWidth: 2, crosshairMarkerVisible: false, priceLineVisible: false, lastValueVisible: false });
          redSeries.setData(redLine);
        }

        chart.timeScale().fitContent();

        ro = new ResizeObserver(() => {
          if (!el) return;
          chart.applyOptions({ width: el.offsetWidth, height: el.offsetHeight });
        });
        ro.observe(el);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("فشل في جلب البيانات الحية للأسواق");
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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Loading & Error States */}
      {loading && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, color: '#333', background: '#fff', fontWeight: 'bold'}}>جاري تحميل البيانات الحية للذهب (Live API)...</div>}
      {error && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'red', zIndex:50, background: '#fff', fontWeight: 'bold'}}>{error}</div>}
      
      {/* Top info bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '30px',
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', padding: '0 12px',
        fontSize: '11px', color: '#6b7280', gap: '12px',
        zIndex: 10, pointerEvents: 'none', direction: 'rtl',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>TradingView.com · الذهب الحقيقي (PAXG/USDT) · البيانات: Binance · 1 يوم</span>
        <span style={{ color: '#22c55e', fontWeight: 'bold', flexShrink: 0 }}>● LIVE</span>
      </div>
      
      <div ref={containerRef} style={{ position: 'absolute', top: '30px', left: 0, right: 0, bottom: 0, opacity: loading ? 0 : 1 }} />
    </div>
  );
};

export default TradingChart;
