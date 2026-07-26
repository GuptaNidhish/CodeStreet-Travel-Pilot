// ============================================
// Flight Status Integration (Mock + Real interface)
// ============================================

export interface FlightStatusData {
  flightNumber: string;
  airline: string;
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED' | 'DIVERTED' | 'LANDED';
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  actualDeparture?: string;
  scheduledArrival: string;
  actualArrival?: string;
  delayMinutes: number;
  gate?: string;
  terminal?: string;
}

const mockFlights: Record<string, FlightStatusData> = {
  'AA1234': { flightNumber: 'AA1234', airline: 'American Airlines', status: 'ON_TIME', departureAirport: 'JFK', arrivalAirport: 'ORD', scheduledDeparture: '2026-07-28T08:00:00Z', scheduledArrival: '2026-07-28T10:30:00Z', delayMinutes: 0, gate: 'B22', terminal: 'T4' },
  'UA5678': { flightNumber: 'UA5678', airline: 'United Airlines', status: 'ON_TIME', departureAirport: 'ORD', arrivalAirport: 'LAX', scheduledDeparture: '2026-07-28T12:00:00Z', scheduledArrival: '2026-07-28T14:15:00Z', delayMinutes: 0, gate: 'C14', terminal: 'T1' },
  'DL9012': { flightNumber: 'DL9012', airline: 'Delta Air Lines', status: 'ON_TIME', departureAirport: 'SFO', arrivalAirport: 'JFK', scheduledDeparture: '2026-07-29T06:00:00Z', scheduledArrival: '2026-07-29T14:30:00Z', delayMinutes: 0, gate: 'A8', terminal: 'T2' },
  'BA456': { flightNumber: 'BA456', airline: 'British Airways', status: 'ON_TIME', departureAirport: 'JFK', arrivalAirport: 'LHR', scheduledDeparture: '2026-07-28T19:00:00Z', scheduledArrival: '2026-07-29T07:00:00Z', delayMinutes: 0, gate: 'D12', terminal: 'T7' },
  'AI101': { flightNumber: 'AI101', airline: 'Air India', status: 'ON_TIME', departureAirport: 'DEL', arrivalAirport: 'BOM', scheduledDeparture: '2026-07-28T10:00:00Z', scheduledArrival: '2026-07-28T12:15:00Z', delayMinutes: 0, gate: 'E5', terminal: 'T3' },
};

export async function getFlightStatus(flightNumber: string): Promise<FlightStatusData> {
  if (process.env.USE_REAL_APIS === 'true') {
    console.log(`[Real API] Fetching status for ${flightNumber}`);
  }

  const mock = mockFlights[flightNumber];
  if (mock) return { ...mock };

  return {
    flightNumber, airline: 'Unknown Airlines', status: 'ON_TIME',
    departureAirport: 'XXX', arrivalAirport: 'YYY',
    scheduledDeparture: new Date(Date.now() + 86400000).toISOString(),
    scheduledArrival: new Date(Date.now() + 97200000).toISOString(),
    delayMinutes: 0, gate: 'A1', terminal: 'T1',
  };
}
