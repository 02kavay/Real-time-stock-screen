import { StockRecord, Candle } from '../types';

const SECTORS = ['Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 'Industrials', 'Energy', 'Utilities', 'Real Estate'];

function generateSymbol(index: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let sym = '';
  let i = index;
  while (i >= 0) {
    sym = chars[i % 26] + sym;
    i = Math.floor(i / 26) - 1;
  }
  return sym;
}

export function generateMockStocks(count: number): StockRecord[] {
  const stocks: StockRecord[] = [];
  for (let i = 0; i < count; i++) {
    const price = Math.random() * 500 + 10;
    const change = (Math.random() - 0.5) * 10;
    
    stocks.push({
      id: `stock_${i}`,
      symbol: generateSymbol(i),
      name: `Company ${i} Corp`,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(((change / price) * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 100000,
      marketCap: Math.floor(Math.random() * 2000000) * 1000000, // in millions
      peRatio: Number((Math.random() * 100 + 5).toFixed(2)),
      pbRatio: Number((Math.random() * 20 + 1).toFixed(2)),
      dividendYield: Number((Math.random() * 5).toFixed(2)),
      beta: Number((Math.random() * 2 + 0.5).toFixed(2)),
      sma50: Number((price * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2)),
      sma200: Number((price * (1 + (Math.random() - 0.5) * 0.2)).toFixed(2)),
      rsi14: Number((Math.random() * 100).toFixed(2)),
      sector: SECTORS[Math.floor(Math.random() * SECTORS.length)],
    });
  }
  return stocks;
}

export function generateMockCandles(basePrice: number, days: number): Candle[] {
  const candles: Candle[] = [];
  let currentPrice = basePrice;
  const now = new Date();
  
  for (let i = days; i > 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    const open = currentPrice;
    const volatility = currentPrice * 0.02;
    const high = open + Math.random() * volatility;
    const low = open - Math.random() * volatility;
    const close = low + Math.random() * (high - low);
    
    candles.push({
      time: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2))
    });
    
    currentPrice = close;
  }
  return candles;
}
