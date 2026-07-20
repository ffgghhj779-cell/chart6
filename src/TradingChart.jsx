import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

// Function to generate realistic dummy OHLC data around the 4000 price point
const generateDummyData = () => {
  const data = [];
  let currentDate = new Date(2026, 0, 1);
  let currentPrice = 3950;
  
  for (let i = 0; i < 150; i++) {
    const volatility = 15;
    const open = currentPrice + (Math.random() - 0.5) * 10;
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
      const chartOptions = {
        width: chartContainerRef.current.clientWidth || 600,
        height: chartContainerRef.current.clientHeight || 400,
        layout: {
          background: { type: ColorType.Solid, color: '#051024' },
          textColor: '#d1d5db',
          attributionLogo: false,
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        crosshair: {
          vertLine: { color: '#758696', width: 1, style: 1, labelBackgroundColor: '#758696' },
          horzLine: { color: '#758696', width: 1, style: 1, labelBackgroundColor: '#758696' },
        },
        rightPriceScale: { borderColor: 'rgba(255, 255, 255, 0.1)' },
        timeScale: { borderColor: 'rgba(255, 255, 255, 0.1)', timeVisible: true },
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
      className={`w-full h-full relative ${containerClassName}`} 
    />
  );
};

export default TradingChart;
