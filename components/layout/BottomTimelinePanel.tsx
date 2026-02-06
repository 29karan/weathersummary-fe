'use client';

import {
  Paper,
  Group,
  Stack,
  Text,
  Collapse,
  Button,
  SegmentedControl,
  Switch,
} from '@mantine/core';
import {
  IconChevronUp,
  IconChevronDown,
  IconChartInfographic,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { MiniTrendChart, ChartReferenceArea } from '@/components/charts/MiniTrendChart';
import { ClimateStripes } from '@/components/charts/ClimateStripes';
import { YearSlider } from '@/components/maps/YearSlider';
import { useMemo, useState } from 'react';
import type { MetricType, UKRegion } from '@/types/weather';
import { MOCK_WEATHER_DATA } from '@/lib/mockWeatherData';
import { getMetricInfo, getMetricValue } from '@/lib/mapUtils';
import { identifyExtremeEvents } from '@/lib/weatherUtils';

interface BottomTimelinePanelProps {
  selectedYear: number;
  selectedMetric: MetricType;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  selectedRegion: UKRegion | null;
}

export function BottomTimelinePanel({
  selectedYear,
  selectedMetric,
  onYearChange,
  isPlaying,
  onTogglePlay,
  selectedRegion,
}: BottomTimelinePanelProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const [mode, setMode] = useState<'line' | 'bar' | 'stripes'>('line');
  const [showEvents, setShowEvents] = useState(false);
  
  const metricInfo = getMetricInfo(selectedMetric);

  // Get historical trend data (All Years)
  // If region selected: Region's historical trend
  // If no region: UK average historical trend (Derived or Mocked)
  const [trendData, fullRawData] = useMemo(() => {
    // 1. Filter data for the relevant scope
    const targetData = MOCK_WEATHER_DATA.filter(d => 
        selectedRegion ? d.region === selectedRegion : d.region === 'uk'
    );

    // If no 'uk' region in mock data, use aggregation fallback (e.g. England SE)
    const displayData = targetData.length > 0 ? targetData : MOCK_WEATHER_DATA.filter(d => d.region === ('england_se' as UKRegion));
    
    const sorted = displayData.sort((a, b) => a.year - b.year);

    const formatted = sorted.map(d => ({
        label: d.year.toString(),
        value: getMetricValue(d, selectedMetric) || 0
    }));

    return [formatted, sorted];
  }, [selectedRegion, selectedMetric]);


  // Identify Extreme Events
  const referenceAreas = useMemo(() => {
    if (!showEvents || !fullRawData) return [];

    const events = identifyExtremeEvents(fullRawData, selectedMetric);
    
    return events.map(e => {
        let color = '#ccc';
        if (e.type === 'heatwave') color = '#ef4444'; // Red-500
        if (e.type === 'freeze') color = '#3b82f6';   // Blue-500
        if (e.type === 'storm') color = '#6366f1';    // Indigo-500
        if (e.type === 'drought') color = '#f59e0b';  // Amber-500

        return {
            x1: e.year.toString(),
            x2: e.year.toString(),
            color: color,
            label: e.label,
            opacity: 0.3 // Increased visibility
        } as ChartReferenceArea;
    });
  }, [fullRawData, selectedMetric, showEvents]);


  return (
    <Paper
      shadow="md"
      radius={0}
      withBorder={false}
      style={{ zIndex: 99, transition: 'all 0.3s ease' }}
    >
      {/* Header / Controls Bar */}
      <Group justify="space-between" p="md" bg="white">
        
        {/* Playback Controls & Slider */}
        <Group flex={1} mr="xl">
            <YearSlider
              year={selectedYear}
              minYear={1910} // Should ideally come from props or constants
              maxYear={2024}
              onYearChange={onYearChange}
              isPlaying={isPlaying}
              onPlayPause={onTogglePlay}
            />
        </Group>

        {/* Toggle Expansion */}
        <Button 
            variant="subtle" 
            size="sm" 
            onClick={toggle}
            rightSection={opened ? <IconChevronDown size={14} /> : <IconChevronUp size={14} />}
        >
            {opened ? 'Hide Analysis' : 'Show Timelines'}
        </Button>
      </Group>

      {/* Expanded Analysis Content */}
      <Collapse in={opened}>
        <Stack p="md" bg="gray.0" style={{ borderTop: '1px solid #eee' }}>
            <Group justify="space-between" mb="xs" align="center">
                <Group align="center" gap="lg">
                    <Group align="center" gap="xs">
                        <IconChartInfographic size={20} />
                        <Text fw={600}>
                            {selectedRegion ? `Historical Trend: ${selectedRegion}` : 'UK National Trend'} 
                            {' '}(1910 - 2024)
                        </Text>
                    </Group>

                    {/* Events Toggle */}
                    {mode !== 'stripes' && (
                        <Group gap="xs">
                             <Switch 
                                size="sm"
                                label={
                                    <Group gap={4}>
                                        <IconAlertTriangle size={14} />
                                        <Text size="xs">Show Highlights</Text>
                                    </Group>
                                }
                                checked={showEvents}
                                onChange={(e) => setShowEvents(e.currentTarget.checked)}
                             />
                        </Group>
                    )}
                </Group>
                
                <SegmentedControl 
                    size="xs"
                    value={mode}
                    onChange={(v: string) => setMode(v as 'line' | 'bar' | 'stripes')}
                    data={[
                        { label: 'Trend Line', value: 'line' },
                        { label: 'Bar Chart', value: 'bar' },
                        { label: 'Warming Stripes', value: 'stripes' }
                    ]}
                />
            </Group>
            
            <Paper p="sm" withBorder radius="md">
                {mode === 'stripes' ? (
                    <ClimateStripes 
                        data={trendData}
                        height={250}
                    />
                ) : (
                    <MiniTrendChart 
                        data={trendData}
                        metricName={metricInfo.name}
                        unit={metricInfo.unit}
                        color={mode === 'bar' ? '#3b82f6' : '#f59f00'}
                        type={mode as 'line' | 'bar'}
                        height={250}
                        referenceAreas={referenceAreas}
                    />
                )}
            </Paper>
        </Stack>
      </Collapse>
    </Paper>
  );
}
