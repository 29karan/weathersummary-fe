'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { geoPath, geoMercator } from 'd3-geo';
import { zoom, D3ZoomEvent } from 'd3-zoom';
import { select } from 'd3-selection';
import type { UKRegion, MetricType } from '@/types/weather';
import type { RegionMapData } from '@/lib/mapUtils';
import { MapTooltip } from './MapTooltip';

interface D3UKMapProps {
  geoJson: { features: { properties: { id: string } }[] }; // Simplified FeatureCollection type
  mapData: Map<UKRegion, RegionMapData>;
  metric: MetricType;
  onRegionClick?: (region: UKRegion) => void;
}

export function D3UKMap({
  geoJson,
  mapData,
  metric,
  onRegionClick,
}: D3UKMapProps) {
  const [tooltipData, setTooltipData] = useState<{
    data: RegionMapData;
    x: number;
    y: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);

  // Projection setup
  // We use useMemo to avoid recalculating heavy projection logic on every render
  const { paths } = useMemo(() => {
    if (!geoJson?.features) return { paths: [], projection: null };

    // Standard UK Projection
    const width = 800;
    const height = 1000;

    // Center on UK
    const projection = geoMercator()
      .center([-3, 54.5])
      .scale(2500)
      .translate([width / 2, height / 2]);

    const pathGenerator = geoPath().projection(projection);

    const paths = geoJson.features.map((feature: { properties: { id: string } }) => {
      const d = pathGenerator(feature);
      const regionId = feature.properties.id as UKRegion;
      return {
        d,
        feature,
        regionId,
      };
    });

    return { paths, projection };
  }, [geoJson]);

  // Initialize Zoom behavior
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8]) // Min zoom 1x, Max zoom 8x
      .translateExtent([[0, 0], [800, 1000]])
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        if (gRef.current) {
          select(gRef.current).attr('transform', event.transform.toString());
        }
      });

    const svg = select(svgRef.current);
    svg.call(zoomBehavior);

    // Initial transform check? No, default is identity.

  }, []); // Run once on mount

  const handleMouseMove = (
    event: React.MouseEvent,
    regionId: UKRegion
  ) => {
    const data = mapData.get(regionId);
    if (data) {
      setTooltipData({
        data,
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const handleClick = (regionId: UKRegion) => {
    if (onRegionClick) {
      onRegionClick(regionId);
    }
  };

  if (!geoJson || !paths.length) return null;

  return (
    <div 
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#f8f9fa' }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 800 1000"
        style={{ width: '100%', height: '100%', cursor: 'grab' }}
      >
        <g ref={gRef}>
          {paths.map(({ d, regionId }) => {
            const data = mapData.get(regionId);
            const fillColor = data?.color || '#e5e7eb';
            const isHovered = tooltipData?.data.region === regionId;

            return (
              <path
                key={regionId}
                d={d || ''}
                fill={fillColor}
                stroke="#ffffff"
                strokeWidth={isHovered ? 2 : 0.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: 'fill 0.2s ease', // Only transition fill, not transform
                  filter: isHovered ? 'brightness(0.9)' : 'none',
                }}
                onMouseMove={(e) => handleMouseMove(e, regionId)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(regionId)}
              />
            );
          })}
        </g>
      </svg>

      {/* Zoom Hints */}
      <div style={{ position: 'absolute', top: 10, right: 10, pointerEvents: 'none', opacity: 0.5, fontSize: '0.8rem' }}>
        Scroll to Zoom • Drag to Pan
      </div>

      {/* Tooltip */}
      {tooltipData && (
        <MapTooltip
          data={tooltipData.data}
          metric={metric}
          x={tooltipData.x}
          y={tooltipData.y}
        />
      )}
    </div>
  );
}
