'use client';

import { RangeSlider, Text, Stack, Group, Badge } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { useDashboardStore } from '@/lib/store';

export function YearRangeFilter() {
  const { filters, updateFilters } = useDashboardStore();
  const [start, end] = [filters.yearRange.start, filters.yearRange.end];

  const handleChange = (value: [number, number]) => {
    updateFilters({
      yearRange: { start: value[0], end: value[1] },
    });
  };

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Group gap="xs">
          <IconCalendar size={18} />
          <Text size="sm" fw={600}>Year Range</Text>
        </Group>
        <Badge size="sm" variant="light" color="blue">
          {end - start + 1} years
        </Badge>
      </Group>

      <Group justify="space-between">
        <Text size="xs" c="dimmed" fw={500}>{start}</Text>
        <Text size="xs" c="dimmed" fw={500}>{end}</Text>
      </Group>

      <RangeSlider
        min={1910}
        max={2026}
        step={1}
        value={[start, end]}
        onChange={handleChange}
        color="blue"
        size="sm"
      />
    </Stack>
  );
}
