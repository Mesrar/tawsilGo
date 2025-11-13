import { BookingStep } from "@/types/booking";
import { Trip } from "@/types/trip";
import { useCallback, useState } from "react";


/**
 * Custom hook to manage booking flow state
 */
export function useBookingState() {
    const [state, setState] = useState({
      activeStep: "search" as BookingStep,
      isLoading: false,
      hasSearched: false,
      isBooking: false,
      selectedTrip: null as Trip | null,
      bookingId: null as string | null,
    });
  
    const updateBookingState = useCallback(
      (updates: Partial<typeof state>) => {
        setState((prev) => ({ ...prev, ...updates }));
      },
      []
    );
  
    return { bookingState: state, updateBookingState };
  }
  