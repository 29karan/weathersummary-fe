'use client';

import { Paper, Group, Text, Badge, Stack, SimpleGrid, ThemeIcon } from '@mantine/core';
import { IconCalendar, IconMapPin, IconChartBar, IconTemperature, IconCloudRain, IconSun } from '@tabler/icons-react';
import type { SummaryStatistics } from '@/lib/dataFilters';

interface SummaryStatsProps {
  stats: SummaryStatistics;
}

export function SummaryStats({ stats }: SummaryStatsProps) {
  if (stats.totalRecords === 0) {
    return (
      <Paper p="md" radius="md" withBorder mb="md">
        <Text c="dimmed" ta="center">No data available for selected filters</Text>
      </Paper>
    );
  }

  return (
    <Paper p="md" radius="md" withBorder mb="md">
      <Stack gap="md">
        {/* Overview */}
        <Group justify="space-between">
          <Group gap="xs">
            <ThemeIcon variant="light" size="lg">
              <IconChartBar size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">Total Records</Text>
              <Text size="lg" fw={600}>{stats.totalRecords}</Text>
            </div>
          </Group>

          <Group gap="xs">
            <ThemeIcon variant="light" size="lg" color="blue">
              <IconCalendar size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">Date Range</Text>
              <Text size="sm" fw={500}>
                {stats.dateRange.start} - {stats.dateRange.end}
              </Text>
            </div>
          </Group>

          <Group gap="xs">
            <ThemeIcon variant="light" size="lg" color="teal">
              <IconMapPin size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">Regions</Text>
              <Badge size="sm" variant="light" color="teal">
                {stats.regions.length}
              </Badge>
            </div>
          </Group>
        </Group>

        {/* Averages */}
        <SimpleGrid cols={3}>
          <Paper p="sm" withBorder>
            <Group gap="xs" mb="xs">
              <IconTemperature size={16} />
              <Text size="xs" c="dimmed">Avg Temperature</Text>
            </Group>
            <Text size="xl" fw={700} c="orange">
              {stats.averages.temperatureMean}°C
            </Text>
          </Paper>

          <Paper p="sm" withBorder>
            <Group gap="xs" mb="xs">
              <IconCloudRain size={16} />
              <Text size="xs" c="dimmed">Avg Rainfall</Text>
            </Group>
            <Text size="xl" fw={700} c="blue">
              {stats.averages.rainfall}mm
            </Text>
          </Paper>

          <Paper p="sm" withBorder>
            <Group gap="xs" mb="xs">
              <IconSun size={16} />
              <Text size="xs" c="dimmed">Avg Sunshine</Text>
            </Group>
            <Text size="xl" fw={700} c="yellow">
              {stats.averages.sunshine}hrs
            </Text>
          </Paper>
        </SimpleGrid>

        {/* Extremes */}
        <SimpleGrid cols={2}>
          <div>
            <Text size="xs" c="dimmed" mb="xs">Hottest Year</Text>
            <Group gap="xs">
              <Badge color="red" variant="light">
                {stats.extremes.hottestYear.year}
              </Badge>
              <Text size="sm">{stats.extremes.hottestYear.region}</Text>
              <Text size="sm" fw={600} c="red">
                {stats.extremes.hottestYear.value}°C
              </Text>
            </Group>
          </div>

          <div>
            <Text size="xs" c="dimmed" mb="xs">Coldest Year</Text>
            <Group gap="xs">
              <Badge color="blue" variant="light">
                {stats.extremes.coldestYear.year}
              </Badge>
              <Text size="sm">{stats.extremes.coldestYear.region}</Text>
              <Text size="sm" fw={600} c="blue">
                {stats.extremes.coldestYear.value}°C
              </Text>
            </Group>
          </div>

          <div>
            <Text size="xs" c="dimmed" mb="xs">Wettest Year</Text>
            <Group gap="xs">
              <Badge color="cyan" variant="light">
                {stats.extremes.wettestYear.year}
              </Badge>
              <Text size="sm">{stats.extremes.wettestYear.region}</Text>
              <Text size="sm" fw={600} c="cyan">
                {stats.extremes.wettestYear.value}mm
              </Text>
            </Group>
          </div>

          <div>
            <Text size="xs" c="dimmed" mb="xs">Driest Year</Text>
            <Group gap="xs">
              <Badge color="orange" variant="light">
                {stats.extremes.driestYear.year}
              </Badge>
              <Text size="sm">{stats.extremes.driestYear.region}</Text>
              <Text size="sm" fw={600} c="orange">
                {stats.extremes.driestYear.value}mm
              </Text>
            </Group>
          </div>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
