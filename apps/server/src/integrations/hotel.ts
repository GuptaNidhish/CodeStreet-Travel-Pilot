// ============================================
// Hotel Booking Integration (Mock)
// ============================================

export interface HotelSearchResult {
  hotelName: string;
  location: string;
  pricePerNight: number;
  rating: number;
  availableRooms: number;
  amenities: string[];
  distanceFromAirport: string;
}

export async function searchHotels(location: string): Promise<HotelSearchResult[]> {
  return [
    { hotelName: `Grand Hyatt ${location}`, location, pricePerNight: 180 + Math.floor(Math.random() * 120), rating: 4.5, availableRooms: Math.floor(Math.random() * 10 + 2), amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Airport Shuttle'], distanceFromAirport: '5.2 km' },
    { hotelName: `Marriott ${location} Airport`, location, pricePerNight: 150 + Math.floor(Math.random() * 80), rating: 4.2, availableRooms: Math.floor(Math.random() * 15 + 5), amenities: ['WiFi', 'Gym', 'Restaurant', 'Airport Shuttle'], distanceFromAirport: '2.1 km' },
    { hotelName: `Holiday Inn Express ${location}`, location, pricePerNight: 90 + Math.floor(Math.random() * 50), rating: 3.8, availableRooms: Math.floor(Math.random() * 20 + 10), amenities: ['WiFi', 'Breakfast', 'Parking'], distanceFromAirport: '8.5 km' },
  ];
}

export async function bookHotel(hotelName: string, checkIn: string, checkOut: string, pricePerNight: number): Promise<{ confirmationCode: string; totalPrice: number }> {
  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
  return { confirmationCode: `HB-${Date.now().toString(36).toUpperCase()}`, totalPrice: pricePerNight * nights };
}
