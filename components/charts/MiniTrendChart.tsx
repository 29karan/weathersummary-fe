import { useMemo } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Bar,
  ComposedChart,
  ReferenceArea
} from 'recharts';
import { Paper, Text, } from '@mantine/core';

interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartReferenceArea {
    x1: string;
    x2: string;
    color: string;
    label: string;
    opacity?: number;
}

interface MiniTrendChartProps {
  data: ChartDataPoint[];
  metricName: string;
  unit: string;
  color: string;
  type?: 'line' | 'area' | 'bar';
  height?: number;
  hideAxis?: boolean;
  comparisonSeries?: {
      data: ChartDataPoint[];
      color: string;
      label: string;
  }[];
  referenceAreas?: ChartReferenceArea[];
}

export function MiniTrendChart({
  data,
  metricName,
  unit,
  color,
  type = 'line',
  height = 150,
  hideAxis = false,
  comparisonSeries = [],
  referenceAreas = []
}: MiniTrendChartProps) {
  
  // Merge data for Recharts (Recharts likes single array with multiple keys)
  const mergedData = useMemo(() => {
    if (!data) return [];
    return data.map((point, index) => {
        const mergedPoint: { [key: string]: number | string } = { ...point, value: point.value };
        
        comparisonSeries.forEach((series, i) => {
             const compPoint = series.data[index];
             if (compPoint) {
                 mergedPoint[`comp_${i}`] = compPoint.value;
             }
        });
        return mergedPoint;
    });
  }, [data, comparisonSeries]);

  if (!data || data.length === 0) {
    return (
      <Paper h={height} flex={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text c="dimmed" size="sm">No data available</Text>
      </Paper>
    );
  }

  const DataComponent = type === 'line' ? Line : type === 'area' ? Area : Bar;

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={mergedData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <defs>
                <linearGradient id={`gradient-${metricName}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
                {comparisonSeries.map((series, i) => (
                    <linearGradient key={i} id={`gradient-comp-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={series.color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={series.color} stopOpacity={0} />
                    </linearGradient>
                ))}
            </defs>

         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
         {!hideAxis && <XAxis dataKey="label" hide={false} tick={{ fontSize: 10 }} interval={2} />}
         {!hideAxis && <YAxis hide={true} domain={['auto', 'auto']} />}
         <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            labelStyle={{ fontWeight: 600, color: '#444', marginBottom: '4px' }}
            formatter={(value: number | undefined, name: string | undefined) => {
                 if (value === undefined || name === undefined) return ['', ''];
                 if (name === "value") {
                  return [Number(value).toFixed(1) + (unit ? ` ${unit}` : ''), metricName];
                 }
                 // Find which series this belongs to
                 if (typeof name === 'string' && name.startsWith('comp_')) {
                     const index = parseInt(name.split('_')[1]);
                     const series = comparisonSeries[index];
                     return [`${value} ${unit}`, series?.label || 'Comparison'];
                 }
                 return [value, name];
            }}
         />
         
         {referenceAreas.map((ref, i) => (
            <ReferenceArea 
                key={i} 
                x1={ref.x1} 
                x2={ref.x2} 
                fill={ref.color} 
                fillOpacity={ref.opacity || 0.1}
                label={{ 
                    value: ref.label, 
                    position: 'insideTop', 
                    fill: '#333', 
                    fontSize: 11,
                    fontWeight: 600,
                    style: { textShadow: '0px 0px 4px white' }
                }}
                ifOverflow="extendDomain"
            />
         ))}
         
         <DataComponent
            name="value" // Allows identifying primary series
            type="monotone"
            dataKey="value"
            stroke={type === 'bar' ? undefined : color}
            fill={type === 'area' ? `url(#gradient-${metricName})` : color}
            strokeWidth={type === 'bar' ? 0 : 2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          
          {comparisonSeries.map((series, i) => (
               <DataComponent
                    key={i}
                    name={`comp_${i}`} // Internal ID for tooltips
                    type="monotone"
                    dataKey={`comp_${i}`}
                    stroke={type === 'bar' ? undefined : series.color}
                    fill={type === 'area' ? `url(#gradient-comp-${i})` : series.color}
                    strokeWidth={type === 'bar' ? 0 : 2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    strokeDasharray={type === 'line' ? "4 4" : undefined}
                    opacity={0.8}
               />
          ))}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
