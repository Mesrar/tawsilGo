"use client";

// =========== Imports ===========
// Core React imports
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

// UI Components
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";

// Error Components
import {
  ServiceUnavailableError,
  BookingFailedError,
  NetworkError,
  AuthenticationError
} from "@/components/ui/error-alert";
import { useErrorDisplay } from "@/hooks/use-error-display";
import { ProgressSteps } from "@/components/Booking/ProgressSteps";
import { SearchForm } from "@/components/Booking/SearchForm";
import { ParcelDetailsCard } from "@/components/Booking/ParcelDetailsForm";
import { ReviewPaymentCard } from "@/components/Booking/ReviewPayment";
import { TripSelectionCard } from "@/components/Booking/trip-selection-step";

// Services and utilities
import { useAuth } from "@/lib/auth-context";
import { useSession } from "next-auth/react";
import { bookingService } from "@/app/services/bookingService";
import { paymentService } from "@/app/services/paymentService";
import { tripService } from "@/app/services/tripService";
import { ParcelFormState } from "@/types/Parcel";
import { BOOKING_STEPS, POPULAR_LOCATIONS } from "@/lib/const";
import { Trip } from "@/types/trip";
import { calculatePaymentAmount } from "@/lib/utils";
import { useParcelDetails } from "@/hooks/use-parcel";
import { useBookingState } from "@/hooks/use-booking";
import { useSearchState } from "@/hooks/use-search";
import { useTranslations } from "next-intl";

// =========== Helper Functions ===========
/**
 * Maps frontend packaging type values to backend-compatible values
 * Frontend uses: 'small', 'medium', 'large'
 * Backend expects: 'box-small', 'box-medium', 'box-large'
 */
const mapPackagingTypeToBackend = (frontendType: string): string => {
  const packagingMap: Record<string, string> = {
    'small': 'box-small',
    'medium': 'box-medium',
    'large': 'box-large',
  };

  return packagingMap[frontendType] || frontendType;
};

