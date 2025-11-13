import type {
  NotificationTrigger,
  NotificationTriggerConfig,
  NotificationChannel,
  NotificationPriority
} from "@/types/notification";
import { ParcelStatus } from "@/types/booking";

/**
 * Notification Trigger Matrix
 *
 * Defines the 12 key notification triggers for the TawsilGo shipping platform.
 * Each trigger specifies:
 * - Which channels to use (SMS, Email, Push, WhatsApp)
 * - Priority level (affects delivery speed and cost)
 * - Required parcel status
 * - Whether user can disable it
 *
 * Based on UX research showing these 12 moments are critical for customer anxiety reduction
 */
export const NOTIFICATION_TRIGGER_MATRIX: Record<NotificationTrigger, NotificationTriggerConfig> = {
  /**
   * 1. BOOKING_CONFIRMED
   * Sent immediately after successful booking & payment
   * Critical: Confirms transaction, provides tracking number
   */
  [NotificationTrigger.BOOKING_CONFIRMED]: {
    trigger: NotificationTrigger.BOOKING_CONFIRMED,
    channels: ["EMAIL", "SMS"],
    priority: "HIGH",
    delay: 0,
    requiredStatus: ["BOOKING_CONFIRMED" as ParcelStatus],
    userPreferencesOverride: false, // Always send - transactional
  },

  /**
   * 2. PICKUP_SCHEDULED
   * Sent when driver is assigned and pickup is scheduled
   * Reduces anxiety: "When will my package be picked up?"
   */
  [NotificationTrigger.PICKUP_SCHEDULED]: {
    trigger: NotificationTrigger.PICKUP_SCHEDULED,
    channels: ["SMS", "PUSH"],
    priority: "MEDIUM",
    delay: 0,
    requiredStatus: ["PICKUP_SCHEDULED" as ParcelStatus],
    userPreferencesOverride: true,
  },

  /**
   * 3. IN_TRANSIT
   * Sent when package departs origin hub
   * Confirms package is moving
   */
  [NotificationTrigger.IN_TRANSIT]: {
    trigger: NotificationTrigger.IN_TRANSIT,
    channels: ["SMS", "PUSH", "EMAIL"],
    priority: "MEDIUM",
    delay: 0,
    requiredStatus: ["IN_TRANSIT_BUS" as ParcelStatus, "IN_TRANSIT_FERRY" as ParcelStatus],
    userPreferencesOverride: true,
  },

  /**
   * 4. CHECKPOINT_REACHED
   * Sent at major checkpoints (borders, ferry terminals, hubs)
   * Reduces anxiety: "Where is my package now?"
   */
  [NotificationTrigger.CHECKPOINT_REACHED]: {
    trigger: NotificationTrigger.CHECKPOINT_REACHED,
    channels: ["PUSH"], // Low-priority, opt-in only
    priority: "LOW",
    delay: 0,
    requiredStatus: ["IN_TRANSIT_BUS" as ParcelStatus, "IN_TRANSIT_FERRY" as ParcelStatus],
    userPreferencesOverride: true,
  },

  /**
   * 5. CUSTOMS_SUBMITTED
   * Sent when package enters customs (EU exit or Morocco entry)
   * Critical: Sets expectations for clearance time (6-48 hours)
   */
  [NotificationTrigger.CUSTOMS_SUBMITTED]: {
    trigger: NotificationTrigger.CUSTOMS_SUBMITTED,
    channels: ["SMS", "EMAIL"],
    priority: "HIGH",
    delay: 0,
    requiredStatus: [
      "CUSTOMS_SUBMITTED_EU" as ParcelStatus,
      "CUSTOMS_SUBMITTED_MA" as ParcelStatus,
    ],
    userPreferencesOverride: false, // Always send - critical status
  },

  /**
   * 6. DUTY_PAYMENT_REQUIRED
   * Sent when Morocco customs assesses duty and payment is needed
   * Critical: Action required, includes payment link and deadline (30 days)
   */
  [NotificationTrigger.DUTY_PAYMENT_REQUIRED]: {
    trigger: NotificationTrigger.DUTY_PAYMENT_REQUIRED,
    channels: ["SMS", "EMAIL", "PUSH"],
    priority: "CRITICAL",
    delay: 0,
    requiredStatus: ["DUTY_PAYMENT_PENDING" as ParcelStatus],
    userPreferencesOverride: false, // Always send - action required
  },

  /**
   * 7. CUSTOMS_CLEARED
   * Sent when package clears customs (EU or Morocco)
   * Reduces anxiety: "Will my package be held?"
   */
  [NotificationTrigger.CUSTOMS_CLEARED]: {
    trigger: NotificationTrigger.CUSTOMS_CLEARED,
    channels: ["SMS", "PUSH"],
    priority: "MEDIUM",
    delay: 0,
    requiredStatus: [
      "CUSTOMS_CLEARED_EU" as ParcelStatus,
      "CUSTOMS_CLEARED_MA" as ParcelStatus,
    ],
    userPreferencesOverride: true,
  },

  /**
   * 8. OUT_FOR_DELIVERY
   * Sent when package is loaded on delivery vehicle
   * Critical: "Your package will arrive today"
   */
  [NotificationTrigger.OUT_FOR_DELIVERY]: {
    trigger: NotificationTrigger.OUT_FOR_DELIVERY,
    channels: ["SMS", "PUSH"],
    priority: "HIGH",
    delay: 0,
    requiredStatus: ["OUT_FOR_DELIVERY" as ParcelStatus],
    userPreferencesOverride: false, // Always send - delivery day
  },

  /**
   * 9. DELIVERY_WINDOW
   * Sent 30 minutes before estimated arrival
   * Critical: Real-time update, includes driver name & photo
   */
  [NotificationTrigger.DELIVERY_WINDOW]: {
    trigger: NotificationTrigger.DELIVERY_WINDOW,
    channels: ["SMS", "PUSH"],
    priority: "CRITICAL",
    delay: 0, // Sent dynamically based on driver GPS
    requiredStatus: ["OUT_FOR_DELIVERY" as ParcelStatus],
    userPreferencesOverride: false, // Always send - imminent delivery
  },

  /**
   * 10. DELIVERED
   * Sent when driver confirms delivery
   * Includes delivery photo and rating prompt
   */
  [NotificationTrigger.DELIVERED]: {
    trigger: NotificationTrigger.DELIVERED,
    channels: ["SMS", "EMAIL", "PUSH"],
    priority: "HIGH",
    delay: 0,
    requiredStatus: ["DELIVERED" as ParcelStatus],
    userPreferencesOverride: false, // Always send - transactional
  },

  /**
   * 11. DELAY_ALERT
   * Sent when package is delayed >2 hours from ETA
   * Critical: Proactive communication, includes new ETA and reason
   */
  [NotificationTrigger.DELAY_ALERT]: {
    trigger: NotificationTrigger.DELAY_ALERT,
    channels: ["SMS", "PUSH"],
    priority: "HIGH",
    delay: 0,
    requiredStatus: undefined, // Can occur at any status
    userPreferencesOverride: false, // Always send - exception handling
  },

  /**
   * 12. CUSTOMS_HOLD
   * Sent when package is held at customs requiring document upload
   * Critical: Action required, includes document upload link
   */
  [NotificationTrigger.CUSTOMS_HOLD]: {
    trigger: NotificationTrigger.CUSTOMS_HOLD,
    channels: ["SMS", "EMAIL", "PUSH"],
    priority: "CRITICAL",
    delay: 0,
    requiredStatus: [
      "CUSTOMS_HOLD_EU" as ParcelStatus,
      "CUSTOMS_HOLD_MA" as ParcelStatus,
    ],
    userPreferencesOverride: false, // Always send - action required
  },
};

