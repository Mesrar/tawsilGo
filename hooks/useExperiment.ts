import { useState, useEffect, useCallback } from "react";
import {
  getVariant,
  getVariantConfig,
  trackExperimentEvent,
  type ExperimentVariant,
} from "@/lib/ab-testing/experiments";

/**
 * useExperiment Hook
 *
 * React hook for A/B testing integration
 *
 * Usage:
 * ```tsx
 * const { variant, config, trackImpression, trackConversion } = useExperiment('insurance_pricing_v1');
 *
 * useEffect(() => {
 *   trackImpression();
 * }, []);
 *
 * const handleUpgrade = () => {
 *   trackConversion({ price: config.price });
 *   // ... handle upgrade
 * };
 * ```
 */
export function useExperiment<T = any>(experimentId: string) {
  const [variant, setVariant] = useState<ExperimentVariant | null>(null);
  const [config, setConfig] = useState<T | null>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    // Assign variant on mount
    const assignedVariant = getVariant(experimentId);
    setVariant(assignedVariant);

    if (assignedVariant) {
      const variantConfig = getVariantConfig<T>(experimentId, assignedVariant);
      setConfig(variantConfig);
    }
  }, [experimentId]);

  const trackImpression = useCallback(
    (eventData?: Record<string, any>) => {
      if (!hasTrackedImpression && variant) {
        trackExperimentEvent(experimentId, "impression", eventData);
        setHasTrackedImpression(true);
      }
    },
    [experimentId, variant, hasTrackedImpression]
  );

  const trackClick = useCallback(
    (eventData?: Record<string, any>) => {
      if (variant) {
        trackExperimentEvent(experimentId, "click", eventData);
      }
    },
    [experimentId, variant]
  );

  const trackConversion = useCallback(
    (eventData?: Record<string, any>) => {
      if (variant) {
        trackExperimentEvent(experimentId, "conversion", eventData);
      }
    },
    [experimentId, variant]
  );

  return {
    variant,
    config,
    isControl: variant === "control",
    isVariant: variant !== "control" && variant !== null,
    trackImpression,
    trackClick,
    trackConversion,
  };
}

/**
 * useFeatureFlag Hook
 *
 * Simple feature flag based on experiment framework
 */
export function useFeatureFlag(flagName: string): boolean {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check if flag is enabled
    // In production, fetch from feature flag service
    const enabled = localStorage.getItem(`feature_${flagName}`) === "true";
    setIsEnabled(enabled);
  }, [flagName]);

  return isEnabled;
}
