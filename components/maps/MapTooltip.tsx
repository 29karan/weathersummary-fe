'use client';

import { Paper, Text, Badge, Stack } from '@mantine/core';
import type { RegionMapData } from '@/lib/mapUtils';
import { getMetricInfo } from '@/lib/mapUtils';
import type { MetricType } from '@/types/weather';

interface MapTooltipProps {
  data: RegionMapData;
  metric: MetricType;
  x: number;
  y: number;
}

export function MapTooltip({ data, metric, x, y }: MapTooltipProps) {
  const { unit } = getMetricInfo(metric);

  return (
    <Paper
      p="xs"
      radius="md"
      withBorder
      shadow="md"
      style={{
        position: 'fixed',
        left: x + 10,
        top: y + 10,
        pointerEvents: 'none',
        zIndex: 1000,
        minWidth: 150,
      }}
    >
      <Stack gap={4}>
        <Text size="sm" fw={600}>
          {data.regionName}
        </Text>
        <Text size="lg" fw={700} c="blue">
          {data.value} {unit}
        </Text>
        <Badge size="xs" variant="light">
          Rank: {data.rank} of 14
        </Badge>
      </Stack>
    </Paper>
  );
}
