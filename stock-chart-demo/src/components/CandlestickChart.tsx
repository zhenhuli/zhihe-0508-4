import React from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { StockData } from '../types';
import './CandlestickChart.less';

interface CandlestickChartProps {
  data: StockData[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="tooltip">
          <p className="tooltip-date">{item.date}</p>
          <p>开盘: <span>${item.open}</span></p>
          <p>最高: <span>${item.high}</span></p>
          <p>最低: <span>${item.low}</span></p>
          <p>收盘: <span>${item.close}</span></p>
        </div>
      );
    }
    return null;
  };

  const minPrice = Math.min(...data.map(d => d.low)) * 0.99;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.01;

  return (
    <div className="chart-container">
      <h3 className="chart-title">K 线图 (OHLC)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
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
          <Area 
            type="monotone" 
            dataKey="high" 
            stroke="#ef4444" 
            fill="#ef4444" 
            fillOpacity={0.1}
            strokeWidth={1}
            dot={false}
            name="最高价"
          />
          <Area 
            type="monotone" 
            dataKey="low" 
            stroke="#22c55e" 
            fill="#22c55e" 
            fillOpacity={0.1}
            strokeWidth={1}
            dot={false}
            name="最低价"
          />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            name="收盘价"
          />
          <Line 
            type="monotone" 
            dataKey="open" 
            stroke="#f59e0b" 
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            name="开盘价"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandlestickChart;
