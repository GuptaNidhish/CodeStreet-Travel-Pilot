// ============================================
// TravelPilot AI — Shared Type Definitions
// ============================================

// --- Enums ---

export enum UserRole {
  TRAVELER = 'TRAVELER',
  MANAGER = 'MANAGER',
}

export enum TripStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  DISRUPTED = 'DISRUPTED',
  RESOLVED = 'RESOLVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SegmentStatus {
  SCHEDULED = 'SCHEDULED',
  ON_TIME = 'ON_TIME',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
  DIVERTED = 'DIVERTED',
  REBOOKED = 'REBOOKED',
  COMPLETED = 'COMPLETED',
}

export enum DisruptionType {
  CANCELLATION = 'CANCELLATION',
  DELAY = 'DELAY',
  DIVERSION = 'DIVERSION',
  MISSED_CONNECTION = 'MISSED_CONNECTION',
  WEATHER = 'WEATHER',
}

export enum ConnectionRisk {
  SAFE = 'SAFE',
  AT_RISK = 'AT_RISK',
  MISSED = 'MISSED',
}

export enum AutonomyTier {
  TIER_1_AUTO = 'TIER_1_AUTO',
  TIER_2_CONFIRM = 'TIER_2_CONFIRM',
  TIER_3_ESCALATE = 'TIER_3_ESCALATE',
}

export enum DecisionStatus {
  PENDING = 'PENDING',
  AUTO_BOOKED = 'AUTO_BOOKED',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  APPROVED = 'APPROVED',
  OVERRIDDEN = 'OVERRIDDEN',
  ESCALATED = 'ESCALATED',
  UNDONE = 'UNDONE',
  EXPIRED = 'EXPIRED',
}

export enum NotificationType {
  DISRUPTION_DETECTED = 'DISRUPTION_DETECTED',
  AUTO_REBOOKED = 'AUTO_REBOOKED',
  APPROVAL_NEEDED = 'APPROVAL_NEEDED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  HOTEL_UPDATED = 'HOTEL_UPDATED',
  CAB_UPDATED = 'CAB_UPDATED',
  UNDO_AVAILABLE = 'UNDO_AVAILABLE',
  UNDO_EXPIRED = 'UNDO_EXPIRED',
  ESCALATED = 'ESCALATED',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  WHATSAPP = 'WHATSAPP',
}

export enum AgentType {
  MONITOR = 'MONITOR',
  RISK_SCORING = 'RISK_SCORING',
  PLANNER = 'PLANNER',
  POLICY_GUARD = 'POLICY_GUARD',
  EXECUTION = 'EXECUTION',
  HOTEL = 'HOTEL',
  GROUND_TRANSPORT = 'GROUND_TRANSPORT',
  BUDGET = 'BUDGET',
  NOTIFICATION = 'NOTIFICATION',
  EXPLAINABILITY = 'EXPLAINABILITY',
}

export enum CabinClass {
  ECONOMY = 'ECONOMY',
  PREMIUM_ECONOMY = 'PREMIUM_ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST',
}

// --- Interfaces ---

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  seatPreference: 'WINDOW' | 'AISLE' | 'MIDDLE' | 'NO_PREFERENCE';
  dietaryPreference: string;
  preferredAirlines: string[];
  maxBudgetUSD: number;
  cabinPreference: CabinClass;
  carbonConscious: boolean;
  notificationChannels: NotificationChannel[];
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TripStatus;
  startDate: string;
  endDate: string;
  budgetUSD: number;
  spentUSD: number;
  segments: Segment[];
  hotelBookings: HotelBooking[];
  cabBookings: CabBooking[];
  disruptions: DisruptionEvent[];
  decisions: RebookingDecision[];
  notifications: Notification[];
  createdAt: string;
  updatedAt: string;
}

export interface Segment {
  id: string;
  tripId: string;
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  cabin: CabinClass;
  fare: number;
  pnr: string;
  status: SegmentStatus;
  connectionRisk?: ConnectionRisk;
  nextSegmentId?: string;
  carbonKg: number;
  order: number;
}

export interface DisruptionEvent {
  id: string;
  tripId: string;
  segmentId: string;
  type: DisruptionType;
  riskScore: number;
  delayMinutes: number;
  reason: string;
  weatherData?: WeatherData;
  connectionRisk?: ConnectionRisk;
  detectedAt: string;
  resolvedAt?: string;
}

export interface RebookingCandidate {
  id: string;
  disruptionId: string;
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  cabin: CabinClass;
  fare: number;
  stops: number;
  score: number;
  carbonKg: number;
  allianceMatch: boolean;
  reasons: string[];
  rejectionReason?: string;
}

