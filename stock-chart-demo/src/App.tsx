import React, { useState, useEffect, useMemo } from 'react';
import CandlestickChart from './components/CandlestickChart';
import VolumeChart from './components/VolumeChart';
import TrendChart from './components/TrendChart';
import { getStockData } from './data/mockData';
import { stockList } from './data/stockList';
import { StockData, TimePeriod } from './types';
import './App.less';

const App: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [period, setPeriod] = useState<TimePeriod>('1M');
  const [data, setData] = useState<StockData[]>([]);

  useEffect(() => {
    const stockData = getStockData(selectedStock, period);
    setData(stockData);
  }, [selectedStock, period]);

  const stockInfo = useMemo(() => {
    return stockList.find(s => s.code === selectedStock);
  }, [selectedStock]);

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const latest = data[data.length - 1];
    const first = data[0];
    const change = latest.close - first.open;
    const changePercent = (change / first.open) * 100;
    const isUp = change >= 0;
    const totalVolume = data.reduce((sum, d) => sum + d.volume, 0);

    return {
      latestPrice: latest.close,
      change,
      changePercent,
      isUp,
      totalVolume,
      high: Math.max(...data.map(d => d.high)),
      low: Math.min(...data.map(d => d.low)),
    };
  }, [data]);

  const periods: TimePeriod[] = ['1D', '1W', '1M', '3M', '1Y'];

  return (
    <div className="app">
      <header className="header">
        <h1>📈 股票行情可视化</h1>
      </header>

      <main className="main">
        <div className="controls">
          <div className="control-group">
            <label>选择股票:</label>
            <select 
              value={selectedStock} 
              onChange={(e) => setSelectedStock(e.target.value)}
              className="select"
            >
              {stockList.map(stock => (
                <option key={stock.code} value={stock.code}>
                  {stock.code} - {stock.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>时间周期:</label>
            <div className="period-buttons">
              {periods.map(p => (
                <button
                  key={p}
                  className={`period-btn ${period === p ? 'active' : ''}`}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {stats && (
          <div className="stats-panel">
            <div className="stock-info">
              <h2>{stockInfo?.code}</h2>
              <span className="stock-name">{stockInfo?.name}</span>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">最新价</span>
                <span className="stat-value">${stats.latestPrice.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">涨跌幅</span>
                <span className={`stat-value ${stats.isUp ? 'up' : 'down'}`}>
                  {stats.isUp ? '+' : ''}{stats.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">最高价</span>
                <span className="stat-value">${stats.high.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">最低价</span>
                <span className="stat-value">${stats.low.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">总成交量</span>
                <span className="stat-value">{(stats.totalVolume / 100000000).toFixed(2)}亿</span>
              </div>
            </div>
          </div>
        )}

        <div className="charts-container">
          <TrendChart data={data} />
          <CandlestickChart data={data} />
          <VolumeChart data={data} />
        </div>
      </main>

      <footer className="footer">
        <p>数据仅供演示，不构成投资建议</p>
      </footer>
    </div>
  );
};

export default App;
