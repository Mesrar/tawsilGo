/**
 * Mock competitor pricing data
 * In a real implementation, this would come from a pricing service or API
 */

interface CompetitorPriceData {
  route: string;
  weight: number;
  prices: {
    dhl?: number;
    ups?: number;
    aramex?: number;
    laposte?: number;
  };
}

// Mock competitor pricing data for common routes
const competitorPricingDatabase: CompetitorPriceData[] = [
  {
    route: 'paris-casablanca',
    weight: 5,
    prices: {
      dhl: 85,
      ups: 92,
      aramex: 65,
      laposte: 55,
    },
  },
  {
    route: 'marseille-casablanca',
    weight: 5,
    prices: {
      dhl: 78,
      ups: 84,
      aramex: 62,
      laposte: 48,
    },
  },
  {
    route: 'lyon-casablanca',
    weight: 5,
    prices: {
      dhl: 82,
      ups: 88,
      aramex: 64,
      laposte: 52,
    },
  },
  {
    route: 'paris-casablanca',
    weight: 10,
    prices: {
      dhl: 125,
      ups: 135,
      aramex: 95,
      laposte: 85,
    },
  },
  {
    route: 'marseille-casablanca',
    weight: 10,
    prices: {
      dhl: 118,
      ups: 128,
      aramex: 92,
      laposte: 78,
    },
  },
  {
    route: 'lyon-casablanca',
    weight: 10,
    prices: {
      dhl: 122,
      ups: 132,
      aramex: 94,
      laposte: 82,
    },
  },
];

/**
 * Get competitor prices for a specific route and weight
 */
export function getCompetitorPrices(
  departureCity: string,
  destinationCity: string,
  weight: number
): CompetitorPriceData['prices'] {
  // Create a route key
  const routeKey = `${departureCity.toLowerCase()}-${destinationCity.toLowerCase()}`;

  // Try to find exact match first
  let match = competitorPricingDatabase.find(
    data => data.route === routeKey && Math.abs(data.weight - weight) < 1
  );

  // If no exact match, try to find closest weight
  if (!match) {
    const routeMatches = competitorPricingDatabase.filter(data => data.route === routeKey);
    if (routeMatches.length > 0) {
      match = routeMatches.reduce((closest, current) =>
        Math.abs(current.weight - weight) < Math.abs(closest.weight - weight) ? current : closest
      );
    }
  }

  // If still no match, try to find any route with similar weight
  if (!match) {
    const weightMatches = competitorPricingDatabase.filter(data => Math.abs(data.weight - weight) < 2);
    if (weightMatches.length > 0) {
      match = weightMatches[0];
    }
  }

  // If still no match, use default pricing
  if (!match) {
    return getDefaultCompetitorPrices(weight);
  }

  // Adjust prices based on weight difference
  const weightRatio = weight / match.weight;
  const adjustedPrices: CompetitorPriceData['prices'] = {};

  Object.entries(match.prices).forEach(([competitor, price]) => {
    adjustedPrices[competitor] = price * weightRatio;
  });

  return adjustedPrices;
}

/**
 * Get default competitor prices for any route
 */
function getDefaultCompetitorPrices(weight: number): CompetitorPriceData['prices'] {
  const basePrice = {
    dhl: 65,
    ups: 72,
    aramex: 58,
    laposte: 45,
  };

  const weightMultiplier = weight / 5; // Base price is for 5kg
  const adjustedPrices: CompetitorPriceData['prices'] = {};

  Object.entries(basePrice).forEach(([competitor, price]) => {
    adjustedPrices[competitor] = price * weightMultiplier;
  });

  return adjustedPrices;
}

/**
 * Get competitive advantage metrics
 */
export function getCompetitiveAdvantage(
  ourPrice: number,
  departureCity: string,
  destinationCity: string,
  weight: number
) {
  const competitorPrices = getCompetitorPrices(departureCity, destinationCity, weight);

  // Calculate average competitor price
  const validPrices = Object.values(competitorPrices).filter(price => price && price > 0);
  const avgCompetitorPrice = validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;

  // Calculate savings
  const savings = avgCompetitorPrice - ourPrice;
  const savingsPercent = avgCompetitorPrice > 0 ? (savings / avgCompetitorPrice) * 100 : 0;

  // Find cheapest competitor
  const cheapestPrice = Math.min(...validPrices);
  const vsCheapest = ourPrice < cheapestPrice;

  return {
    savings,
    savingsPercent,
    avgCompetitorPrice,
    cheapestPrice,
    vsCheapest,
    competitorPrices,
  };
}