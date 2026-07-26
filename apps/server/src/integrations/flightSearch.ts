// ============================================
// Flight Search Integration (Mock rebooking candidates)
// ============================================

import { CabinClass } from '@travelpilot/shared';

export interface FlightSearchResult {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  cabin: CabinClass;
  fare: number;
  stops: number;
  carbonKg: number;
  alliance: string;
  availableSeats: number;
}

export async function searchAlternativeFlights(
  departureAirport: string,
  arrivalAirport: string,
  originalDepartureTime: string,
  cabin: CabinClass = CabinClass.ECONOMY
): Promise<FlightSearchResult[]> {
  const baseTime = new Date(originalDepartureTime);

  return [
    { flightNumber: `AA${Math.floor(Math.random() * 9000 + 1000)}`, airline: 'American Airlines', departureAirport, arrivalAirport, departureTime: new Date(baseTime.getTime() + 2 * 3600000).toISOString(), arrivalTime: new Date(baseTime.getTime() + 5 * 3600000).toISOString(), cabin, fare: Math.round(250 + Math.random() * 150), stops: 0, carbonKg: Math.round(150 + Math.random() * 100), alliance: 'oneworld', availableSeats: Math.floor(Math.random() * 20 + 3) },
    { flightNumber: `UA${Math.floor(Math.random() * 9000 + 1000)}`, airline: 'United Airlines', departureAirport, arrivalAirport, departureTime: new Date(baseTime.getTime() + 4 * 3600000).toISOString(), arrivalTime: new Date(baseTime.getTime() + 7 * 3600000).toISOString(), cabin, fare: Math.round(200 + Math.random() * 100), stops: 0, carbonKg: Math.round(140 + Math.random() * 80), alliance: 'Star Alliance', availableSeats: Math.floor(Math.random() * 15 + 5) },
    { flightNumber: `DL${Math.floor(Math.random() * 9000 + 1000)}`, airline: 'Delta Air Lines', departureAirport, arrivalAirport, departureTime: new Date(baseTime.getTime() + 3 * 3600000).toISOString(), arrivalTime: new Date(baseTime.getTime() + 8 * 3600000).toISOString(), cabin, fare: Math.round(180 + Math.random() * 80), stops: 1, carbonKg: Math.round(200 + Math.random() * 120), alliance: 'SkyTeam', availableSeats: Math.floor(Math.random() * 30 + 10) },
    { flightNumber: `SW${Math.floor(Math.random() * 9000 + 1000)}`, airline: 'Southwest Airlines', departureAirport, arrivalAirport, departureTime: new Date(baseTime.getTime() + 6 * 3600000).toISOString(), arrivalTime: new Date(baseTime.getTime() + 9 * 3600000).toISOString(), cabin: CabinClass.ECONOMY, fare: Math.round(150 + Math.random() * 60), stops: 0, carbonKg: Math.round(130 + Math.random() * 60), alliance: 'none', availableSeats: Math.floor(Math.random() * 50 + 20) },
    { flightNumber: `B6${Math.floor(Math.random() * 9000 + 1000)}`, airline: 'JetBlue', departureAirport, arrivalAirport, departureTime: new Date(baseTime.getTime() + 5 * 3600000).toISOString(), arrivalTime: new Date(baseTime.getTime() + 8.5 * 3600000).toISOString(), cabin, fare: Math.round(220 + Math.random() * 130), stops: 1, carbonKg: Math.round(190 + Math.random() * 100), alliance: 'none', availableSeats: Math.floor(Math.random() * 25 + 8) },
  ];
}
