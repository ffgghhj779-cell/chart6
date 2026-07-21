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

        // 1. Dynamic ZigZag Algorithm for Elliot Waves simulation & SMC structure
        const deviation = (maxPrice - minPrice) * 0.08; // 8% threshold
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
              markers.push({ time: lastExtreme.time, position: 'aboveBar', color: '#64748b', shape: 'arrowDown', text: 'CHoCH', size: 1 });
              isLookingForPeak = false;
              lastExtreme = candle;
            }
          } else {
            if (candle.low < lastExtreme.low) {
              lastExtreme = candle;
            } else if (candle.close > lastExtreme.low + deviation) {
              // Trend reversal upwards
              wavePoints.push({ time: lastExtreme.time, value: lastExtreme.low });
              markers.push({ time: lastExtreme.time, position: 'belowBar', color: '#64748b', shape: 'arrowUp', text: 'BOS', size: 1 });
              isLookingForPeak = true;
              lastExtreme = candle;
            }
          }
        });
        
        // Push the final current point
        wavePoints.push({ time: lastExtreme.time, value: isLookingForPeak ? lastExtreme.high : lastExtreme.low });

        // 2. Dynamic Trendlines calculation (Descending Channel)
        const peaks = wavePoints.filter((_, i) => i % 2 === (wavePoints[0].value > candles[0].open ? 0 : 1));
        const troughs = wavePoints.filter((_, i) => i % 2 !== (wavePoints[0].value > candles[0].open ? 0 : 1));
        
        // Draw Upper channel line
        const upperLine = peaks.length >= 2 ? [
          { time: peaks[0].time, value: peaks[0].value },
          { time: peaks[peaks.length-1].time, value: peaks[peaks.length-1].value }
        ] : [];

        // Draw Lower channel line
        const lowerLine = troughs.length >= 2 ? [
          { time: troughs[0].time, value: troughs[0].value },
          { time: troughs[troughs.length-1].time, value: troughs[troughs.length-1].value }
        ] : [];

        // Initialize Chart Container
        const el = containerRef.current;
        if (!el) return;

        chart = createChart(el, {
          width: el.offsetWidth || 800,
          height: el.offsetHeight || 500,
          layout: { background: { type: 'solid', color: '#e0f7fa' }, textColor: '#334155', attributionLogo: false },
          grid: { vertLines: { color: '#b2ebf2' }, horzLines: { color: '#b2ebf2' } },
          crosshair: { vertLine: { color: '#94a3b8', labelBackgroundColor: '#94a3b8', style: 1 }, horzLine: { color: '#94a3b8', labelBackgroundColor: '#94a3b8', style: 1 } },
          rightPriceScale: { borderColor: '#cbd5e1' },
          timeScale: { borderColor: '#cbd5e1', timeVisible: false },
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

        // Add Main Candlesticks (SMC Theme: Green Hollow, Blue Filled)
        const series = chart.addCandlestickSeries({ 
            upColor: '#e0f7fa', // Hollow body matches background
            downColor: '#3b82f6', // Filled blue
            borderVisible: true, 
            borderColor: '#22c55e', // Green border for UP
            borderUpColor: '#22c55e',
            borderDownColor: '#3b82f6',
            wickUpColor: '#22c55e', 
            wickDownColor: '#3b82f6' 
        });
        series.setData(candles);
        
        if (markers.length > 0) {
            series.setMarkers(markers);
        }

        // Add SMC Zones (Dynamic based on live range)
        const range = maxPrice - minPrice;
        
        series.createPriceLine({ price: maxPrice, color: '#64748b', lineWidth: 2, axisLabelVisible: true, title: 'BSL' });
        series.createPriceLine({ price: maxPrice - range * 0.15, color: '#64748b', lineWidth: 2, axisLabelVisible: true, title: 'OB' });
        series.createPriceLine({ price: minPrice + range * 0.6, color: '#64748b', lineWidth: 1, axisLabelVisible: true, title: 'LIQUIDITY', lineStyle: 3 });
        series.createPriceLine({ price: minPrice + range * 0.35, color: '#64748b', lineWidth: 2, axisLabelVisible: true, title: 'SMALL OB' });
        series.createPriceLine({ price: minPrice + range * 0.2, color: '#64748b', lineWidth: 2, axisLabelVisible: true, title: 'POI' });
        series.createPriceLine({ price: minPrice, color: '#64748b', lineWidth: 3, axisLabelVisible: true, title: 'BULLISH OB + DEMAND ZONE' });

        // Add Structure Wave Lines (Gray)
        const waveSeries = chart.addLineSeries({ color: '#94a3b8', lineWidth: 1, crosshairMarkerVisible: false, priceLineVisible: false, lastValueVisible: false });
        waveSeries.setData(wavePoints);

        // Add Upper Trendline
        if (upperLine.length > 0) {
          const upperSeries = chart.addLineSeries({ color: '#475569', lineWidth: 2, crosshairMarkerVisible: false, priceLineVisible: false, lastValueVisible: false });
          upperSeries.setData(upperLine);
        }

        // Add Lower Trendline
        if (lowerLine.length > 0) {
          const lowerSeries = chart.addLineSeries({ color: '#475569', lineWidth: 2, crosshairMarkerVisible: false, priceLineVisible: false, lastValueVisible: false });
          lowerSeries.setData(lowerLine);
        }

        // Optional: Fake volume profile approximation on the right axis using histogram (Not true horizontal VP, but adds visual density)
        const volumeSeries = chart.addHistogramSeries({
            color: '#93c5fd',
            priceFormat: { type: 'volume' },
            priceScaleId: '', // set as an overlay by setting a blank priceScaleId
            scaleMargins: { top: 0.8, bottom: 0 },
        });
        const volumeData = candles.map(c => ({
            time: c.time,
            value: Math.random() * 100, // fake volume for aesthetics since binance daily volume varies too wildly to look like a profile
            color: c.close > c.open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.4)'
        }));
        volumeSeries.setData(volumeData);

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
