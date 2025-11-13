/**
 * Service for fetching route data from Geoapify
 */

export interface GeoPoint {
    lat: number;
    lng: number;
  }
  
  export interface RouteOptions {
    apiKey?: string;
    mode?: 'drive' | 'walk' | 'bicycle' | 'transit';
    avoid?: string[];
  }
  
  /**
   * Fetch a route between multiple waypoints
   */
  export async function fetchRoute(waypoints: GeoPoint[], options: RouteOptions = {}) {
    const { 
      apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY, 
      mode = 'drive',
      avoid = [] 
    } = options;
  
    if (!apiKey) {
      throw new Error("Missing API key for route calculation");
    }
  
    if (waypoints.length < 2) {
      throw new Error("At least two waypoints are required");
    }
    
    // Build waypoints string
    const waypointsStr = waypoints
      .map(wp => `${wp.lat},${wp.lng}`)
      .join('|');
    
    let url = `https://api.geoapify.com/v1/routing?waypoints=${waypointsStr}&mode=${mode}&apiKey=${apiKey}`;
    
    // Add avoid parameters if any
    if (avoid.length > 0) {
      url += `&avoid=${avoid.join(',')}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch route data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data;
  }
  
  /**
   * Process route data to extract polyline coordinates formatted for Leaflet
   */
  export function extractRouteCoordinates(routeData: any): [number, number][] {
    if (!routeData?.features?.[0]?.geometry?.coordinates) {
      return [];
    }
    
    // Convert from [lng, lat] to [lat, lng] format for Leaflet
    return routeData.features[0].geometry.coordinates.map(
      (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
    );
  }