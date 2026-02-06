'use client';

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Text } from '@mantine/core';

export interface ComboChartDataPoint {
  label: string;
  tempMax: number;
  tempMin: number;
  rainfall: number;
}

interface WeatherComboChartProps {
  data: ComboChartDataPoint[];
  height?: number;
}

export function WeatherComboChart({ data, height = 300 }: WeatherComboChartProps) {

  if (!data || data.length === 0) {
    return (
      <Paper h={height} flex={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text c="dimmed">No data available</Text>
      </Paper>
    );
  }

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="#f5f5f5" vertical={false} />
          <XAxis 
            dataKey="label" 
            scale="point" 
            padding={{ left: 10, right: 10 }} 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          {/* Left Axis: Temperature */}
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#ef4444"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fill: '#ef4444', fontSize: 11 }}
            domain={['auto', 'auto']}
          />
          {/* Right Axis: Rainfall */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#3b82f6"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Rain (mm)', angle: 90, position: 'insideRight', fill: '#3b82f6', fontSize: 11 }}
          />
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          
          <Bar yAxisId="right" dataKey="rainfall" barSize={20} fill="#3b82f6" name="Rainfall" radius={[4, 4, 0, 0]} opacity={0.6} />
          <Line yAxisId="left" type="monotone" dataKey="tempMax" stroke="#ef4444" strokeWidth={2} dot={false} name="Max Temp" />
          <Line yAxisId="left" type="monotone" dataKey="tempMin" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Min Temp" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
