'use client';

import { Checkbox, Text, Stack, Group, Badge } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import { useDashboardStore } from '@/lib/store';
import { METRIC_INFO } from '@/lib/constants';
import type { MetricType } from '@/types/weather';

export function MetricFilter() {
  const { filters, updateFilters } = useDashboardStore();

  const handleChange = (metric: MetricType, checked: boolean) => {
    const newMetrics = checked
      ? [...filters.metrics, metric]
      : filters.metrics.filter((m) => m !== metric);

    updateFilters({
      metrics: newMetrics,
    });
  };

  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <Group gap="xs">
          <IconChartBar size={18} />
          <Text size="sm" fw={600}>Metrics</Text>
        </Group>
        <Badge size="sm" variant="light" color="grape">
          {filters.metrics.length}
        </Badge>
      </Group>

      <Stack gap="xs">
        {Object.entries(METRIC_INFO).map(([key, metric]) => (
          <Checkbox
            key={key}
            label={
              <Text size="sm">
                {metric.icon} {metric.label}
              </Text>
            }
            checked={filters.metrics.includes(key as MetricType)}
            onChange={(e) => handleChange(key as MetricType, e.currentTarget.checked)}
            size="sm"
          />
        ))}
      </Stack>
    </Stack>
  );
}