/**
 * Get Trigger Config by Trigger Type
 */
export function getTriggerConfig(trigger: NotificationTrigger): NotificationTriggerConfig {
  return NOTIFICATION_TRIGGER_MATRIX[trigger];
}

/**
 * Get Triggers by Priority
 */
export function getTriggersByPriority(priority: NotificationPriority): NotificationTriggerConfig[] {
  return Object.values(NOTIFICATION_TRIGGER_MATRIX).filter(
    (config) => config.priority === priority
  );
}

/**
 * Get Triggers by Channel
 */
export function getTriggersByChannel(channel: NotificationChannel): NotificationTriggerConfig[] {
  return Object.values(NOTIFICATION_TRIGGER_MATRIX).filter((config) =>
    config.channels.includes(channel)
  );
}

/**
 * Check if Trigger Requires User Action
 */
export function requiresUserAction(trigger: NotificationTrigger): boolean {
  const actionRequiredTriggers: NotificationTrigger[] = [
    NotificationTrigger.DUTY_PAYMENT_REQUIRED,
    NotificationTrigger.CUSTOMS_HOLD,
  ];
  return actionRequiredTriggers.includes(trigger);
}

/**
 * Check if Trigger is Transactional (always send, ignore preferences)
 */
export function isTransactional(trigger: NotificationTrigger): boolean {
  const config = getTriggerConfig(trigger);
  return !config.userPreferencesOverride;
}
