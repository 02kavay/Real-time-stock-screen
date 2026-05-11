"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { useScreenerStore } from '../../store/useScreenerStore';
import { generateMockCandles } from '../../utils/mockData';
import { calculateSMA, calculateEMA, calculateBollingerBands, calculateMACD, calculateRSI } from '../../utils/indicators';

type IndicatorType = 'SMA' | 'EMA' | 'BB' | 'MACD' | 'RSI';

export function Chart() {
  const selectedStock = useScreenerStore(state => state.selectedStock);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const rsiSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  
  const [activeIndicators, setActiveIndicators] = useState<IndicatorType[]>(['SMA', 'EMA']);

  useEffect(() => {
    if (!chartContainerRef.current || !selectedStock) return;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });
    seriesRef.current = candlestickSeries;

    // Generate specific data for the selected stock
    const data = generateMockCandles(selectedStock.price, 365);
    candlestickSeries.setData(data as any);

    // Calculate Indicators
    if (activeIndicators.includes('SMA')) {
      const smaData = calculateSMA(data, 50);
      const smaSeries = chart.addLineSeries({ color: '#3b82f6', lineWidth: 2, title: 'SMA 50' });
      smaSeries.setData(smaData as any);
      smaSeriesRef.current = smaSeries;
    }

    if (activeIndicators.includes('EMA')) {
      const emaData = calculateEMA(data, 20);
      const emaSeries = chart.addLineSeries({ color: '#f59e0b', lineWidth: 2, title: 'EMA 20' });
      emaSeries.setData(emaData as any);
      emaSeriesRef.current = emaSeries;
    }

    if (activeIndicators.includes('BB')) {
      const bbData = calculateBollingerBands(data, 20, 2);
      const upperSeries = chart.addLineSeries({ color: 'rgba(16, 185, 129, 0.5)', lineWidth: 1 });
      const lowerSeries = chart.addLineSeries({ color: 'rgba(239, 68, 68, 0.5)', lineWidth: 1 });
      upperSeries.setData(bbData.map(d => ({ time: d.time, value: d.upper })) as any);
      lowerSeries.setData(bbData.map(d => ({ time: d.time, value: d.lower })) as any);
    }
    
    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [selectedStock, activeIndicators]);

  const toggleIndicator = (indicator: IndicatorType) => {
    setActiveIndicators(prev => 
      prev.includes(indicator) ? prev.filter(i => i !== indicator) : [...prev, indicator]
    );
  };

  if (!selectedStock) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
        Select a stock to view its chart
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <div className="ticker-info">
          <span className="ticker-symbol">{selectedStock.symbol}</span>
          <span className="ticker-name">{selectedStock.name}</span>
          <span className="ticker-price">${selectedStock.price.toFixed(2)}</span>
          <span className={`ticker-change ${selectedStock.change >= 0 ? 'text-green' : 'text-red'}`}>
            {selectedStock.change > 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="toolbar">
          {(['SMA', 'EMA', 'BB'] as IndicatorType[]).map(ind => (
            <button 
              key={ind}
              className={`toolbar-btn ${activeIndicators.includes(ind) ? 'active' : ''}`}
              onClick={() => toggleIndicator(ind)}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} style={{ width: '100%', height: 'calc(100% - 65px)' }} />
    </div>
  );
}
