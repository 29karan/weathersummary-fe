'use client';

import { useMemo, useState, useEffect } from 'react';
import { Box, Paper, Group, Text, Button } from '@mantine/core';
import { useDashboardStore } from '@/lib/store';
import { IconLayoutSidebarRightCollapse } from '@tabler/icons-react';
import { D3UKMap } from '@/components/maps/D3UKMap';
import { MapLegend } from '@/components/maps/MapLegend';
import { 
  getMapData, 
  getMetricRange, 
  getColorScale,
  RegionMapData 
} from '@/lib/mapUtils';
import type { UKRegion } from '@/types/weather';
import { UK_GEOJSON } from '@/lib/ukGeoJSON';
import { SideAnalysisPanel } from '@/components/layout/SideAnalysisPanel';
import { BottomTimelinePanel } from '@/components/layout/BottomTimelinePanel';
import { useInterval } from '@mantine/hooks';

export function MapsView() {
  
  // State
  const { selectedYear, setSelectedYear, filters } = useDashboardStore();
  const selectedMetric = filters.metrics[0] || 'temperature_mean';
  const [selectedRegion, setSelectedRegion] = useState<UKRegion | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [comparisonRegions, setComparisonRegions] = useState<UKRegion[]>([]); // Array

  // Animation Loop
  const interval = useInterval(() => {
    const current = selectedYear;
    if (!current || current >= 2024) {
        setIsPlaying(false);
        setSelectedYear(2024);
    } else {
        setSelectedYear(current + 1);
    }
  }, 500);

  useEffect(() => {
    if (isPlaying) {
        interval.start();
    } else {
        interval.stop();
    }
    return () => interval.stop();
  }, [isPlaying, interval]);

  // Derived Data
  const mapDataArray = useMemo(() => {
    return getMapData(selectedYear || 2024, selectedMetric);
  }, [selectedYear, selectedMetric]);

  const mapDataMap = useMemo(() => {
    const map = new Map<UKRegion, RegionMapData>();
    mapDataArray.forEach((d) => map.set(d.region, d));
    return map;
  }, [mapDataArray]);

  const { min, max } = useMemo(() => {
    return getMetricRange(selectedYear || 2024, selectedMetric);
  }, [selectedYear, selectedMetric]);
  
  const colorScale = useMemo(() => {
      const scale = getColorScale(selectedMetric, min, max);
      return (val: number) => scale(val);
  }, [selectedMetric, min, max]);

  // Handlers
  const handleRegionClick = (region: UKRegion) => {
    if (isCompareMode) {
        // Toggle comparison region
        if (comparisonRegions.includes(region)) {
             setComparisonRegions(prev => prev.filter(r => r !== region));
        } else {
             // Limit to 4 comparison regions
             if (comparisonRegions.length < 4) {
                setComparisonRegions(prev => [...prev, region]);
             }
        }
    } else {
        // Standard selection
        if (selectedRegion === region) {
             // Optional: Deselect? No, keep focus
        } else {
             setSelectedRegion(region);
             setComparisonRegions([]); // Clear comparison on new primary selection
             setIsSidePanelOpen(true);
        }
    }
  };
  
  const handleYearChange = (year: number) => {
      setSelectedYear(year);
      if (isPlaying) setIsPlaying(false);
  };

  return (
    // Outer Container - Flex Row
    <Box h="calc(100vh - 100px)" style={{ display: 'flex', overflow: 'hidden' }}>
      
      {/* LEFT COLUMN: Map Area + Bottom Panel (Flex 1) */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            
            {/* Map Area */}
            <Box 
                flex={1} 
                pos="relative" 
                style={{ 
                    overflow: 'hidden', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: 0 // Crucial for flex nested resizing
                }}
            >
                {/* Instruction Pill for Compare Mode */}
                {isCompareMode && (
                    <Paper 
                        pos="absolute" 
                        top={20} 
                        style={{ 
                            zIndex: 20, 
                            transform: 'translateX(-50%)', 
                            left: '50%' 
                        }}
                        shadow="md"
                        radius="xl"
                        p="xs"
                        px="md"
                        withBorder
                    >
                        <Group gap="xs">
                            <Text size="sm" fw={500}>
                                {comparisonRegions.length === 0 
                                    ? "Select regions to compare" 
                                    : `Comparing ${comparisonRegions.length} regions`
                                }
                            </Text>
                            <Button 
                                size="compact-xs" 
                                variant={comparisonRegions.length > 0 ? "filled" : "subtle"}
                                color={comparisonRegions.length > 0 ? "blue" : "gray"}
                                onClick={() => setIsCompareMode(false)}
                            >
                                {comparisonRegions.length > 0 ? "Done" : "Cancel"}
                            </Button>
                        </Group>
                    </Paper>
                )}

                {/* Map Component */}
                <Box w="100%" h="100%" style={{ position: 'relative' }}>
                    <D3UKMap
                        geoJson={UK_GEOJSON}
                        mapData={mapDataMap}
                        metric={selectedMetric}
                        onRegionClick={handleRegionClick}
                    />
                </Box>
                
                {/* ... Legend ... */}
                <Box pos="absolute" bottom={10} left={10} style={{ zIndex: 10 }}>
                    <MapLegend 
                        metric={selectedMetric}
                        min={min}
                        max={max}
                        colorScale={colorScale}
                    />
                </Box>
            </Box>

            {/* Bottom Section: Timeline Panel (Static Flow) */}
            <Box style={{ borderTop: '1px solid #eee', background: 'white', zIndex: 15, flexShrink: 0 }}>
                <BottomTimelinePanel 
                    selectedYear={selectedYear || 2024}
                    selectedMetric={selectedMetric}
                    onYearChange={handleYearChange}
                    isPlaying={isPlaying}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    selectedRegion={selectedRegion}
                />
            </Box>
      </Box>

      {/* RIGHT COLUMN: Sidebar (Collapsible) */}
      <Box 
        w={isSidePanelOpen ? 350 : 20} 
        style={{ 
            borderLeft: '1px solid #eee', 
            background: 'white', 
            padding: 0,
            transition: 'width 0.3s ease',
            zIndex: 20,
            flexShrink: 0,
            position: 'relative',
            cursor: !isSidePanelOpen ? 'pointer' : 'default'
        }}
        onClick={() => !isSidePanelOpen && setIsSidePanelOpen(true)}
      >
        {isSidePanelOpen ? (
            <SideAnalysisPanel 
                opened={true}
                onClose={() => setIsSidePanelOpen(false)}
                region={selectedRegion}
                comparisonRegions={comparisonRegions} // Pass Array
                onStartComparison={() => setIsCompareMode(true)}
                onClearComparison={() => {
                    setComparisonRegions([]);
                    setIsCompareMode(false);
                }}
                year={selectedYear || 2022}
                metric={selectedMetric}
                colorScale={colorScale}
            />
        ) : (
            <Box 
                h="100%" 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'linear-gradient(180deg, #3b82f6 0%, #228be6 100%)',
                    boxShadow: 'inset 4px 0 6px -1px rgba(0, 0, 0, 0.1)'
                }}
            >
                <IconLayoutSidebarRightCollapse size={18} color="white" style={{ transform: 'rotate(180deg)', opacity: 0.9 }} />
            </Box>
        )}
      </Box>

    </Box>
  );
}
