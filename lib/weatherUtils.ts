import { AnnualWeatherData, MetricType, MetricData } from '@/types/weather';

export interface WeatherEvent {
  year: number;
  type: 'heatwave' | 'freeze' | 'storm' | 'drought';
  label: string;
  severity: 'low' | 'medium' | 'high';
}

export const identifyExtremeEvents = (
  data: AnnualWeatherData[], 
  metric: MetricType
): WeatherEvent[] => {
  if (!data || data.length === 0) return [];

  const events: WeatherEvent[] = [];
  
  // Extract values for statistical analysis
  const values = data.map(d => {
    //  if (metric === 'temperature_range') {
    //     const tmax = (d.temperature_max as MetricData).annual || 0;
    //     const tmin = (d.temperature_min as MetricData).annual || 0;
    //     return tmax - tmin;
    //  } else {
        const metricKey = metric as keyof AnnualWeatherData;
         // Ensure we access the 'annual' property safely for object types like MonthlyData
        const val = d[metricKey];
        if (typeof val === 'object' && val !== null && 'annual' in val) {
             return (val as MetricData).annual as number;
        }
        return 0;
    //  }
  }).filter(v => !isNaN(v));

  if (values.length === 0) return [];

  // Calculate percentiles
  values.sort((a, b) => a - b);
  const p05 = values[Math.floor(values.length * 0.05)];
  const p95 = values[Math.floor(values.length * 0.95)];
  const p02 = values[Math.floor(values.length * 0.02)]; // Extreme Low
  const p98 = values[Math.floor(values.length * 0.98)]; // Extreme High

  data.forEach(d => {
    let val = 0;
    // if (metric === 'temperature_range') {
    //     const tmax = (d.temperature_max as MetricData).annual || 0;
    //     const tmin = (d.temperature_min as MetricData).annual || 0;
    //     val = tmax - tmin;
    // } else {
         const metricKey = metric as keyof AnnualWeatherData;
         const vObj = d[metricKey];
         if (typeof vObj === 'object' && vObj !== null && 'annual' in vObj) {
             val = (vObj as MetricData).annual;
         }
    // }

    // Heuristics based on Metric Type
    if (metric === 'temperature_max' || metric === 'temperature_mean' || metric === 'temperature_min') {
        if (val >= p98) {
            events.push({ year: d.year, type: 'heatwave', label: `Heatwave of ${d.year}`, severity: 'high' });
        } else if (val <= p02) {
            events.push({ year: d.year, type: 'freeze', label: `Deep Freeze of ${d.year}`, severity: 'high' });
        }
    } else if (metric === 'rainfall') {
        if (val >= p95) {
             events.push({ year: d.year, type: 'storm', label: `Major Floods/Storms ${d.year}`, severity: 'high' });
        } else if (val <= p05) {
             events.push({ year: d.year, type: 'drought', label: `Drought of ${d.year}`, severity: 'high' });
        }
    }
  });

  return events;
};
