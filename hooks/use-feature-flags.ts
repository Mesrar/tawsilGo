import { useState, useEffect } from 'react';

interface FeatureFlags {
  smartBookingFlow: boolean;
  instantSearch: boolean;
  autoExpandForm: boolean;
  inlineReview: boolean;
  priceEstimates: boolean;
  weightQuickSelect: boolean;
  simplifiedPackaging: boolean;
  autoFillProfile: boolean;
  priceAnchoring: boolean;
}

/**
 * Hook for managing feature flags and A/B testing
 * Controls which Phase 2 features are enabled
 */
export function useFeatureFlags(initialFlags: Partial<FeatureFlags> = {}) {
  const defaultFlags: FeatureFlags = {
    smartBookingFlow: false, // Main 2-step flow
    instantSearch: true,      // Instant search results
    autoExpandForm: true,     // Auto-expanding sections
    inlineReview: true,       // Inline review sidebar
    priceEstimates: true,     // Price estimates on cards
    weightQuickSelect: true,  // Quick weight buttons
    simplifiedPackaging: true, // 3 packaging options
    autoFillProfile: true,     // Auto-fill from user profile
    priceAnchoring: true,      // Competitive pricing
  };

  const [flags, setFlags] = useState<FeatureFlags>({
    ...defaultFlags,
    ...initialFlags,
  });

  // Load flags from localStorage or URL params
  useEffect(() => {
    // Check URL params for feature overrides
    const urlParams = new URLSearchParams(window.location.search);
    const urlFlags: Partial<FeatureFlags> = {};

    // Check for feature flags in URL
    if (urlParams.has('smart_flow')) {
      urlFlags.smartBookingFlow = urlParams.get('smart_flow') === 'true';
    }
    if (urlParams.has('instant_search')) {
      urlFlags.instantSearch = urlParams.get('instant_search') === 'true';
    }
    if (urlParams.has('auto_expand')) {
      urlFlags.autoExpandForm = urlParams.get('auto_expand') === 'true';
    }
    if (urlParams.has('inline_review')) {
      urlFlags.inlineReview = urlParams.get('inline_review') === 'true';
    }

    // Load from localStorage
    try {
      const savedFlags = localStorage.getItem('bookingFeatureFlags');
      if (savedFlags) {
        const parsed = JSON.parse(savedFlags);
        setFlags(prev => ({ ...prev, ...parsed, ...urlFlags }));
      }
    } catch (error) {
      console.warn('Failed to load feature flags:', error);
    }
  }, []);

  // Save flags to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('bookingFeatureFlags', JSON.stringify(flags));
    } catch (error) {
      console.warn('Failed to save feature flags:', error);
    }
  }, [flags]);

  // Enable all Phase 2 features for development
  const enableAllPhase2Features = () => {
    setFlags({
      smartBookingFlow: true,
      instantSearch: true,
      autoExpandForm: true,
      inlineReview: true,
      priceEstimates: true,
      weightQuickSelect: true,
      simplifiedPackaging: true,
      autoFillProfile: true,
      priceAnchoring: true,
    });
  };

  // Disable all Phase 2 features (revert to original flow)
  const disableAllPhase2Features = () => {
    setFlags({
      smartBookingFlow: false,
      instantSearch: false,
      autoExpandForm: false,
      inlineReview: false,
      priceEstimates: false,
      weightQuickSelect: false,
      simplifiedPackaging: false,
      autoFillProfile: false,
      priceAnchoring: false,
    });
  };

  // Toggle specific feature
  const toggleFeature = (feature: keyof FeatureFlags) => {
    setFlags(prev => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  // Check if any Phase 2 features are enabled
  const hasPhase2Features = Object.values(flags).some(Boolean);

  return {
    flags,
    setFlags,
    enableAllPhase2Features,
    disableAllPhase2Features,
    toggleFeature,
    hasPhase2Features,
  };
}