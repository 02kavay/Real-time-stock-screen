import { Candle } from '../types';

export function calculateSMA(data: Candle[], period: number) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
}

export function calculateEMA(data: Candle[], period: number) {
  const result = [];
  const k = 2 / (period + 1);
  let ema = data[0].close;

  for (let i = 0; i < data.length; i++) {
    ema = (data[i].close - ema) * k + ema;
    if (i >= period - 1) {
      result.push({ time: data[i].time, value: ema });
    }
  }
  return result;
}

export function calculateRSI(data: Candle[], period: number) {
  const result = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change > 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period; i < data.length; i++) {
    if (i > period) {
      const change = data[i].close - data[i - 1].close;
      avgGain = (avgGain * (period - 1) + (change > 0 ? change : 0)) / period;
      avgLoss = (avgLoss * (period - 1) + (change < 0 ? -change : 0)) / period;
    }

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    result.push({ time: data[i].time, value: rsi });
  }

  return result;
}

export function calculateMACD(data: Candle[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  const macdLine = [];
  const slowMap = new Map(slowEMA.map((e) => [e.time, e.value]));

  for (const fast of fastEMA) {
    const slowVal = slowMap.get(fast.time);
    if (slowVal !== undefined) {
      macdLine.push({ time: fast.time, close: fast.value - slowVal }); // Mocking Candle structure for EMA
    }
  }

  const signalLine = calculateEMA(macdLine, signalPeriod);
  const signalMap = new Map(signalLine.map((s) => [s.time, s.value]));

  const result = macdLine.map((m) => ({
    time: m.time,
    macd: m.close,
    signal: signalMap.get(m.time) || 0,
    histogram: m.close - (signalMap.get(m.time) || 0),
  }));

  return result;
}

export function calculateBollingerBands(data: Candle[], period = 20, stdDev = 2) {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const sma = sum / period;

    let varianceSum = 0;
    for (let j = 0; j < period; j++) {
      varianceSum += Math.pow(data[i - j].close - sma, 2);
    }
    const standardDeviation = Math.sqrt(varianceSum / period);

    result.push({
      time: data[i].time,
      middle: sma,
      upper: sma + standardDeviation * stdDev,
      lower: sma - standardDeviation * stdDev,
    });
  }
  return result;
}