export interface RebookingDecision {
  id: string;
  tripId: string;
  disruptionId: string;
  tier: AutonomyTier;
  status: DecisionStatus;
  selectedCandidateId?: string;
  candidates: RebookingCandidate[];
  fareDelta: number;
  reasoning: string;
  policyCheckResult: PolicyCheckResult;
  undoDeadline?: string;
  approvalDeadline?: string;
  decidedAt: string;
  executedAt?: string;
}

export interface PolicyCheckResult {
  passed: boolean;
  tier: AutonomyTier;
  checks: PolicyCheck[];
  fareDeltaPct: number;
  fareDeltaAbs: number;
}

export interface PolicyCheck {
  rule: string;
  passed: boolean;
  details: string;
}

export interface HotelBooking {
  id: string;
  tripId: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  pricePerNight: number;
  totalPrice: number;
  confirmationCode: string;
  status: 'CONFIRMED' | 'MODIFIED' | 'CANCELLED';
  modifiedReason?: string;
}

export interface CabBooking {
  id: string;
  tripId: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime: string;
  price: number;
  status: 'CONFIRMED' | 'MODIFIED' | 'CANCELLED';
  provider: string;
}

export interface Notification {
  id: string;
  userId: string;
  tripId?: string;
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  tripId: string;
  agentType: AgentType;
  action: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  reasoning: string;
  durationMs: number;
  timestamp: string;
}

export interface AgentLogEntry {
  id: string;
  tripId: string;
  disruptionId?: string;
  agentType: AgentType;
  status: 'STARTED' | 'COMPLETED' | 'FAILED';
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  durationMs: number;
  timestamp: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  visibility: number;
  severity: 'CLEAR' | 'MINOR' | 'MODERATE' | 'SEVERE';
}

// --- API Types ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export interface CreateTripRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  budgetUSD: number;
  segments: CreateSegmentRequest[];
  hotelBookings?: CreateHotelRequest[];
  cabBookings?: CreateCabRequest[];
}

export interface CreateSegmentRequest {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  cabin: CabinClass;
  fare: number;
  pnr: string;
  order: number;
}

export interface CreateHotelRequest {
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  pricePerNight: number;
}

export interface CreateCabRequest {
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime: string;
  price: number;
  provider: string;
}

export interface SimulateDisruptionRequest {
  tripId: string;
  segmentId: string;
  type: DisruptionType;
  delayMinutes?: number;
  reason?: string;
}

export interface ManagerDashboardData {
  totalTrips: number;
  activeTrips: number;
  delayedTrips: number;
  cancelledTrips: number;
  autoResolved: number;
  pendingApproval: number;
  escalated: number;
  totalSavingsUSD: number;
  avgResolutionTimeMs: number;
  riskScoreDistribution: { score: number; count: number }[];
  recentActivity: AuditLogEntry[];
  tripsByStatus: { status: TripStatus; count: number }[];
  carbonSavedKg: number;
}

// --- SSE Event Types ---

export enum SSEEventType {
  DISRUPTION_DETECTED = 'disruption:detected',
  AGENT_STARTED = 'agent:started',
  AGENT_COMPLETED = 'agent:completed',
  DECISION_MADE = 'decision:made',
  BOOKING_CONFIRMED = 'booking:confirmed',
  NOTIFICATION_SENT = 'notification:sent',
  TIMELINE_UPDATE = 'timeline:update',
  UNDO_COUNTDOWN = 'undo:countdown',
}

export interface SSEEvent {
  type: SSEEventType;
  data: Record<string, unknown>;
  timestamp: string;
}

// --- Constants ---

export const AUTONOMY_POLICY = {
  tier1: {
    maxFareDeltaPct: 15,
    maxFareDeltaAbsUSD: 200,
    cabinDowngradeAllowed: false,
    maxAddedStops: 1,
    undoWindowMinutes: 10,
  },
  tier2: {
    maxFareDeltaPct: 40,
    maxFareDeltaAbsUSD: 600,
    responseTimeoutMinutes: 5,
    defaultOnTimeout: 'best_ranked_option' as const,
  },
  tier3: {
    condition: 'Zero-touch autonomous policy self-healing active',
    routeTo: 'autonomous_amex_policy_guard' as const,
  },
  zeroTouch: {
    enabled: true,
    autoBookThreshold: 0, // All disruptions are auto-resolved
    amexProtectionGuarantee: true,
    policySelfHealing: true,
    undoWindowMinutes: 10,
  },
} as const;

export const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
  CRITICAL: 90,
} as const;

export const CARBON_FACTORS = {
  KG_PER_KM_ECONOMY: 0.255,
  KG_PER_KM_BUSINESS: 0.510,
  KG_PER_KM_FIRST: 0.765,
} as const;
