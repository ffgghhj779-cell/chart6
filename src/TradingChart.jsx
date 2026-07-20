import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

// Generate realistic dummy OHLC data
const generateDummyData = () => {
  const data = [];
  let currentDate = new Date(2026, 0, 1);
  let currentPrice = 4220;

  for (let i = 0; i < 150; i++) {
    let moveBias = (Math.random() - 0.5) * 10;
    if (i < 70) moveBias -= 4;
    else moveBias += 4;

    const open = currentPrice + moveBias;
    const high = open + Math.random() * 20;
    const low = open - Math.random() * 20;
    const close = low + Math.random() * (high - low);

    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');

    data.push({
      time: `${y}-${m}-${d}`,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    });

    currentDate.setDate(currentDate.getDate() + 1);
    currentPrice = close;
  }
  return data;
};

const CHART_DATA = generateDummyData();

export const TradingChart = ({ data }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = createChart(el, {
      width: el.offsetWidth || 600,
      height: el.offsetHeight || 390,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333333',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(0,0,0,0.04)' },
        horzLines: { color: 'rgba(0,0,0,0.04)' },
      },
      crosshair: {
        vertLine: { color: '#758696', labelBackgroundColor: '#758696' },
        horzLine: { color: '#758696', labelBackgroundColor: '#758696' },
      },
      rightPriceScale: { borderColor: 'rgba(0,0,0,0.1)' },
      timeScale: { borderColor: 'rgba(0,0,0,0.1)', timeVisible: false },
    });

    // lightweight-charts v5 API: addSeries(SeriesClass, options)
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    series.setData(data || CHART_DATA);

    // Support & Resistance price lines
    series.createPriceLine({ price: 4104.0, color: '#f59e0b', lineWidth: 2, axisLabelVisible: true, title: 'مقاومة' });
    series.createPriceLine({ price: 4014.4, color: '#f59e0b', lineWidth: 2, axisLabelVisible: true, title: 'دعم' });
    series.createPriceLine({ price: 3945.0, color: '#8b5cf6', lineWidth: 2, axisLabelVisible: true, title: 'منطقة طلب' });

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
  }, [data]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Top info bar mimicking TradingView header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '26px',
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', padding: '0 8px',
        fontSize: '10px', color: '#6b7280', gap: '8px',
        zIndex: 10, pointerEvents: 'none', direction: 'rtl',
      }}>
        <span>TradingView.com · يوليو 17, 2026 · UTC+1</span>
        <span>الذهب / دولار أمريكي · OANDA · 1 ساعة</span>
        <span style={{ color: '#ef4444' }}>O 3,991.415 &nbsp; H 3,991.765 &nbsp; L 3,985.240 &nbsp; C 3,986.675 &nbsp; -4.760 (-0.12%)</span>
      </div>
      {/* Actual chart container pushed below header */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', top: '26px', left: 0, right: 0, bottom: 0 }}
      />
    </div>
  );
};

export default TradingChart;
