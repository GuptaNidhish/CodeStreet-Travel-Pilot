"use strict";
// ============================================
// Database Seed Script — Demo Data
// ============================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    await prisma.agentLog.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.rebookingDecision.deleteMany();
    await prisma.rebookingCandidate.deleteMany();
    await prisma.disruptionEvent.deleteMany();
    await prisma.cabBooking.deleteMany();
    await prisma.hotelBooking.deleteMany();
    await prisma.segment.deleteMany();
    await prisma.trip.deleteMany();
    await prisma.policyRule.deleteMany();
    await prisma.user.deleteMany();
    const password = await bcryptjs_1.default.hash('demo123', 12);
    const traveler = await prisma.user.create({
        data: {
            email: 'alex@travelpilot.demo',
            password,
            name: 'Alex Johnson',
            role: 'TRAVELER',
            phone: '+1-555-0101',
            preferences: {
                seatPreference: 'WINDOW',
                dietaryPreference: 'vegetarian',
                preferredAirlines: ['American Airlines', 'Delta Air Lines'],
                maxBudgetUSD: 5000,
                cabinPreference: 'ECONOMY',
                carbonConscious: true,
                notificationChannels: ['IN_APP', 'EMAIL'],
            },
        },
    });
    const manager = await prisma.user.create({
        data: {
            email: 'sarah@travelpilot.demo',
            password,
            name: 'Sarah Chen',
            role: 'MANAGER',
            phone: '+1-555-0102',
            preferences: {
                seatPreference: 'AISLE',
                dietaryPreference: 'none',
                preferredAirlines: [],
                maxBudgetUSD: 10000,
                cabinPreference: 'BUSINESS',
                carbonConscious: false,
                notificationChannels: ['IN_APP'],
            },
        },
    });
    const trip1 = await prisma.trip.create({
        data: {
            userId: traveler.id,
            title: 'NYC → Chicago → LA Business Trip',
            description: 'Annual west coast client meetings',
            status: 'ACTIVE',
            startDate: new Date('2026-07-28'),
            endDate: new Date('2026-07-31'),
            budgetUSD: 3500,
            spentUSD: 0,
            segments: {
                create: [
                    {
                        flightNumber: 'AA1234',
                        airline: 'American Airlines',
                        departureAirport: 'JFK',
                        arrivalAirport: 'ORD',
                        departureTime: new Date('2026-07-28T08:00:00Z'),
                        arrivalTime: new Date('2026-07-28T10:30:00Z'),
                        cabin: 'ECONOMY',
                        fare: 320,
                        pnr: 'ABC123',
                        status: 'SCHEDULED',
                        carbonKg: 303,
                        order: 0,
                    },
                    {
                        flightNumber: 'UA5678',
                        airline: 'United Airlines',
                        departureAirport: 'ORD',
                        arrivalAirport: 'LAX',
                        departureTime: new Date('2026-07-28T12:00:00Z'),
                        arrivalTime: new Date('2026-07-28T14:15:00Z'),
                        cabin: 'ECONOMY',
                        fare: 280,
                        pnr: 'DEF456',
                        status: 'SCHEDULED',
                        carbonKg: 715,
                        order: 1,
                    },
                ],
            },
            hotelBookings: {
                create: [
                    {
                        hotelName: 'Marriott Downtown LA',
                        location: 'Los Angeles',
                        checkIn: new Date('2026-07-28T17:00:00Z'),
                        checkOut: new Date('2026-07-31T11:00:00Z'),
                        pricePerNight: 199,
                        totalPrice: 597,
                        confirmationCode: 'MR-DEMO001',
                    },
                ],
            },
            cabBookings: {
                create: [
                    {
                        pickupLocation: 'LAX Airport',
                        dropoffLocation: 'Marriott Downtown LA',
                        scheduledTime: new Date('2026-07-28T15:00:00Z'),
                        price: 45,
                        provider: 'Uber Business',
                    },
                ],
            },
        },
    });
    await prisma.policyRule.create({
        data: {
            name: 'default_autonomy_policy',
            description: 'Default 3-tier autonomy policy',
            config: {
                tier_1_auto_book: { max_fare_delta_pct: 15, max_fare_delta_abs_usd: 200, cabin_downgrade_allowed: false, max_added_stops: 1, undo_window_minutes: 10 },
                tier_2_confirm_first: { max_fare_delta_pct: 40, max_fare_delta_abs_usd: 600, response_timeout_minutes: 5, default_on_timeout: 'best_ranked_option' },
                tier_3_escalate_human: { condition: 'fare_delta exceeds tier 2 OR international reroute OR multi-passenger', route_to: 'human_travel_desk' },
            },
        },
    });
    await prisma.notification.createMany({
        data: [
            {
                userId: traveler.id,
                tripId: trip1.id,
                type: 'DISRUPTION_DETECTED',
                title: '🛫 Trip Monitoring Active',
                message: 'Your trip is actively monitored for delays or cancellations.',
                channel: 'IN_APP',
                read: true,
            },
        ],
    });
    console.log('✅ Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map