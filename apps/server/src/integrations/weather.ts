// ============================================
// Weather Integration (Mock + Real interface)
// ============================================

export interface WeatherInfo {
  city: string;
  airport: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  visibility: number;
  humidity: number;
  severity: 'CLEAR' | 'MINOR' | 'MODERATE' | 'SEVERE';
  flightImpact: string;
}

const mockWeather: Record<string, WeatherInfo> = {
  JFK: { city: 'New York', airport: 'JFK', temperature: 28, condition: 'Partly Cloudy', windSpeed: 15, visibility: 10000, humidity: 65, severity: 'CLEAR', flightImpact: 'No impact expected' },
  LAX: { city: 'Los Angeles', airport: 'LAX', temperature: 32, condition: 'Sunny', windSpeed: 8, visibility: 15000, humidity: 40, severity: 'CLEAR', flightImpact: 'No impact expected' },
  ORD: { city: 'Chicago', airport: 'ORD', temperature: 2, condition: 'Heavy Snow', windSpeed: 45, visibility: 200, humidity: 90, severity: 'SEVERE', flightImpact: 'Significant delays and cancellations expected' },
  SFO: { city: 'San Francisco', airport: 'SFO', temperature: 18, condition: 'Fog', windSpeed: 10, visibility: 800, humidity: 95, severity: 'MODERATE', flightImpact: 'Low visibility delays possible' },
  LHR: { city: 'London', airport: 'LHR', temperature: 15, condition: 'Overcast', windSpeed: 20, visibility: 5000, humidity: 75, severity: 'MINOR', flightImpact: 'Minor delays possible' },
  DEL: { city: 'Delhi', airport: 'DEL', temperature: 38, condition: 'Haze', windSpeed: 12, visibility: 3000, humidity: 55, severity: 'MINOR', flightImpact: 'Possible visibility-related delays' },
  BOM: { city: 'Mumbai', airport: 'BOM', temperature: 30, condition: 'Thunderstorm', windSpeed: 35, visibility: 2000, humidity: 85, severity: 'MODERATE', flightImpact: 'Delays likely during active thunderstorms' },
};

export async function getWeather(airport: string): Promise<WeatherInfo> {
  return mockWeather[airport] || { city: 'Unknown', airport, temperature: 22, condition: 'Clear', windSpeed: 10, visibility: 10000, humidity: 50, severity: 'CLEAR' as const, flightImpact: 'No impact expected' };
}

export function calculateWeatherRisk(weather: WeatherInfo): number {
  let risk = 0;
  if (weather.severity === 'SEVERE') risk += 60;
  else if (weather.severity === 'MODERATE') risk += 35;
  else if (weather.severity === 'MINOR') risk += 15;
  if (weather.windSpeed > 40) risk += 25;
  else if (weather.windSpeed > 25) risk += 10;
  if (weather.visibility < 500) risk += 30;
  else if (weather.visibility < 1500) risk += 15;
  return Math.min(100, risk);
}
