/**
 * A/B Testing Framework for Upsell Optimization
 *
 * Simple, lightweight framework for running conversion experiments
 * on upsell components without external dependencies.
 *
 * Features:
 * - Variant assignment with consistent bucketing
 * - Event tracking (impressions, conversions)
 * - Statistical significance calculator
 * - Local storage persistence
 * - Server-side compatible
 */

export type ExperimentVariant = "control" | "variant_a" | "variant_b" | "variant_c";

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: ExperimentVariant[];
  trafficAllocation: number; // Percentage of users to include (0-100)
  active: boolean;
  startDate: string;
  endDate?: string;
}

export interface ExperimentAssignment {
  experimentId: string;
  variant: ExperimentVariant;
  assignedAt: Date;
  userId?: string;
  sessionId: string;
}

export interface ExperimentEvent {
  experimentId: string;
  variant: ExperimentVariant;
  eventType: "impression" | "click" | "conversion";
  eventData?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

/**
 * Active Experiments Configuration
 */
export const ACTIVE_EXPERIMENTS: Record<string, Experiment> = {
  // Insurance upsell pricing test
  insurance_pricing_v1: {
    id: "insurance_pricing_v1",
    name: "Insurance Upsell Pricing",
    description: "Test different pricing displays for insurance upsell",
    variants: ["control", "variant_a", "variant_b"],
    trafficAllocation: 100, // 100% of users
    active: true,
    startDate: "2025-03-01",
  },

  // Express delivery messaging test
  express_messaging_v1: {
    id: "express_messaging_v1",
    name: "Express Delivery Messaging",
    description: "Test urgency vs. value messaging for express upgrades",
    variants: ["control", "variant_a"],
    trafficAllocation: 50, // 50% of users
    active: true,
    startDate: "2025-03-01",
  },

  // Upsell card layout test
  upsell_layout_v1: {
    id: "upsell_layout_v1",
    name: "Upsell Card Layout",
    description: "Test card vs. banner layout for upsells",
    variants: ["control", "variant_a"],
    trafficAllocation: 100,
    active: true,
    startDate: "2025-03-01",
  },
};

/**
 * Variant Configurations
 * Define what each variant looks like for each experiment
 */
export const VARIANT_CONFIGS = {
  insurance_pricing_v1: {
    control: {
      price: 12,
      display: "€12",
      description: "Upgrade to Premium Insurance",
    },
    variant_a: {
      price: 12,
      display: "Only €12",
      description: "Premium Insurance - Peace of Mind",
      badge: "Limited Time",
    },
    variant_b: {
      price: 12,
      display: "€12 one-time",
      description: "Protect Your Package (€500 coverage)",
      benefits: ["No deductible", "24h claims", "Theft coverage"],
    },
  },

  express_messaging_v1: {
    control: {
      title: "Expedite to Express Delivery",
      description: "Get your package 2-3 days faster",
      cta: "Upgrade to Express",
    },
    variant_a: {
      title: "⚡ Express Delivery Available",
      description: "Only 2 spots left! Arrive 2-3 days earlier",
      cta: "Claim Express Spot",
      urgency: true,
    },
  },

  upsell_layout_v1: {
    control: {
      layout: "card", // Full card layout
    },
    variant_a: {
      layout: "banner", // Compact banner layout
    },
  },
};

/**
 * Generate Session ID
 */
function getSessionId(): string {
  if (typeof window === "undefined") return "server";

  let sessionId = sessionStorage.getItem("ab_session_id");
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("ab_session_id", sessionId);
  }
  return sessionId;
}

/**
 * Get User ID (from auth session or anonymous)
 */
function getUserId(): string | undefined {
  if (typeof window === "undefined") return undefined;

  // In production, get from NextAuth session
  // const session = await getSession();
  // return session?.user?.id;

  return localStorage.getItem("user_id") || undefined;
}

/**
 * Hash Function for Consistent Bucketing
 * Ensures same user always gets same variant
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Assign Variant to User
 * Uses consistent hashing for stable assignment
 */