// =========== Main Component ===========
export default function BookParcelPage() {
  const t = useTranslations("booking");
  const { toast } = useToast();
  const router = useRouter();
  const { saveFormState, restoreFormState } = useAuth();
  const { data: session } = useSession();
  const user = session?.user;

  // Error display management
  const { error, hideError, showServiceUnavailable, showBookingFailed, showNetworkError, showAuthenticationError } = useErrorDisplay();

  // Use custom hooks for state management
  const { searchState, updateSearchState } = useSearchState();
  const { parcelDetails, updateParcelDetails } = useParcelDetails();
  const { bookingState, updateBookingState } = useBookingState();

  // Destructure states for easier access
  const {
    activeStep,
    hasSearched,
    isLoading,
    selectedTrip,
    isBooking,
    bookingId,
  } = bookingState;

  const {
    departureCityFilter,
    destinationCityFilter,
    dateFilter,
    heroFromCountry,
    heroToCountry,
  } = searchState;

  // Translate booking steps
  const translatedSteps = useMemo(
    () =>
      BOOKING_STEPS.map((step) => ({
        ...step,
        title: t(`progress.steps.${step.id}`),
      })),
    [t]
  );

  // Get all form state for saving
  const getAllFormState = useMemo(
    (): ParcelFormState => ({
      ...parcelDetails,
      ...searchState,
    }),
    [parcelDetails, searchState]
  );

  // Restore saved form state on mount
  useEffect(() => {
    const savedState = restoreFormState();
    if (savedState) {
      // Update search state
      const searchUpdates = {} as Partial<typeof searchState>;

      // Extract search-related fields
      [
        "departureCityFilter",
        "destinationCityFilter",
        "dateFilter",
        "heroFromCountry",
        "heroToCountry",
      ].forEach((field) => {
        if (field in savedState) {
          searchUpdates[field as keyof typeof searchState] =
            savedState[field as keyof ParcelFormState];
        }
      });

      if (Object.keys(searchUpdates).length > 0) {
        updateSearchState(searchUpdates);
      }

      // Update parcel details
      const parcelUpdates = {} as Partial<typeof parcelDetails>;
      Object.keys(parcelDetails).forEach((key) => {
        if (key in savedState) {
          parcelUpdates[key as keyof typeof parcelDetails] =
            savedState[key as keyof ParcelFormState];
        }
      });

      if (Object.keys(parcelUpdates).length > 0) {
        updateParcelDetails(parcelUpdates);
      }
    }
  }, [restoreFormState, updateParcelDetails, updateSearchState]);

  // Process URL parameters on page load
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fromCountry = searchParams.get("from");
    const toCountry = searchParams.get("to");

    const updates: Partial<typeof searchState> = {};
    if (fromCountry) updates.heroFromCountry = fromCountry;
    if (toCountry) updates.heroToCountry = toCountry;

    if (Object.keys(updates).length > 0) {
      updateSearchState(updates);

      // Auto-search if both parameters are present
      if (fromCountry && toCountry) {
        // Skip search form and go directly to trip selection with loading state
        updateBookingState({ activeStep: "select", isLoading: true });
        setTimeout(() => handleFilter(), 300);
      }
    }
  }, []);

  // =========== Trip Search Functions ===========
  // Trip search handler
  const handleFilter = async () => {
    // Validate search inputs
    const isUsingCityFilter = departureCityFilter && destinationCityFilter;
    const isUsingCountryFilter = heroFromCountry && heroToCountry;

    if (!isUsingCityFilter && !isUsingCountryFilter) {
      showBookingFailed(
        t("validation.selectLocations"),
        t("validation.bothLocationsRequired")
      );
      return;
    }

    updateBookingState({ isLoading: true, selectedTrip: null });

    try {
      // Build search params
      const searchParams = {
        departureCity: departureCityFilter || undefined,
        destinationCity: destinationCityFilter || undefined,
        departureCountry: !departureCityFilter ? heroFromCountry : undefined,
        destinationCountry: !destinationCityFilter ? heroToCountry : undefined,
        date: dateFilter ? format(dateFilter, "yyyy-MM-dd") : undefined,
      };

      // Use tripService to search for trips
      const response = await tripService.searchTrips(searchParams);

      // Handle API errors
      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message || "Failed to search for trips"
        );
      }

      const { trips, total } = response.data;

      // Handle empty results
      if (!trips?.length) {
        toast({
          title: t("errors.noTripsFound"),
          description: t("errors.noTripsFoundDescription"),
          variant: "default",
        });
        updateBookingState({ isLoading: false, hasSearched: true });
        return;
      }

      // Update UI state with results
      updateBookingState({
        hasSearched: true,
        activeStep: "select",
        isLoading: false,
      });

      // Notify trip selection component
      window.dispatchEvent(
        new CustomEvent("tripsLoaded", {
          detail: { trips, total, searchParams },
        })
      );
    } catch (error) {
      console.error("Search error:", error);
      showNetworkError(() => handleFilter());
      updateBookingState({ isLoading: false });
    }
  };

  // Clear search filters
  const clearFilters = useCallback(() => {
    updateSearchState({
      departureCityFilter: "",
      destinationCityFilter: "",
      dateFilter: undefined,
    });
    updateBookingState({
      hasSearched: false,
      activeStep: "search",
    });
  }, [updateBookingState, updateSearchState]);

  // Handle trip selection
  const handleTripSelected = useCallback(
    (trip: Trip) => {
      updateBookingState({
        selectedTrip: trip,
        activeStep: "details",
      });
    },
    [updateBookingState]
  );

  // =========== Booking Functions ===========
  // Handle booking creation
  const handleBooking = async (formData?: any) => {
    const { selectedTrip } = bookingState;

    if (!selectedTrip) {
      showBookingFailed(t("errors.noTripSelected"), t("errors.selectTripFirst"));
      return;
    }

    updateBookingState({ isBooking: true });

    // Save form state early in case we need to restore it
    saveFormState(getAllFormState);

    try {
      // Use form data directly if provided, otherwise use state values
      const details = formData || parcelDetails;

      // Log the data being used
      console.log("Creating booking with details:", details);

      // Step 1: Validate parcel details locally
      const {
        parcelWeight,
        packagingType,
        specialRequirements,
        pickupContactName,
        pickupContactPhone,
        deliveryContactName,
        deliveryContactPhone,
      } = details;

      // Basic validations
      if (parcelWeight <= 0) {
        throw new Error("Please specify a valid parcel weight");
      }

      if (!packagingType) {
        throw new Error("Please select packaging type");
      }

       // Basic validations
    if (parcelWeight <= 0) {
      throw new Error("Please specify a valid parcel weight");
    }

    if (!packagingType) {
      throw new Error("Please select packaging type");
    }
    
    // Validate contact information
    if (!pickupContactName) {
      throw new Error("Please enter pickup contact name");
    }
    
    if (!pickupContactPhone) {
      throw new Error("Please enter pickup contact phone");
    }
    
    if (!deliveryContactName) {
      throw new Error("Please enter delivery contact name");
    }
    
    if (!deliveryContactPhone) {
      throw new Error("Please enter delivery contact phone");
    }

      // Step 2: Create booking and parcel using the bookingService
      const response = await bookingService.createBookingWithParcel({
        tripId: selectedTrip.id,
        parcel: {
          departure: selectedTrip.departureCity,
          destination: selectedTrip.destinationCity,
          weight: parcelWeight,
          packagingType: mapPackagingTypeToBackend(packagingType),
          specialRequirements: specialRequirements,
          senderDetails: {
            name: pickupContactName,
            phone: pickupContactPhone,
          },
          receiverDetails: {
            name: deliveryContactName,
            phone: deliveryContactPhone,
          },
        },
      });

      // Handle API errors
      if (!response.success) {
        // Translate specific backend error messages
        let errorMessage = response.error?.message || t("errors.failedToCreateBooking");

        // Handle specific backend error messages
        if (response.error === "Service unavailable") {
          errorMessage = t("errors.bookingServiceUnavailable");
        } else if (response.error === "Authentication required") {
          errorMessage = t("errors.authRequired");
        } else if (response.error?.message && response.error?.message.includes("temporarily unavailable")) {
          errorMessage = t("errors.bookingServiceUnavailable");
        }

        throw new Error(errorMessage);
      }

      // Extract booking ID from typed response data
      const bookingData = response.data;
      const extractedBookingId = bookingData?.bookingId;

      if (!extractedBookingId) {
        throw new Error("Failed to extract booking ID from response");
      }

      // Save booking ID
      updateBookingState({ bookingId: extractedBookingId });
      localStorage.setItem("current_booking_id", extractedBookingId);

      // Show success message
      toast({
        title: t("success.bookingSuccessful"),
        description: t("success.bookingConfirmed"),
      });

      // Move to review step
      updateBookingState({ activeStep: "review" });
    } catch (error) {
      console.error("Booking error:", error);
      // Use the already translated error message or provide a generic one
      let errorMessage = error instanceof Error ? error.message : t("errors.tryAgainLater");

      // Show appropriate error component based on error type
      if (errorMessage.includes("temporarily unavailable") || errorMessage.includes("Service unavailable")) {
        showServiceUnavailable(() => handleBooking(formData));
      } else if (errorMessage.includes("Authentication required") || errorMessage.includes("Authentification requise") || errorMessage.includes("المصادقة مطلوبة")) {
        showAuthenticationError(() => handleBooking(formData));
      } else {
        showBookingFailed(t("errors.bookingFailed"), errorMessage, () => handleBooking(formData));
      }
    } finally {
      updateBookingState({ isBooking: false });
    }
  };

  // Handle payment initiation
  const handleProceedToPayment = useCallback(() => {
    const { selectedTrip, bookingId } = bookingState;
    const { parcelWeight } = parcelDetails;

    if (!selectedTrip) {
      showBookingFailed(t("errors.noTripSelected"), t("errors.selectTripFirst"));
      return;
    }

    // Try to recover booking ID from localStorage if not in state
    const effectiveBookingId =
      bookingId || localStorage.getItem("current_booking_id");

    if (!effectiveBookingId) {
      showBookingFailed(t("errors.bookingIdMissing"), t("errors.bookingIssue"));
      return;
    }

    // Calculate payment details
    const paymentDetails = calculatePaymentAmount(selectedTrip, parcelWeight);

    // Update loading state
    updateBookingState({ isLoading: true });

    // Initiate payment
    paymentService
      .createPayment({
        bookingId: effectiveBookingId,
        amount: paymentDetails.total,
        currency: selectedTrip.price.currency || "EUR",
        method: "stripe",
        description: `Parcel delivery from ${selectedTrip.departureCity} to ${selectedTrip.destinationCity}`,
        metadata: {
          tripId: selectedTrip.id,
          weight: parcelWeight,
          basePrice: paymentDetails.base,
          weightCost: paymentDetails.weightCost,
          insurance: paymentDetails.insurance,
          tax: paymentDetails.tax,
        },
        tripId: selectedTrip.id,
      })
      .then((response) => {
        console.log('Payment creation response:', response);
        console.log('Response success:', response.success);
        console.log('Response error:', response.error);
        console.log('Response data:', response.data);

        updateBookingState({ isLoading: false });

        if (response.success) {
          // Clear sensitive booking data from localStorage
          localStorage.removeItem("current_booking_id");

          // Redirect to payment page
          router.push(
            `/payment?paymentId=${response?.data?.paymentId}&bookingId=${effectiveBookingId}`
          );
        } else {
          throw new Error(
            response.error?.message || "Failed to create payment"
          );
        }
      })
      .catch((error) => {
        updateBookingState({ isLoading: false });

        // Only show error if it's not an auth error
        if (error.message !== "Authentication required") {
          console.error("Payment initialization error:", error);
          const errorMessage = error instanceof Error ? error.message : t("errors.tryAgainLater");
          showBookingFailed(t("errors.paymentInitFailed"), errorMessage, () => handleProceedToPayment());
        }
      });
  }, [bookingState, parcelDetails, router, toast, updateBookingState]);

  // =========== Event Handlers ===========
  // Event listeners for trip selection
  useEffect(() => {
    const handleTripSelect = (event: CustomEvent) => {
      if (event.detail && event.detail.trip) {
        handleTripSelected(event.detail.trip);
      }
    };

    window.addEventListener("tripSelected" as any, handleTripSelect);
    return () => {
      window.removeEventListener("tripSelected" as any, handleTripSelect);
    };
  }, [handleTripSelected]);

  // =========== Render ===========
  // Render the booking form UI
  return (
    <>
      <section
        id="booking-form"
        className="relative pb-16 pt-24 lg:pb-20 lg:pt-32 min-h-screen
          bg-gradient-to-br from-moroccan-mint-50 via-white to-slate-50/50
          dark:from-slate-900 dark:via-slate-950 dark:to-black"
      >
        {/* Animated gradient accent layer - mobile optimized */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
            bg-gradient-radial from-moroccan-mint-100/40 via-moroccan-mint-50/20 to-transparent
            dark:from-moroccan-mint-900/20 dark:via-moroccan-mint-950/10 dark:to-transparent
            blur-3xl opacity-50 md:opacity-60" />

          {/* Secondary accent - desktop only */}
          <div className="hidden md:block absolute bottom-0 right-0 w-[500px] h-[500px]
            bg-gradient-radial from-blue-50/40 via-slate-50/20 to-transparent
            dark:from-slate-800/30 dark:via-slate-900/20 dark:to-transparent
            blur-3xl opacity-40" />
        </div>

        {/* Content container with enhanced backdrop */}
        <div className="relative z-10 w-full max-w-md mx-auto px-4 md:px-0 space-y-6">
          {/* Trust badge with improved visibility - using homepage styling */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex items-center justify-center bg-white/80 dark:bg-moroccan-mint/15 backdrop-blur-md rounded-full px-4 py-3 mb-6 shadow-lg border-2 border-moroccan-mint/30 dark:border-moroccan-mint/30">
              <span className="bg-moroccan-mint text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 shadow-md">
                ✓
              </span>
              <span className="text-slate-900 dark:text-white font-medium text-sm">{t("hero.trustBadge")}</span>
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {t("hero.title")}
            </h1>

            <p className="text-sm text-muted-foreground">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Mobile-optimized progress steps */}
          <div className="mb-4">
            <ProgressSteps steps={translatedSteps} activeStep={activeStep} />
          </div>

          {/* Step 1: Search Form */}
          {activeStep === "search" && (
            <SearchForm
              departureCountryFilter={heroFromCountry}
              setDepartureCountryFilter={(value) =>
                updateSearchState({ heroFromCountry: value })
              }
              destinationCountryFilter={heroToCountry}
              setDestinationCountryFilter={(value) =>
                updateSearchState({ heroToCountry: value })
              }
              dateFilter={dateFilter}
              setDateFilter={(value) =>
                updateSearchState({ dateFilter: value })
              }
              handleFilter={handleFilter}
              clearFilters={clearFilters}
              popularLocations={POPULAR_LOCATIONS}
              activeStep={activeStep}
              departureFilter={departureCityFilter}
              setDepartureCityFilter={(value) =>
                updateSearchState({ departureCityFilter: value })
              }
              destinationFilter={destinationCityFilter}
              setDestinationFilter={(value) =>
                updateSearchState({ destinationCityFilter: value })
              }
              isLoading={isLoading}
            />
          )}

          {/* Step 2: Trip Selection */}
          {hasSearched && activeStep === "select" && (
            <TripSelectionCard
              departureFilter={departureCityFilter}
              destinationFilter={destinationCityFilter}
              dateFilter={dateFilter}
              departureCountry={heroFromCountry}
              destinationCountry={heroToCountry}
              isLoading={isLoading}
              onEditSearch={() => updateBookingState({ activeStep: "search" })}
              departureCountryFilter={heroFromCountry}
              destinationCountryFilter={heroToCountry}
              onTripSelected={handleTripSelected}
              onBookTrip={handleTripSelected}
            />
          )}

          {/* Step 3: Parcel Details */}
          {activeStep === "details" && selectedTrip && hasSearched && (
            <ParcelDetailsCard
              selectedTrip={selectedTrip}
              parcelWeight={parcelDetails.parcelWeight}
              setParcelWeight={(value) =>
                updateParcelDetails({ parcelWeight: value })
              }
              selectedPickupPoint={parcelDetails.selectedPickupPoint}
              setSelectedPickupPoint={(value) =>
                updateParcelDetails({ selectedPickupPoint: value })
              }
              selectedDeliveryPoint={parcelDetails.selectedDeliveryPoint}
              setSelectedDeliveryPoint={(value) =>
                updateParcelDetails({ selectedDeliveryPoint: value })
              }
              specialRequirements={parcelDetails.specialRequirements}
              setSpecialRequirements={(value) =>
                updateParcelDetails({ specialRequirements: value })
              }
              pickupContactName={parcelDetails.pickupContactName}
              setPickupContactName={(value) =>
                updateParcelDetails({ pickupContactName: value })
              }
              pickupContactPhone={parcelDetails.pickupContactPhone}
              setPickupContactPhone={(value) =>
                updateParcelDetails({ pickupContactPhone: value })
              }
              deliveryContactName={parcelDetails.deliveryContactName}
              setDeliveryContactName={(value) =>
                updateParcelDetails({ deliveryContactName: value })
              }
              deliveryContactPhone={parcelDetails.deliveryContactPhone}
              setDeliveryContactPhone={(value) =>
                updateParcelDetails({ deliveryContactPhone: value })
              }
              handleBooking={handleBooking}
              isBooking={isBooking}
              goBack={() => updateBookingState({ activeStep: "select" })}
              packagingType={parcelDetails.packagingType}
              setPackagingType={(value) =>
                updateParcelDetails({ packagingType: value })
              }
              user={user}
            />
          )}

          {/* Step 4: Review & Payment */}
          {activeStep === "review" && selectedTrip && (
            <ReviewPaymentCard
              selectedTrip={selectedTrip}
              parcelWeight={parcelDetails.parcelWeight}
              specialRequirements={parcelDetails.specialRequirements}
              bookingId={bookingId}
              senderDetails={{
                name: parcelDetails.pickupContactName,
                phone: parcelDetails.pickupContactPhone,
              }}
              receiverDetails={{
                name: parcelDetails.deliveryContactName,
                phone: parcelDetails.deliveryContactPhone,
              }}
              onBackToDetails={() =>
                updateBookingState({ activeStep: "details" })
              }
              onProceedToPayment={handleProceedToPayment}
              isPending={isLoading}
            />
          )}

          {/* Error Display */}
          {error.show && (
            <div className="fixed top-24 left-0 right-0 z-50 flex justify-center px-4 mt-6 mb-20 md:mb-6 animate-in fade-in duration-300"
                 style={{ maxHeight: '80vh', overflow: 'auto' }}>
              <div className="w-full max-w-lg">
                {error.type === "service-unavailable" && (
                  <ServiceUnavailableError
                    onRetry={error.retryAction}
                    onDismiss={error.dismissAction || hideError}
                  />
                )}
                {error.type === "booking-failed" && (
                  <BookingFailedError
                    title={error.title}
                    description={error.description}
                    onRetry={error.retryAction}
                    onDismiss={error.dismissAction || hideError}
                  />
                )}
                {error.type === "network" && (
                  <NetworkError
                    onRetry={error.retryAction}
                    onDismiss={error.dismissAction || hideError}
                  />
                )}
                {error.type === "authentication" && (
                  <AuthenticationError
                    onRetry={error.retryAction}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
