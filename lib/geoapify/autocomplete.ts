/**
 * Geoapify Autocomplete API helpers for address suggestions
 * Used in signup and booking forms for address input
 */

export interface AddressSuggestion {
  formatted: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  countryCode?: string;
  lat?: number;
  lon?: number;
  placeId?: string;
}

export interface AutocompleteOptions {
  apiKey?: string;
  type?: 'country' | 'state' | 'city' | 'postcode' | 'street' | 'amenity';
  filter?: {
    countryCode?: string[];
    circle?: { lat: number; lon: number; radiusMeters: number };
    rect?: { lat1: number; lon1: number; lat2: number; lon2: number };
  };
  limit?: number;
  lang?: string;
}

/**
 * Fetch address autocomplete suggestions from Geoapify
 * @param query - Search query string
 * @param options - Autocomplete options
 * @returns Array of address suggestions
 */
export async function fetchAddressSuggestions(
  query: string,
  options: AutocompleteOptions = {}
): Promise<AddressSuggestion[]> {
  const {
    apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
    type = 'street',
    filter,
    limit = 5,
    lang = 'en',
  } = options;

  if (!apiKey) {
    throw new Error('Missing Geoapify API key');
  }

  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    // Build URL with query parameters
    let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      query
    )}&type=${type}&limit=${limit}&lang=${lang}&apiKey=${apiKey}`;

    // Add country filter for Europe and Morocco (TawsilGo focus)
    if (!filter?.countryCode) {
      // Default to European countries + Morocco
      const defaultCountries = [
        'fr', 'es', 'de', 'it', 'pt', 'be', 'nl', 'lu',
        'ch', 'at', 'ma' // Morocco
      ];
      url += `&filter=countrycode:${defaultCountries.join(',')}`;
    } else if (filter.countryCode.length > 0) {
      url += `&filter=countrycode:${filter.countryCode.join(',')}`;
    }

    // Add circle filter if specified
    if (filter?.circle) {
      url += `&filter=circle:${filter.circle.lon},${filter.circle.lat},${filter.circle.radiusMeters}`;
    }

    // Add rect filter if specified
    if (filter?.rect) {
      url += `&filter=rect:${filter.rect.lon1},${filter.rect.lat1},${filter.rect.lon2},${filter.rect.lat2}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Autocomplete API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform Geoapify response to our format
    return (data.features || []).map((feature: any) => {
      const props = feature.properties;
      return {
        formatted: props.formatted || '',
        addressLine1: props.address_line1 || '',
        addressLine2: props.address_line2 || '',
        city: props.city || '',
        state: props.state || '',
        postcode: props.postcode || '',
        country: props.country || '',
        countryCode: props.country_code || '',
        lat: props.lat,
        lon: props.lon,
        placeId: props.place_id || '',
      };
    });
  } catch (error) {
    console.error('Address autocomplete error:', error);
    throw error;
  }
}

/**
 * Format address suggestion for display in dropdown
 * @param suggestion - Address suggestion object
 * @returns Formatted string for display
 */
export function formatSuggestionDisplay(suggestion: AddressSuggestion): string {
  return suggestion.formatted;
}

/**
 * Parse address suggestion into form fields
 * Useful for auto-filling address-related fields in forms
 * @param suggestion - Selected address suggestion
 * @returns Object with parsed address components
 */
export function parseAddressComponents(suggestion: AddressSuggestion) {
  return {
    fullAddress: suggestion.formatted,
    street: suggestion.addressLine1 || '',
    city: suggestion.city || '',
    state: suggestion.state || '',
    postalCode: suggestion.postcode || '',
    country: suggestion.country || '',
    countryCode: suggestion.countryCode || '',
    coordinates: suggestion.lat && suggestion.lon
      ? { lat: suggestion.lat, lng: suggestion.lon }
      : null,
  };
}

/**
 * Debounce function for autocomplete search
 * Prevents excessive API calls while user is typing
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
