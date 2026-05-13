import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { StockData } from '../types';
import './TrendChart.less';

interface TrendChartProps {
  data: StockData[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const prevClose = data[data.indexOf(item) - 1]?.close || item.open;
      const change = item.close - prevClose;
      const changePercent = ((change / prevClose) * 100).toFixed(2);
      const isUp = change >= 0;
      
      return (
        <div className="trend-tooltip">
          <p className="tooltip-date">{item.date}</p>
          <p>收盘价: <span>${item.close}</span></p>
          <p>
            涨跌: 
            <span className={isUp ? 'up' : 'down'}>
              {isUp ? '+' : ''}{change.toFixed(2)} ({isUp ? '+' : ''}{changePercent}%)
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const minPrice = Math.min(...data.map(d => d.low)) * 0.99;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.01;
  const startPrice = data[0]?.open || 0;

  return (
    <div className="chart-container">
      <h3 className="chart-title">涨跌趋势</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            interval={Math.floor(data.length / 8)}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={startPrice} stroke="#999" strokeDasharray="5 5" />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
