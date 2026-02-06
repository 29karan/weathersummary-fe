'use client';

import { MultiSelect, Text, Stack, Group, Badge } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { useDashboardStore } from '@/lib/store';
import { UK_REGIONS } from '@/lib/constants';

export function RegionFilter() {
  const { filters, updateFilters } = useDashboardStore();

  const regionOptions = Object.values(UK_REGIONS).map((region) => ({
    value: region.id,
    label: region.name,
  }));

  const handleChange = (values: string[]) => {
    updateFilters({
      regions: values,
    });
  };

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Group gap="xs">
          <IconMapPin size={18} />
          <Text size="sm" fw={600}>Regions</Text>
        </Group>
        <Badge size="sm" variant="light" color="teal">
          {filters.regions.length || 'All'}
        </Badge>
      </Group>

      <MultiSelect
        data={regionOptions}
        value={filters.regions}
        onChange={handleChange}
        placeholder="Select regions..."
        searchable
        clearable
        maxDropdownHeight={200}
        size="sm"
        comboboxProps={{ withinPortal: false }}
      />
    </Stack>
  );
}
