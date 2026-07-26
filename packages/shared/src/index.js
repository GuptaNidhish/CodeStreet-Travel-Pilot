"use strict";
// ============================================
// TravelPilot AI — Shared Type Definitions
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARBON_FACTORS = exports.RISK_THRESHOLDS = exports.AUTONOMY_POLICY = exports.SSEEventType = exports.CabinClass = exports.AgentType = exports.NotificationChannel = exports.NotificationType = exports.DecisionStatus = exports.AutonomyTier = exports.ConnectionRisk = exports.DisruptionType = exports.SegmentStatus = exports.TripStatus = exports.UserRole = void 0;
// --- Enums ---
var UserRole;
(function (UserRole) {
    UserRole["TRAVELER"] = "TRAVELER";
    UserRole["MANAGER"] = "MANAGER";
})(UserRole || (exports.UserRole = UserRole = {}));
var TripStatus;
(function (TripStatus) {
    TripStatus["UPCOMING"] = "UPCOMING";
    TripStatus["ACTIVE"] = "ACTIVE";
    TripStatus["DISRUPTED"] = "DISRUPTED";
    TripStatus["RESOLVED"] = "RESOLVED";
    TripStatus["COMPLETED"] = "COMPLETED";
    TripStatus["CANCELLED"] = "CANCELLED";
})(TripStatus || (exports.TripStatus = TripStatus = {}));
var SegmentStatus;
(function (SegmentStatus) {
    SegmentStatus["SCHEDULED"] = "SCHEDULED";
    SegmentStatus["ON_TIME"] = "ON_TIME";
    SegmentStatus["DELAYED"] = "DELAYED";
    SegmentStatus["CANCELLED"] = "CANCELLED";
    SegmentStatus["DIVERTED"] = "DIVERTED";
    SegmentStatus["REBOOKED"] = "REBOOKED";
    SegmentStatus["COMPLETED"] = "COMPLETED";
})(SegmentStatus || (exports.SegmentStatus = SegmentStatus = {}));
var DisruptionType;
(function (DisruptionType) {
    DisruptionType["CANCELLATION"] = "CANCELLATION";
    DisruptionType["DELAY"] = "DELAY";
    DisruptionType["DIVERSION"] = "DIVERSION";
    DisruptionType["MISSED_CONNECTION"] = "MISSED_CONNECTION";
    DisruptionType["WEATHER"] = "WEATHER";
})(DisruptionType || (exports.DisruptionType = DisruptionType = {}));
var ConnectionRisk;
(function (ConnectionRisk) {
    ConnectionRisk["SAFE"] = "SAFE";
    ConnectionRisk["AT_RISK"] = "AT_RISK";
    ConnectionRisk["MISSED"] = "MISSED";
})(ConnectionRisk || (exports.ConnectionRisk = ConnectionRisk = {}));
var AutonomyTier;
(function (AutonomyTier) {
    AutonomyTier["TIER_1_AUTO"] = "TIER_1_AUTO";
    AutonomyTier["TIER_2_CONFIRM"] = "TIER_2_CONFIRM";
    AutonomyTier["TIER_3_ESCALATE"] = "TIER_3_ESCALATE";
})(AutonomyTier || (exports.AutonomyTier = AutonomyTier = {}));
var DecisionStatus;
(function (DecisionStatus) {
    DecisionStatus["PENDING"] = "PENDING";
    DecisionStatus["AUTO_BOOKED"] = "AUTO_BOOKED";
    DecisionStatus["AWAITING_APPROVAL"] = "AWAITING_APPROVAL";
    DecisionStatus["APPROVED"] = "APPROVED";
    DecisionStatus["OVERRIDDEN"] = "OVERRIDDEN";
    DecisionStatus["ESCALATED"] = "ESCALATED";
    DecisionStatus["UNDONE"] = "UNDONE";
    DecisionStatus["EXPIRED"] = "EXPIRED";
})(DecisionStatus || (exports.DecisionStatus = DecisionStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["DISRUPTION_DETECTED"] = "DISRUPTION_DETECTED";
    NotificationType["AUTO_REBOOKED"] = "AUTO_REBOOKED";
    NotificationType["APPROVAL_NEEDED"] = "APPROVAL_NEEDED";
    NotificationType["BOOKING_CONFIRMED"] = "BOOKING_CONFIRMED";
    NotificationType["HOTEL_UPDATED"] = "HOTEL_UPDATED";
    NotificationType["CAB_UPDATED"] = "CAB_UPDATED";
    NotificationType["UNDO_AVAILABLE"] = "UNDO_AVAILABLE";
    NotificationType["UNDO_EXPIRED"] = "UNDO_EXPIRED";
    NotificationType["ESCALATED"] = "ESCALATED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "IN_APP";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["PUSH"] = "PUSH";
    NotificationChannel["WHATSAPP"] = "WHATSAPP";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var AgentType;
(function (AgentType) {
    AgentType["MONITOR"] = "MONITOR";
    AgentType["RISK_SCORING"] = "RISK_SCORING";
    AgentType["PLANNER"] = "PLANNER";
    AgentType["POLICY_GUARD"] = "POLICY_GUARD";
    AgentType["EXECUTION"] = "EXECUTION";
    AgentType["HOTEL"] = "HOTEL";
    AgentType["GROUND_TRANSPORT"] = "GROUND_TRANSPORT";
    AgentType["BUDGET"] = "BUDGET";
    AgentType["NOTIFICATION"] = "NOTIFICATION";
    AgentType["EXPLAINABILITY"] = "EXPLAINABILITY";
})(AgentType || (exports.AgentType = AgentType = {}));
var CabinClass;
(function (CabinClass) {
    CabinClass["ECONOMY"] = "ECONOMY";
    CabinClass["PREMIUM_ECONOMY"] = "PREMIUM_ECONOMY";
    CabinClass["BUSINESS"] = "BUSINESS";
    CabinClass["FIRST"] = "FIRST";
})(CabinClass || (exports.CabinClass = CabinClass = {}));
// --- SSE Event Types ---
var SSEEventType;
(function (SSEEventType) {
    SSEEventType["DISRUPTION_DETECTED"] = "disruption:detected";
    SSEEventType["AGENT_STARTED"] = "agent:started";
    SSEEventType["AGENT_COMPLETED"] = "agent:completed";
    SSEEventType["DECISION_MADE"] = "decision:made";
    SSEEventType["BOOKING_CONFIRMED"] = "booking:confirmed";
    SSEEventType["NOTIFICATION_SENT"] = "notification:sent";
    SSEEventType["TIMELINE_UPDATE"] = "timeline:update";
    SSEEventType["UNDO_COUNTDOWN"] = "undo:countdown";
})(SSEEventType || (exports.SSEEventType = SSEEventType = {}));
// --- Constants ---
exports.AUTONOMY_POLICY = {
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
        defaultOnTimeout: 'best_ranked_option',
    },
    tier3: {
        condition: 'Zero-touch autonomous policy self-healing active',
        routeTo: 'autonomous_amex_policy_guard',
    },
    zeroTouch: {
        enabled: true,
        autoBookThreshold: 0, // All disruptions are auto-resolved
        amexProtectionGuarantee: true,
        policySelfHealing: true,
        undoWindowMinutes: 10,
    },
};
exports.RISK_THRESHOLDS = {
    LOW: 30,
    MEDIUM: 60,
    HIGH: 80,
    CRITICAL: 90,
};
exports.CARBON_FACTORS = {
    KG_PER_KM_ECONOMY: 0.255,
    KG_PER_KM_BUSINESS: 0.510,
    KG_PER_KM_FIRST: 0.765,
};
//# sourceMappingURL=index.js.map