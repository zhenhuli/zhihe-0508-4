import { StockData, TimePeriod } from '../types';

const generateStockData = (days: number, basePrice: number = 150): StockData[] => {
  const data: StockData[] = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * currentPrice;
    const low = Math.min(open, close) - Math.random() * volatility * currentPrice;
    const volume = Math.floor(Math.random() * 50000000) + 10000000;

    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }

  return data;
};

const stockBasePrices: Record<string, number> = {
  AAPL: 180,
  GOOGL: 140,
  MSFT: 380,
  AMZN: 175,
  TSLA: 250,
  META: 480,
  NVDA: 850,
  BABA: 85,
};

const periodDays: Record<TimePeriod, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 252,
};

export const getStockData = (stockCode: string, period: TimePeriod): StockData[] => {
  const basePrice = stockBasePrices[stockCode] || 150;
  const days = periodDays[period];
  return generateStockData(days, basePrice);
};
