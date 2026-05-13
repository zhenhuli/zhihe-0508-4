export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Stock {
  code: string;
  name: string;
}

export type TimePeriod = '1D' | '1W' | '1M' | '3M' | '1Y';
