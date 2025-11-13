
import { useCallback, useState } from "react";

/**
 * Custom hook to manage booking search state
 */
export function useSearchState(initialFromCountry = "france", initialToCountry = "morocco") {
    const [state, setState] = useState({
      departureCityFilter: "",
      destinationCityFilter: "",
      dateFilter: undefined as Date | undefined,
      heroFromCountry: initialFromCountry,
      heroToCountry: initialToCountry,
    });
  
    const updateSearchState = useCallback(
      (updates: Partial<typeof state>) => {
        setState((prev) => ({ ...prev, ...updates }));
      },
      []
    );
  
    return { searchState: state, updateSearchState };
  }