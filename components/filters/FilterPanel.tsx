'use client';

import { Button, Stack, Divider } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useDashboardStore } from '@/lib/store';
import { YearRangeFilter } from './YearRangeFilter';
import { RegionFilter } from './RegionFilter';
import { MetricFilter } from './MetricFilter';

export function FilterPanel() {
  const { resetFilters } = useDashboardStore();

  return (
    <Stack gap="lg">
      <YearRangeFilter />
      <Divider />
      <RegionFilter />
      <Divider />
      <MetricFilter />
      <Divider />
      
      {/* Reset Button */}
      <Button
        variant="light"
        color="gray"
        leftSection={<IconRefresh size={16} />}
        onClick={resetFilters}
        fullWidth
      >
        Reset All Filters
      </Button>
    </Stack>
  );
}
