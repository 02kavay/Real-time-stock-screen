export interface StockRecord {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  dividendYield: number;
  beta: number;
  sma50: number;
  sma200: number;
  rsi14: number;
  sector: string;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface FilterState {
  minMarketCap?: number;
  maxMarketCap?: number;
  minPE?: number;
  maxPE?: number;
  minVolume?: number;
  sectors: string[];
  searchQuery: string;
}
