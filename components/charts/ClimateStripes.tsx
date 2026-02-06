'use client';

import { Box, Tooltip } from '@mantine/core';
import { useMemo } from 'react';

interface ClimateStripesProps {
  data: { label: string; value: number }[];
  height?: number;
}

export function ClimateStripes({ data, height = 100 }: ClimateStripesProps) {
  
  // Calculate stats for deviation
  const { mean, min, max } = useMemo(() => {
    if (!data.length) return { mean: 0, min: 0, max: 0 };
    const values = data.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    return {
        mean: sum / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
    };
  }, [data]);

  // Determine color based on deviation
  const getStripeColor = (value: number) => {
    const deviation = value - mean;
    const maxShift = Math.max(Math.abs(max - mean), Math.abs(min - mean));
    const intensity = Math.min(Math.abs(deviation) / maxShift, 1);
    
    // Diverging scale: Blue (Cold) -> White (Avg) -> Red (Hot)
    // Using HSL for easier intensity manipulation
    if (deviation < 0) {
        // Blue shades (210 hue)
        // Lightness: 90% (avg) -> 40% (extreme cold)
        const l = 90 - (intensity * 50);
        return `hsl(210, 80%, ${l}%)`;
    } else {
        // Red shades (0 hue)
        // Lightness: 90% (avg) -> 40% (extreme hot)
        const l = 90 - (intensity * 50);
        return `hsl(0, 80%, ${l}%)`;
    }
  };

  return (
    <Box 
        h={height} 
        w="100%" 
        style={{ display: 'flex', overflow: 'hidden' }}
    >
      {data.map((d) => (
        <Tooltip 
            key={d.label} 
            label={`${d.label}: ${d.value} (${(d.value - mean) > 0 ? '+' : ''}${(d.value - mean).toFixed(1)})`}
            openDelay={100}
        >
            <div 
                style={{ 
                    flex: 1, 
                    height: '100%', 
                    backgroundColor: getStripeColor(d.value),
                    transition: 'opacity 0.2s',
                    cursor: 'crosshair',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            />
        </Tooltip>
      ))}
    </Box>
  );
}
