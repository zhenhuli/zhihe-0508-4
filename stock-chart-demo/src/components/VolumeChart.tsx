import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { StockData } from '../types';
import './VolumeChart.less';

interface VolumeChartProps {
  data: StockData[];
}

const VolumeChart: React.FC<VolumeChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="volume-tooltip">
          <p className="tooltip-date">{item.date}</p>
          <p>成交量: <span>{(item.volume / 1000000).toFixed(2)}M</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">成交量</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            interval={Math.floor(data.length / 8)}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => {
              const isUp = entry.close >= entry.open;
              const color = isUp ? '#ef4444' : '#22c55e';
              return (
                <Cell key={`cell-${index}`} fill={color} fillOpacity={0.7} />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;
