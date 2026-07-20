import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

// Generate deterministic data to exactly match the requested chart analysis
const generateChartData = () => {
  const anchors = [
    { day: 0, price: 4050 },
    { day: 8, price: 4150, label: null, isPeak: true },
    { day: 15, price: 3950, label: null, isTrough: true },
    { day: 28, price: 4180.520, label: '4,180.520', isPeak: true },
    { day: 45, price: 4021.815, label: '4,021.815', isTrough: true, arrow: true },
    { day: 62, price: 4138.035, label: '4,138.035', isPeak: true },
    { day: 75, price: 3930, label: null, isTrough: true },
    { day: 88, price: 4104.050, label: '4,104.050', isPeak: true },
    { day: 105, price: 3948, label: null, isTrough: true, arrow: true },
    { day: 115, price: 4081.520, label: '4,081.520', isPeak: true },
    { day: 125, price: 3965, label: null, isTrough: true, arrow: true },
    { day: 140, price: 4050, label: null },
  ];

  const candles = [];
  const wavePoints = [];
  const markers = [];

  let startDate = new Date(2026, 0, 1);
  let globalDates = [];
  
  for (let i = 0; i < anchors.length - 1; i++) {
    const startAnchor = anchors[i];
    const endAnchor = anchors[i+1];
    const daysBetween = endAnchor.day - startAnchor.day;
    const priceDiff = endAnchor.price - startAnchor.price;
    const dailyStep = priceDiff / daysBetween;

    for (let j = 0; j < daysBetween; j++) {
      const basePrice = startAnchor.price + dailyStep * j;
      
      const volatility = 8;
      const open = basePrice + (Math.random() - 0.5) * 4;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);

      const y = startDate.getFullYear();
      const m = String(startDate.getMonth() + 1).padStart(2, '0');
      const d = String(startDate.getDate()).padStart(2, '0');
      const timeStr = `${y}-${m}-${d}`;

      globalDates.push(timeStr);

      candles.push({
        time: timeStr,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2))
      });

      if (j === 0) {
        wavePoints.push({ time: timeStr, value: startAnchor.price });
        
        if (startAnchor.label || startAnchor.arrow) {
          markers.push({
            time: timeStr,
            position: startAnchor.isPeak ? 'aboveBar' : 'belowBar',
            color: '#3b82f6', // blue
            shape: startAnchor.isPeak ? 'arrowDown' : 'arrowUp',
            text: startAnchor.label || '',
            size: 1.5
          });
        }
      }

      startDate.setDate(startDate.getDate() + 1);
    }
  }

  // Last anchor
  const lastAnchor = anchors[anchors.length - 1];
  const y = startDate.getFullYear();
  const m = String(startDate.getMonth() + 1).padStart(2, '0');
  const d = String(startDate.getDate()).padStart(2, '0');
  const timeStr = `${y}-${m}-${d}`;
  wavePoints.push({ time: timeStr, value: lastAnchor.price });
  globalDates.push(timeStr);

  candles.push({
    time: timeStr,
    open: lastAnchor.price, high: lastAnchor.price + 2, low: lastAnchor.price - 2, close: lastAnchor.price
  });

  // Trendlines
  // Purple descending: from Peak 4180.520 (index 3) through Peak 4081.520 (index 9)
  const purpleLine = [
    { time: globalDates[anchors[1].day], value: 4210 }, // Extend backward visually
    { time: globalDates[anchors[3].day], value: anchors[3].price },
    { time: globalDates[anchors[9].day], value: anchors[9].price },
    { time: globalDates[anchors[11].day], value: 4020 }, // Extend forward
  ];

  // Red ascending: from bottom left 3950 (index 2) through 4021 (index 4)
  const redLine = [
    { time: globalDates[0], value: 3900 },
    { time: globalDates[anchors[2].day], value: anchors[2].price },
    { time: globalDates[anchors[4].day], value: anchors[4].price },
    { time: globalDates[anchors[11].day], value: 4150 }, // Extend forward
  ];

  return { candles, wavePoints, markers, purpleLine, redLine };
};

const CHART_DATA = generateChartData();

export const TradingChart = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = createChart(el, {
      width: el.offsetWidth || 800,
      height: el.offsetHeight || 500,
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
        vertLine: { color: '#758696', labelBackgroundColor: '#758696', style: 1 },
        horzLine: { color: '#758696', labelBackgroundColor: '#758696', style: 1 },
      },
      rightPriceScale: { borderColor: 'rgba(0,0,0,0.1)' },
      timeScale: { borderColor: 'rgba(0,0,0,0.1)', timeVisible: false },
    });

    // 1. Candlestick Series
    const series = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });
    series.setData(CHART_DATA.candles);
    series.setMarkers(CHART_DATA.markers);

    // 2. Horizontal Support & Resistance price lines
    series.createPriceLine({ price: 4104.0, color: '#f59e0b', lineWidth: 2, axisLabelVisible: true, title: 'مقاومة' });
    series.createPriceLine({ price: 4014.4, color: '#f59e0b', lineWidth: 2, axisLabelVisible: true, title: 'دعم' });
    series.createPriceLine({ price: 3945.0, color: '#8b5cf6', lineWidth: 2, axisLabelVisible: true, title: 'منطقة طلب' });

    // 3. Elliot Waves (Black zigzag lines)
    const waveSeries = chart.addLineSeries({
      color: '#000000',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    // Remove the first few points so the zigzag starts exactly where the image starts
    waveSeries.setData(CHART_DATA.wavePoints.slice(1, -1));

    // 4. Purple Descending Trendline
    const purpleSeries = chart.addLineSeries({
      color: '#8b5cf6',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    purpleSeries.setData(CHART_DATA.purpleLine);

    // 5. Red Ascending Trendline
    const redSeries = chart.addLineSeries({
      color: '#ef4444',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    redSeries.setData(CHART_DATA.redLine);

    chart.timeScale().fitContent();

    // Handle resize
    const ro = new ResizeObserver(() => {
      if (!el) return;
      chart.applyOptions({ width: el.offsetWidth, height: el.offsetHeight });
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Top info bar mimicking TradingView header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '30px',
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', padding: '0 12px',
        fontSize: '11px', color: '#6b7280', gap: '12px',
        zIndex: 10, pointerEvents: 'none', direction: 'rtl',
      }}>
        <span>TradingView.com 05:28 2026 ,17 يوليو UTC+1</span>
        <span>الذهب / دولار أمريكي · 1 سا · OANDA</span>
        <span style={{ color: '#ef4444' }}>O 3,991.415 &nbsp; H 3,991.765 &nbsp; L 3,985.240 &nbsp; C 3,986.675 &nbsp; -4.760 (-0.12%)</span>
      </div>
      {/* Actual chart container pushed below header */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', top: '30px', left: 0, right: 0, bottom: 0 }}
      />
    </div>
  );
};

export default TradingChart;
