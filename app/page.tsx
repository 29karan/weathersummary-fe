'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { TablesView } from '@/components/views/TablesView';
import { MapsView } from '@/components/views/MapsView';
import { useActiveView } from '@/lib/store';
import { Paper, Title, Text, List, ThemeIcon, Stack } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';


function ChartsView() {
  return (
    <Paper shadow="md" p="xl" radius="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="sm" style={{ 
            background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📈 Charts View
          </Title>
          <Text c="dimmed">Multiple chart types will be implemented here</Text>
        </div>
        
        <List
          spacing="sm"
          size="sm"
          center
          icon={
            <ThemeIcon color="grape" size={24} radius="xl">
              <IconCheck size={16} />
            </ThemeIcon>
          }
        >
          <List.Item>Line charts (trends)</List.Item>
          <List.Item>Bar charts (comparison)</List.Item>
          <List.Item>Heatmaps (patterns)</List.Item>
          <List.Item>Radar charts (multi-metric)</List.Item>
        </List>
      </Stack>
    </Paper>
  );
}

export default function DashboardPage() {
  const activeView = useActiveView();

  const renderView = () => {
    switch (activeView) {
      case 'tables':
        return <TablesView />;
      case 'maps':
        return <MapsView />;
      // case 'charts':
      //   return <ChartsView />;
      default:
        return <TablesView />;
    }
  };

  return (
    <DashboardShell filters={<FilterPanel />}>
      {renderView()}
    </DashboardShell>
  );
}
