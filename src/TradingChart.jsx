import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

// Function to generate realistic dummy OHLC data around the 4000 price point
const generateDummyData = () => {
  const data = [];
  // Start date: Jan 1, 2026
  let time = new Date(2026, 0, 1).getTime() / 1000;
  let currentPrice = 3950;
  
  for (let i = 0; i < 150; i++) {
    const volatility = 15;
    const open = currentPrice + (Math.random() - 0.5) * 10;
    const maxMove = Math.random() * volatility;
    const high = open + maxMove;
    const low = open - Math.random() * volatility;
    
    // Create a trend by subtly pushing close higher or lower
    const close = low + Math.random() * (high - low);
    
    data.push({ 
      time, 
      open: Number(open.toFixed(2)), 
      high: Number(high.toFixed(2)), 
      low: Number(low.toFixed(2)), 
      close: Number(close.toFixed(2)) 
    });
    
    time += 86400; // 1 day increment
    currentPrice = close;
  }
  return data;
};

export const TradingChart = ({ data, containerClassName = "" }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(data || generateDummyData());

  // Allow updating data dynamically if real data is passed
  useEffect(() => {
    if (data) setChartData(data);
  }, [data]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Dark Navy theme config matching the UI
    const chartOptions = {
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
        vertLine: {
          color: '#758696',
          width: 1,
          style: 1,
          labelBackgroundColor: '#758696',
        },
        horzLine: {
          color: '#758696',
          width: 1,
          style: 1,
          labelBackgroundColor: '#758696',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
      },
    };

    // Initialize chart
    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    // Add Candlestick Series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e', // Tailwind green-500
      downColor: '#ef4444', // Tailwind red-500
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    candlestickSeries.setData(chartData);
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    // Set initial size
    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
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
