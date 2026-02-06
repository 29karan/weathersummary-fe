// Color palette configuration for charts and data visualization

export const CHART_COLORS = {
  // Primary chart series colors (12 distinct colors)
  series: [
    'var(--chart-1)',  // Purple
    'var(--chart-2)',  // Pink
    'var(--chart-3)',  // Lime
    'var(--chart-4)',  // Amber
    'var(--chart-5)',  // Indigo
    'var(--chart-6)',  // Rose
    'var(--chart-7)',  // Emerald
    'var(--chart-8)',  // Sky
    'var(--chart-9)',  // Violet
    'var(--chart-10)', // Fuchsia
    'var(--chart-11)', // Cyan
    'var(--chart-12)', // Orange
  ],
  
  // Temperature scale colors
  temperature: {
    freezing: 'var(--temp-freezing)',
    cold: 'var(--temp-cold)',
    cool: 'var(--temp-cool)',
    mild: 'var(--temp-mild)',
    warm: 'var(--temp-warm)',
    hot: 'var(--temp-hot)',
  },
  
  // Rainfall scale colors
  rainfall: {
    light: 'var(--rain-light)',
    moderate: 'var(--rain-moderate)',
    heavy: 'var(--rain-heavy)',
    extreme: 'var(--rain-extreme)',
  },
  
  // Heatmap sequential scale
  heatmap: [
    'var(--heatmap-1)',
    'var(--heatmap-2)',
    'var(--heatmap-3)',
    'var(--heatmap-4)',
    'var(--heatmap-5)',
    'var(--heatmap-6)',
    'var(--heatmap-7)',
    'var(--heatmap-8)',
    'var(--heatmap-9)',
    'var(--heatmap-10)',
  ],
};

// Helper function to get color by index
export const getChartColor = (index: number): string => {
  return CHART_COLORS.series[index % CHART_COLORS.series.length];
};

// Helper function to get temperature color based on value
export const getTemperatureColor = (temp: number): string => {
  if (temp < 0) return CHART_COLORS.temperature.freezing;
  if (temp < 10) return CHART_COLORS.temperature.cold;
  if (temp < 15) return CHART_COLORS.temperature.cool;
  if (temp < 20) return CHART_COLORS.temperature.mild;
  if (temp < 25) return CHART_COLORS.temperature.warm;
  return CHART_COLORS.temperature.hot;
};

// Helper function to get rainfall color based on value (mm)
export const getRainfallColor = (rainfall: number): string => {
  if (rainfall < 25) return CHART_COLORS.rainfall.light;
  if (rainfall < 50) return CHART_COLORS.rainfall.moderate;
  if (rainfall < 100) return CHART_COLORS.rainfall.heavy;
  return CHART_COLORS.rainfall.extreme;
};

// Helper function to get heatmap color based on normalized value (0-1)
export const getHeatmapColor = (normalizedValue: number): string => {
  const index = Math.floor(normalizedValue * (CHART_COLORS.heatmap.length - 1));
  return CHART_COLORS.heatmap[Math.max(0, Math.min(index, CHART_COLORS.heatmap.length - 1))];
};
