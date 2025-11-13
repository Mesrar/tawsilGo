import type { ParcelStatus } from "./booking";

/**
 * Notification Channels
 */
export type NotificationChannel = "SMS" | "EMAIL" | "PUSH" | "WHATSAPP";

/**
 * Notification Priority Levels
 */
export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/**
 * Supported Languages for Multi-language Templates
 */
export type NotificationLanguage = "en" | "fr" | "ar" | "es";

/**
 * Notification Trigger Events
 * These map to the 12 key triggers in the notification matrix
 */
export enum NotificationTrigger {
  // Booking & Confirmation (1)
  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",

  // Pickup & Transit (2-4)
  PICKUP_SCHEDULED = "PICKUP_SCHEDULED",
  IN_TRANSIT = "IN_TRANSIT",
  CHECKPOINT_REACHED = "CHECKPOINT_REACHED",

  // Customs Events (5-7)
  CUSTOMS_SUBMITTED = "CUSTOMS_SUBMITTED",
  DUTY_PAYMENT_REQUIRED = "DUTY_PAYMENT_REQUIRED",
  CUSTOMS_CLEARED = "CUSTOMS_CLEARED",

  // Delivery Events (8-10)
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERY_WINDOW = "DELIVERY_WINDOW", // 30 min before arrival
  DELIVERED = "DELIVERED",

  // Exception Events (11-12)
  DELAY_ALERT = "DELAY_ALERT",
  CUSTOMS_HOLD = "CUSTOMS_HOLD", // Requires document upload
}

/**
 * Notification Trigger Configuration
 * Maps each trigger to its channels, priority, and timing rules
 */
export interface NotificationTriggerConfig {
  trigger: NotificationTrigger;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  delay?: number; // milliseconds to delay before sending
  requiredStatus?: ParcelStatus[];
  userPreferencesOverride?: boolean; // Can user disable this notification?
}

/**
 * Notification Template Variables
 * Dynamic data injected into message templates
 */
export interface NotificationTemplateData {
  // User Data
  userName: string;
  userEmail?: string;
  userPhone?: string;

  // Parcel Data
  trackingNumber: string;
  origin: string;
  destination: string;
  currentLocation?: string;
  currentStatus: ParcelStatus;

  // Timing Data
  estimatedDeliveryDate?: string;
  deliveryWindow?: string;
  lastUpdateTime?: string;

  // Customs Data
  dutyAmount?: number;
  dutyCurrency?: string;
  dutyPaymentUrl?: string;
  customsDocumentsUrl?: string;

  // Delivery Data
  driverName?: string;
  driverPhone?: string;
  driverPhotoUrl?: string;
  deliveryPhotoUrl?: string;

  // Exception Data
  delayReason?: string;
  newEstimatedDate?: string;

  // Links
  trackingUrl: string;
  supportUrl?: string;
}

/**
 * Notification Template
 * Multi-language message templates
 */
export interface NotificationTemplate {
  trigger: NotificationTrigger;
  channel: NotificationChannel;
  language: NotificationLanguage;
  subject?: string; // For email
  body: string; // Template string with {{variable}} placeholders
  actionButton?: {
    text: string;
    url: string;
  };
}

/**
 * Notification Message
 * Final composed message ready to send
 */
export interface NotificationMessage {
  id: string;
  userId: string;
  trackingNumber: string;
  trigger: NotificationTrigger;
  channel: NotificationChannel;
  priority: NotificationPriority;
  language: NotificationLanguage;
  recipient: {
    email?: string;
    phone?: string;
    pushToken?: string;
  };
  content: {
    subject?: string;
    body: string;
    html?: string; // For email
  };
  metadata: {
    createdAt: Date;
    scheduledFor?: Date;
    sentAt?: Date;
    deliveredAt?: Date;
    status: "PENDING" | "SENT" | "DELIVERED" | "FAILED";
    error?: string;
  };
}

/**
 * Notification Provider Response
 */
export interface NotificationProviderResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: "TWILIO" | "SENDGRID" | "FIREBASE";
}

/**
 * User Notification Preferences
 */
export interface NotificationPreferences {
  userId: string;
  language: NotificationLanguage;
  channels: {
    sms: boolean;
    email: boolean;
    push: boolean;
    whatsapp: boolean;
  };
  disabledTriggers: NotificationTrigger[];
  quietHours?: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;
  };
}

/**
 * Notification Service Config
 */
export interface NotificationServiceConfig {
  providers: {
    twilio: {
      accountSid: string;
      authToken: string;
      fromNumber: string;
    };
    sendgrid: {
      apiKey: string;
      fromEmail: string;
      fromName: string;
    };
    firebase: {
      projectId: string;
      privateKey: string;
      clientEmail: string;
    };
  };
  defaultLanguage: NotificationLanguage;
  retryAttempts: number;
  retryDelay: number;
}
