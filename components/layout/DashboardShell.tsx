'use client';

import { AppShell, Group, Title, Tabs, ActionIcon, Box, Tooltip, Stack, Indicator, Text, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTable, IconMap, IconChartBar, IconFilter, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useDashboardStore } from '@/lib/store';

interface DashboardShellProps {
  children: React.ReactNode;
  filters: React.ReactNode;
}

export function DashboardShell({ children, filters }: DashboardShellProps) {
  // Sidebar collapsed by default
  const [sidebarExpanded, { toggle: toggleSidebar }] = useDisclosure(false);
  const { activeView, setActiveView, filters: filterState } = useDashboardStore();

  // Count active filters
  const activeFilterCount = 
    (filterState.regions.length > 0 ? 1 : 0) +
    (filterState.metrics.length > 0 ? 1 : 0) +
    ((filterState.yearRange.end - filterState.yearRange.start) < 116 ? 1 : 0);

  return (
    <AppShell 
      padding="md"
      navbar={{
        width: sidebarExpanded ? 320 : 60,
        breakpoint: 0,
      }}
    >
      {/* Expandable Sidebar */}
      <AppShell.Navbar 
        p="md" 
        style={{ 
          borderRight: '1px solid var(--mantine-color-gray-3)',
          transition: 'width 200ms ease'
        }}
      >
        <Stack gap="md" h="100%">
          {/* Header with Toggle */}
          <Group justify="space-between">
            {sidebarExpanded && (
              <Group gap="xs">
                <IconFilter size={18} />
                <Text size="sm" fw={600}>Filters</Text>
                {activeFilterCount > 0 && (
                  <Indicator inline label={activeFilterCount} size={16} color="blue" />
                )}
              </Group>
            )}
            
            <Tooltip label={sidebarExpanded ? "Collapse" : "Expand Filters"} position="right" withArrow>
              <ActionIcon
                variant="light"
                size="md"
                onClick={toggleSidebar}
                color="blue"
              >
                {sidebarExpanded ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
              </ActionIcon>
            </Tooltip>
          </Group>

          {/* Collapsed: Icon-only view */}
          {!sidebarExpanded && (
            <Stack gap="md" align="center" mt="md">
              <Tooltip label="Click to expand filters" position="right" withArrow>
                <Indicator 
                  inline 
                  label={activeFilterCount > 0 ? activeFilterCount : null}
                  size={16}
                  color="blue"
                  disabled={activeFilterCount === 0}
                  offset={7}
                >
                  <ActionIcon
                    variant="light"
                    size="lg"
                    onClick={toggleSidebar}
                    color="blue"
                  >
                    <IconFilter size={20} />
                  </ActionIcon>
                </Indicator>
              </Tooltip>
            </Stack>
          )}

          {/* Expanded: Full filters */}
          {sidebarExpanded && (
            <>
              <Divider />
              <Box style={{ flex: 1, overflowY: 'auto' }}>
                {filters}
              </Box>
            </>
          )}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {/* Compact Header with Tabs */}
        <Box mb="lg">
          <Group justify="center" mb="sm">
            <Title order={2} size="h3" style={{ 
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              UK Weather Dashboard
            </Title>
          </Group>

          {/* Tabs */}
          <Tabs
            value={activeView}
            onChange={(value: string | null) => value && setActiveView(value as 'tables' | 'maps' | 'charts')}
          >
            <Tabs.List>
              <Tabs.Tab value="tables" leftSection={<IconTable size={16} />}>
                Data Tables
              </Tabs.Tab>
              <Tabs.Tab value="maps" leftSection={<IconMap size={16} />}>
                Maps
              </Tabs.Tab>
              <Tabs.Tab value="charts" leftSection={<IconChartBar size={16} />}>
                Charts
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Box>

        {/* Content */}
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