export function assignVariant(experimentId: string): ExperimentAssignment | null {
  const experiment = ACTIVE_EXPERIMENTS[experimentId];

  if (!experiment || !experiment.active) {
    return null;
  }

  const sessionId = getSessionId();
  const userId = getUserId();

  // Check if already assigned
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(`ab_${experimentId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  }

  // Traffic allocation check
  const bucketingKey = userId || sessionId;
  const allocationHash = hashString(bucketingKey + "_allocation") % 100;

  if (allocationHash >= experiment.trafficAllocation) {
    return null; // User not in experiment
  }

  // Assign variant using consistent hashing
  const variantHash = hashString(bucketingKey + experimentId);
  const variantIndex = variantHash % experiment.variants.length;
  const variant = experiment.variants[variantIndex];

  const assignment: ExperimentAssignment = {
    experimentId,
    variant,
    assignedAt: new Date(),
    userId,
    sessionId,
  };

  // Store assignment
  if (typeof window !== "undefined") {
    localStorage.setItem(`ab_${experimentId}`, JSON.stringify(assignment));
  }

  return assignment;
}

/**
 * Get Variant for Experiment
 */
export function getVariant(experimentId: string): ExperimentVariant | null {
  const assignment = assignVariant(experimentId);
  return assignment?.variant || null;
}

/**
 * Get Variant Config
 */
export function getVariantConfig<T = any>(
  experimentId: string,
  variant?: ExperimentVariant | null
): T | null {
  const actualVariant = variant || getVariant(experimentId);
  if (!actualVariant) return null;

  const configs = VARIANT_CONFIGS[experimentId as keyof typeof VARIANT_CONFIGS];
  if (!configs) return null;

  return (configs as any)[actualVariant] as T;
}

/**
 * Track Experiment Event
 */
export function trackExperimentEvent(
  experimentId: string,
  eventType: "impression" | "click" | "conversion",
  eventData?: Record<string, any>
): void {
  const assignment = assignVariant(experimentId);
  if (!assignment) return;

  const event: ExperimentEvent = {
    experimentId,
    variant: assignment.variant,
    eventType,
    eventData,
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
  };

  // In production, send to analytics backend
  // await fetch('/api/analytics/experiment-event', {
  //   method: 'POST',
  //   body: JSON.stringify(event),
  // });

  // For now, log to console and localStorage
  console.log("[A/B Test Event]", event);

  if (typeof window !== "undefined") {
    const eventsKey = `ab_events_${experimentId}`;
    const stored = localStorage.getItem(eventsKey);
    const events = stored ? JSON.parse(stored) : [];
    events.push(event);
    localStorage.setItem(eventsKey, JSON.stringify(events.slice(-100))); // Keep last 100 events
  }
}

/**
 * Calculate Experiment Results (Local)
 * For production, use proper analytics backend
 */
export function calculateExperimentResults(experimentId: string): {
  variant: ExperimentVariant;
  impressions: number;
  conversions: number;
  conversionRate: number;
}[] {
  if (typeof window === "undefined") return [];

  const eventsKey = `ab_events_${experimentId}`;
  const stored = localStorage.getItem(eventsKey);
  if (!stored) return [];

  const events: ExperimentEvent[] = JSON.parse(stored);

  const experiment = ACTIVE_EXPERIMENTS[experimentId];
  if (!experiment) return [];

  return experiment.variants.map((variant) => {
    const variantEvents = events.filter((e) => e.variant === variant);
    const impressions = variantEvents.filter((e) => e.eventType === "impression").length;
    const conversions = variantEvents.filter((e) => e.eventType === "conversion").length;
    const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;

    return {
      variant,
      impressions,
      conversions,
      conversionRate,
    };
  });
}

/**
 * Calculate Statistical Significance
 * Simple z-test for conversion rate difference
 */
export function calculateSignificance(
  controlConversions: number,
  controlImpressions: number,
  variantConversions: number,
  variantImpressions: number
): {
  isSignificant: boolean;
  pValue: number;
  uplift: number;
} {
  const p1 = controlConversions / controlImpressions;
  const p2 = variantConversions / variantImpressions;

  const pooled = (controlConversions + variantConversions) / (controlImpressions + variantImpressions);

  const se = Math.sqrt(
    pooled * (1 - pooled) * (1 / controlImpressions + 1 / variantImpressions)
  );

  const zScore = (p2 - p1) / se;
  const pValue = 2 * (1 - standardNormalCDF(Math.abs(zScore)));

  const uplift = ((p2 - p1) / p1) * 100;

  return {
    isSignificant: pValue < 0.05,
    pValue,
    uplift,
  };
}

/**
 * Standard Normal CDF (approximation)
 */
function standardNormalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return z > 0 ? 1 - p : p;
}
