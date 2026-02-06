'use client';

import { Paper, Text, Group, Box } from '@mantine/core';
import type { MetricType } from '@/types/weather';
import { getMetricInfo } from '@/lib/mapUtils';

interface MapLegendProps {
  metric: MetricType;
  min: number;
  max: number;
  colorScale: (value: number) => string;
}

export function MapLegend({ metric, min, max, colorScale }: MapLegendProps) {
  const { name, unit } = getMetricInfo(metric);

  // Generate gradient stops
  const stops = 10;
  const gradientStops = Array.from({ length: stops }, (_, i) => {
    const value = min + (i / (stops - 1)) * (max - min);
    const color = colorScale(value);
    const percent = (i / (stops - 1)) * 100;
    return `${color} ${percent}%`;
  }).join(', ');

  return (
    <Paper
      p="sm"
      radius="md"
      withBorder
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        minWidth: 200,
      }}
    >
      <Text size="xs" fw={600} mb="xs">
        {name}
      </Text>

      {/* Gradient Bar */}
      <Box
        style={{
          height: 20,
          borderRadius: 4,
          background: `linear-gradient(to right, ${gradientStops})`,
          border: '1px solid var(--mantine-color-gray-3)',
        }}
      />

      {/* Min/Max Labels */}
      <Group justify="space-between" mt={4}>
        <Text size="xs" c="dimmed">
          {min.toFixed(1)} {unit}
        </Text>
        <Text size="xs" c="dimmed">
          {max.toFixed(1)} {unit}
        </Text>
      </Group>
    </Paper>
  );
}
