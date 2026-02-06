'use client';

import {
  Title,
  Text,
  Stack,
  Group,
  Badge,
  ThemeIcon,
  Divider,
  Paper,
  Box,
  ScrollArea,
  ActionIcon,
  SegmentedControl,
  Button
} from '@mantine/core';
import {
  IconMapPin,
  IconTrendingUp,
  IconChartBar,
  IconX,
  IconScale,
} from '@tabler/icons-react';
import type { UKRegion, MetricType, MetricData, MonthlyData, AnnualWeatherData } from '@/types/weather';
import { getMetricInfo, getMetricValue } from '@/lib/mapUtils';
import { MiniTrendChart } from '@/components/charts/MiniTrendChart';
import { WeatherComboChart } from '@/components/charts/WeatherComboChart';
import { useMemo, useState } from 'react';
import { MOCK_WEATHER_DATA } from '@/lib/mockWeatherData';

interface SideAnalysisPanelProps {
  opened: boolean;
  onClose: () => void;
  region: UKRegion | null;
  comparisonRegions?: UKRegion[]; // Changed to array
  onStartComparison?: () => void;
  onClearComparison?: () => void;
  year: number;
  metric: MetricType;
  colorScale: (value: number) => string;
}

export function SideAnalysisPanel({
  onClose,
  region,
  comparisonRegions = [], // Default to empty array
  onStartComparison,
  onClearComparison,
  year,
  metric,
  colorScale,
}: SideAnalysisPanelProps) {
  const metricInfo = getMetricInfo(metric);
  const regionName = region?.replace(/_/g, ' ').toUpperCase() || 'UK OVERVIEW';

  // Metrics colors for comparison (rotating palette)
  const comparisonColors = useMemo(() => ['#f97316', '#10b981', '#8b5cf6', '#ec4899'], []);

  // Get data for PRIMARY region/year
  const regionData = useMemo(() => {
    if (!region) return null;
    return MOCK_WEATHER_DATA.find((d) => d.region === region && d.year === year);
  }, [region, year]);

  // Get data for COMPARISON regions
  const comparisonDataList = useMemo(() => {
    return comparisonRegions.map(r => ({
        region: r,
        data: MOCK_WEATHER_DATA.find((d) => d.region === r && d.year === year)
    }));
  }, [comparisonRegions, year]);

  // Generate monthly trend data (Primary)
  const monthlyData = useMemo(() => {
    if (!regionData) return [];
    
    // We need month names
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Access the raw monthly data from the mock data based on the metric
    // if (metric === 'temperature_range') {
    //     return months.map(m => {
    //         const minObj = regionData['temperature_min'] as MetricData;
    //         const maxObj = regionData['temperature_max'] as MetricData;
    //         const key = m.toLowerCase() as keyof MonthlyData;
    //         const minVal = minObj?.[key];
    //         const maxVal = maxObj?.[key];
            
    //         return {
    //             label: m,
    //             value: (minVal !== undefined && maxVal !== undefined) ? Number((maxVal - minVal).toFixed(1)) : 0
    //         };
    //     });
    // }

    const metricKey = metric as keyof typeof regionData;
    const dataObj = regionData[metricKey] as MetricData;
    
    if (!dataObj) return [];

    return months.map(m => ({
        label: m,
        value: Number((dataObj[m.toLowerCase() as keyof MonthlyData] || dataObj.annual).toFixed(1))
    }));
  }, [regionData, metric]);

  // Generate monthly trend data (Comparisons) -> Array of series
  const comparisonSeries = useMemo(() => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return comparisonDataList.map((item, index) => {
          if (!item.data) return { data: [], color: comparisonColors[index % comparisonColors.length], label: item.region };

          let data: { label: string; value: number }[] = [];

        //   if (metric === 'temperature_range') {
        //       data = months.map(m => {
        //           const minObj = item.data!['temperature_min'] as MetricData;
        //           const maxObj = item.data!['temperature_max'] as MetricData;
        //           const key = m.toLowerCase() as keyof MonthlyData;
        //           const minVal = minObj?.[key];
        //           const maxVal = maxObj?.[key];
                  
        //           return {
        //               label: m,
        //               value: (minVal !== undefined && maxVal !== undefined) ? Number((maxVal - minVal).toFixed(1)) : 0
        //           };
        //       });
        //   } else {
               const metricKey = metric as keyof AnnualWeatherData;
               const dataObj = item.data![metricKey] as MetricData;
               if (dataObj) {
                   data = months.map(m => ({
                       label: m,
                       value: Number((dataObj[m.toLowerCase() as keyof MonthlyData] || dataObj.annual).toFixed(1))
                   }));
               }
        //   }

          return {
              label: item.region.replace(/_/g, ' '),
              color: comparisonColors[index % comparisonColors.length],
              data: data
          };
      });
  }, [comparisonDataList, metric, comparisonColors]);


  // Prepare data for Mixed Combo Chart
  const comboData = useMemo(() => {
    if (!regionData) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Safely cast to expected type structure
    const tMax = regionData.temperature_max as MetricData;
    const tMin = regionData.temperature_min as MetricData;
    const rain = regionData.rainfall as MetricData;

    return months.map(m => {
        const key = m.toLowerCase() as keyof MonthlyData;
        return {
            label: m,
            tempMax: tMax?.[key] || 0,
            tempMin: tMin?.[key] || 0,
            rainfall: rain?.[key] || 0
        };
    });
  }, [regionData]);

  // Calculate current value for the badge
  const currentValue = regionData ? getMetricValue(regionData, metric) : null;
  
  const [view, setView] = useState<'trends' | 'overview' | 'combo'>('trends');

  // Helper for overview data
  const getOverviewData = (m: MetricType) => {
      if (!regionData) return [];
      const dataObj = regionData[m as keyof AnnualWeatherData] as MetricData;
      if (!dataObj) return [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map(month => ({
          label: month,
          value: Number((dataObj[month.toLowerCase() as keyof MonthlyData] || dataObj.annual).toFixed(1))
      }));
  };

  return (
    <Stack h="100%" gap={0}>
      {/* Header */}
      <Paper p="md" bg="gray.0" style={{ borderBottom: '1px solid #eee' }} radius={0}>
        <Group justify="space-between" align="start" mb="sm">
          <Stack gap={4}>
            <Group gap="xs">
                <ThemeIcon variant="light" color="blue" size="sm">
                    <IconMapPin size={14} />
                </ThemeIcon>
                <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                    {comparisonRegions.length > 0 ? 'Multi-Region Analysis' : 'Region Analysis'}
                </Text>
            </Group>
            <Title order={3} style={{ lineHeight: 1.2 }}>{regionName}</Title>
            
            {/* Comparison Badges */}
            {comparisonRegions.length > 0 && (
                <Group gap={6} mt={2} style={{ flexWrap: 'wrap' }}>
                    <Text size="xs" c="dimmed" fw={600} mr={4}>VS</Text>
                    {comparisonRegions.map((r, i) => (
                        <Badge 
                            key={r} 
                            size="sm" 
                            variant="dot" 
                            color={comparisonColors[i % comparisonColors.length]}
                            tt="capitalize"
                        >
                            {r.replace(/_/g, ' ')}
                        </Badge>
                    ))}
                    <ActionIcon variant="transparent" color="gray" size="xs" onClick={onClearComparison}>
                        <IconX size={12} />
                    </ActionIcon>
                </Group>
            )}
          </Stack>
          
          <Group gap="xs">
             {comparisonRegions.length === 0 && (
                 <Button 
                    variant="default" 
                    size="xs" 
                    leftSection={<IconScale size={14} />}
                    onClick={onStartComparison}
                 >
                    Compare
                 </Button>
             )}
             <ActionIcon variant="subtle" color="gray" onClick={onClose}>
                <IconX size={20} />
             </ActionIcon>
          </Group>
        </Group>

        <SegmentedControl 
            fullWidth
            size="xs"
            value={view}
            onChange={(val: string) => setView(val as 'trends' | 'overview' | 'combo')}
            data={[
                { label: 'Trends', value: 'trends' },
                { label: 'Overview', value: 'overview' },
                { label: 'Mixed', value: 'combo' }
            ]}
        />
      </Paper>

      {/* Scrollable Content */}
      <ScrollArea style={{ flex: 1 }}>
        <Stack p="md" gap="xl">
            
            {view === 'trends' && (
                <>
                    <Box>
                        <Group mb="sm" justify="space-between">
                            <Group gap="xs">
                                <IconTrendingUp size={18} />
                                <Text fw={600}>{metricInfo.name} ({year})</Text>
                            </Group>
                            <Stack gap={0} align="flex-end">
                                {currentValue !== null && (
                                    <Badge variant="light" color={colorScale(currentValue)}>
                                        {currentValue.toFixed(1)} {metricInfo.unit}
                                    </Badge>
                                )}
                            </Stack>
                        </Group>
                        <Paper withBorder p="sm" radius="md">
                            <MiniTrendChart 
                                data={monthlyData}
                                comparisonSeries={comparisonSeries.map(s => ({
                                    ...s,
                                    data: s.data.map(d => ({ label: d.label, value: d.value })) // Ensure strict typing
                                }))}
                                metricName={metricInfo.name}
                                unit={metricInfo.unit}
                                color="#3b82f6"
                                type="area"
                                height={180}
                            />
                        </Paper>
                        
                        {/* Legend for Comparisons */}
                        {comparisonRegions.length > 0 && (
                             <Group gap="xs" mt="sm" justify="center">
                                <Group gap={4}>
                                    <Box w={8} h={8} bg="#3b82f6" style={{ borderRadius: '50%' }} />
                                    <Text size="xs" c="dimmed">{regionName}</Text>
                                </Group>
                                {comparisonSeries.map((s) => (
                                    <Group gap={4} key={s.label}>
                                        <Box w={8} h={8} bg={s.color} style={{ borderRadius: '50%' }} />
                                        <Text size="xs" c="dimmed">{s.label}</Text>
                                    </Group>
                                ))}
                             </Group>
                        )}
                    </Box>

                    <Divider />

                    <Box>
                        <Group mb="sm">
                            <IconChartBar size={18} />
                            <Text fw={600}>Key Statistics</Text>
                        </Group>
                        <Group grow>
                            <Paper withBorder p="xs" radius="md" bg="gray.0">
                                <Text size="xs" c="dimmed">Highest</Text>
                                <Text fw={700}>Jul</Text> 
                            </Paper>
                            <Paper withBorder p="xs" radius="md" bg="gray.0">
                                <Text size="xs" c="dimmed">Lowest</Text>
                                <Text fw={700}>Jan</Text>
                            </Paper>
                        </Group>
                    </Box>
                </>
            )}

            {view === 'overview' && (
                <Stack gap="md">
                    <Text size="sm" c="dimmed" fw={500}>Multi-Metric Profile ({year})</Text>
                    {comparisonRegions.length > 0 && <Text size="xs" c="orange">Brief view (Comparisons hidden)</Text>}
                    
                    {[
                        'temperature_max', 
                        'temperature_min', 
                        'rainfall', 
                        'sunshine'
                    ].map((m) => {
                        const info = getMetricInfo(m as MetricType);
                        const val = regionData ? getMetricValue(regionData, m as MetricType) : null;
                        const data = getOverviewData(m as MetricType);
                        
                        return (
                            <Paper key={m} withBorder p="xs" radius="md">
                                <Group justify="space-between" mb={4}>
                                    <Text size="sm" fw={600}>{info.name}</Text>
                                    <Badge size="sm" variant="outline">{val?.toFixed(1)} {info.unit}</Badge>
                                </Group>
                                <Box h={60}>
                                    <MiniTrendChart 
                                        data={data}
                                        metricName={info.name}
                                        unit={info.unit}
                                        color={m.includes('temp') ? '#ef4444' : '#3b82f6'}
                                        type="line"
                                        height={60}
                                        hideAxis
                                    />
                                </Box>
                            </Paper>
                        );
                    })}
                </Stack>
            )}

            {view === 'combo' && (
                <Stack gap="md">
                    <Box>
                        <Group mb="xs">
                            <IconChartBar size={18} />
                            <Text fw={600}>Temp & Rainfall Mix</Text>
                        </Group>
                        <Text size="xs" c="dimmed" mb="md">
                            Comparing Temperature Range (Lines) vs Rainfall (Bars)
                        </Text>
                        <Paper withBorder p="xs" radius="md">
                            <WeatherComboChart data={comboData} height={250} />
                        </Paper>
                    </Box>
                    
                    <Paper p="sm" bg="blue.0" radius="md">
                        <Text size="xs" c="blue.8">
                            This chart combines multiple matrices to show correlation between temperature and precipitation throughout the year.
                        </Text>
                    </Paper>
                </Stack>
            )}

        </Stack>
      </ScrollArea>
    </Stack>
  );
}
