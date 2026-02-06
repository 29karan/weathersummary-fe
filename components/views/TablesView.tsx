'use client';

import { useMemo, useState } from 'react';
import { Stack, Group, Text, ActionIcon, Badge, Paper, ThemeIcon, Divider, Tooltip } from '@mantine/core';
import { IconFileTypeCsv, IconJson, IconCalendar, IconMapPin, IconTemperature, IconCloudRain, IconSun, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useDashboardStore } from '@/lib/store';
import { MOCK_WEATHER_DATA } from '@/lib/mockWeatherData';
import { transformToTableRows, filterTableData, calculateSummaryStats } from '@/lib/dataFilters';
import { exportToCSV, exportToJSON } from '@/lib/exportUtils';
import { WeatherDataTable } from '@/components/tables/WeatherDataTable';

export function TablesView() {
  const { filters } = useDashboardStore();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Transform and filter data
  const tableData = useMemo(() => {
    const rows = transformToTableRows(MOCK_WEATHER_DATA);
    return filterTableData(rows, filters);
  }, [filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    return calculateSummaryStats(tableData);
  }, [tableData]);

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(tableData, `weather-data-${Date.now()}.csv`);
  };

  const handleExportJSON = () => {
    exportToJSON(tableData, `weather-data-${Date.now()}.json`);
  };

  if (stats.totalRecords === 0) {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">No data available for selected filters</Text>
      </Paper>
    );
  }

  return (
    <Group align="flex-start" gap="md" wrap="nowrap">
      {/* Main Table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <WeatherDataTable data={tableData} />
      </div>

      {/* Collapsible Stats Sidebar */}
      <Paper
        p={sidebarExpanded ? 'md' : 'xs'}
        radius="md"
        withBorder
        style={{
          width: sidebarExpanded ? 240 : 60,
          transition: 'width 200ms ease',
          position: 'sticky',
          top: 16,
        }}
      >
        <Stack gap="md">
          {/* Header with Export Icons and Toggle */}
          <Group justify="space-between" wrap="nowrap">
            {sidebarExpanded && <Text size="xs" fw={600}>Summary</Text>}
            <Group gap={4} ml="auto">
              <Tooltip label="Export CSV" position="left">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={handleExportCSV}
                  color="blue"
                >
                  <IconFileTypeCsv size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Export JSON" position="left">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={handleExportJSON}
                  color="grape"
                >
                  <IconJson size={16} />
                </ActionIcon>
              </Tooltip>
              <Divider orientation="vertical" />
              <Tooltip label={sidebarExpanded ? 'Collapse' : 'Expand Stats'} position="left">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                >
                  {sidebarExpanded ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          {/* Collapsed: Icon-only view */}
          {!sidebarExpanded && (
            <Stack gap="md" align="center">
              <Tooltip label={`${stats.totalRecords} records`} position="left">
                <ThemeIcon variant="light" size="lg">
                  <IconCalendar size={20} />
                </ThemeIcon>
              </Tooltip>

              <Tooltip label={`${stats.regions.length} regions`} position="left">
                <ThemeIcon variant="light" size="lg" color="teal">
                  <IconMapPin size={20} />
                </ThemeIcon>
              </Tooltip>

              <Tooltip label={`${stats.averages.temperatureMean}°C avg`} position="left">
                <ThemeIcon variant="light" size="lg" color="orange">
                  <IconTemperature size={20} />
                </ThemeIcon>
              </Tooltip>

              <Tooltip label={`${stats.averages.rainfall}mm avg`} position="left">
                <ThemeIcon variant="light" size="lg" color="blue">
                  <IconCloudRain size={20} />
                </ThemeIcon>
              </Tooltip>

              <Tooltip label={`${stats.averages.sunshine}hrs avg`} position="left">
                <ThemeIcon variant="light" size="lg" color="yellow">
                  <IconSun size={20} />
                </ThemeIcon>
              </Tooltip>
            </Stack>
          )}

          {/* Expanded: Full stats */}
          {sidebarExpanded && (
            <>
              <Divider />

              <div>
                <Group gap="xs" mb="xs">
                  <IconCalendar size={14} />
                  <Text size="xs" c="dimmed">Records</Text>
                </Group>
                <Text size="lg" fw={700}>{stats.totalRecords}</Text>
              </div>

              <div>
                <Group gap="xs" mb="xs">
                  <IconMapPin size={14} />
                  <Text size="xs" c="dimmed">Regions</Text>
                </Group>
                <Badge variant="light" color="teal">
                  {stats.regions.length}
                </Badge>
              </div>

              <Divider />

              <div>
                <Text size="xs" fw={600} mb="xs">Averages</Text>
                <Stack gap="xs">
                  <div>
                    <Group gap={4} mb={2}>
                      <IconTemperature size={12} />
                      <Text size="xs" c="dimmed">Temp</Text>
                    </Group>
                    <Text size="sm" fw={600} c="orange">
                      {stats.averages.temperatureMean}°C
                    </Text>
                  </div>

                  <div>
                    <Group gap={4} mb={2}>
                      <IconCloudRain size={12} />
                      <Text size="xs" c="dimmed">Rain</Text>
                    </Group>
                    <Text size="sm" fw={600} c="blue">
                      {stats.averages.rainfall}mm
                    </Text>
                  </div>

                  <div>
                    <Group gap={4} mb={2}>
                      <IconSun size={12} />
                      <Text size="xs" c="dimmed">Sun</Text>
                    </Group>
                    <Text size="sm" fw={600} c="yellow">
                      {stats.averages.sunshine}hrs
                    </Text>
                  </div>
                </Stack>
              </div>

              <Divider />

              <div>
                <Text size="xs" fw={600} mb="xs">Extremes</Text>
                <Stack gap="xs">
                  <div>
                    <Text size="xs" c="dimmed" mb={2}>Hottest</Text>
                    <Group gap={4}>
                      <Badge color="red" variant="light" size="xs">
                        {stats.extremes.hottestYear.year}
                      </Badge>
                      <Text size="xs" fw={600} c="red">
                        {stats.extremes.hottestYear.value}°C
                      </Text>
                    </Group>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed" mb={2}>Wettest</Text>
                    <Group gap={4}>
                      <Badge color="cyan" variant="light" size="xs">
                        {stats.extremes.wettestYear.year}
                      </Badge>
                      <Text size="xs" fw={600} c="cyan">
                        {stats.extremes.wettestYear.value}mm
                      </Text>
                    </Group>
                  </div>
                </Stack>
              </div>
            </>
          )}
        </Stack>
      </Paper>
    </Group>
  );
}
