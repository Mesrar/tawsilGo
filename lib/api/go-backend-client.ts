/**
 * Go Backend API Client
 * Direct communication with Go microservices while maintaining NextAuth session context
 */

import {
  transformOrganizationRegistrationToGo,
  transformOrganizationFromGo,
  transformVehicleToGo,
  transformVehicleFromGo,
  transformTripToGo,
  transformTripFromGo,
  transformErrorFromGo,
  validateVehicleCapacityForGo
} from './go-backend-transforms';

interface GoApiResponse<T = any> {
  data?: T;
  error?: string;
  detail?: string;
  type?: string;
  title?: string;
  status?: number;
}

interface SessionInfo {
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
  organizationId?: string;
}

/**
 * Go Backend API Client with NextAuth session integration
 */
export class GoBackendClient {
  private authHeaders: Record<string, string>;

  constructor(sessionInfo?: SessionInfo) {
    this.authHeaders = {
      'Content-Type': 'application/json',
    };

    if (sessionInfo) {
      this.authHeaders['X-User-ID'] = sessionInfo.user.id;
      this.authHeaders['X-User-Email'] = sessionInfo.user.email;
      this.authHeaders['X-User-Role'] = sessionInfo.user.role;
      if (sessionInfo.organizationId) {
        this.authHeaders['X-Organization-ID'] = sessionInfo.organizationId;
      }
    }
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: any }> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.authHeaders,
          ...options.headers,
        },
      });

      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (!response.ok) {
        return {
          success: false,
          error: transformErrorFromGo({
            ...data,
            status: response.status
          })
        };
      }

      return {
        success: true,
        data: data.data || data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
          status: 0
        }
      };
    }
  }

  // Organization Service (Port 8084)
  async registerOrganization(data: any) {
    const transformedData = transformOrganizationRegistrationToGo(data);
    return this.makeRequest(
      `${process.env.DRIVER_API_URL}/api/v1/organizations`,
      {
        method: 'POST',
        body: JSON.stringify(transformedData)
      }
    );
  }

  async getOrganization(id: string) {
    const result = await this.makeRequest(
      `${process.env.DRIVER_API_URL}/api/v1/organizations/${id}`,
      { method: 'GET' }
    );

    if (result.success && result.data) {
      result.data = transformOrganizationFromGo(result.data);
    }

    return result;
  }

  async updateOrganization(id: string, data: any) {
    const transformedData = objectKeysToSnake(data);
    return this.makeRequest(
      `${process.env.DRIVER_API_URL}/api/v1/organizations/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(transformedData)
      }
    );
  }

  async listOrganizations(params: {
    page?: number;
    page_size?: number;
    status?: string;
  } = {}) {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryString.append(key, value.toString());
      }
    });

    const result = await this.makeRequest(
      `${process.env.DRIVER_API_URL}/api/v1/organizations?${queryString.toString()}`,
      { method: 'GET' }
    );

    if (result.success && result.data) {
      if (result.data.data) {
        result.data.data = result.data.data.map(transformOrganizationFromGo);
      } else if (Array.isArray(result.data)) {
        result.data = result.data.map(transformOrganizationFromGo);
      }
    }

    return result;
  }

  async addVehicleToOrganization(organizationId: string, vehicleData: any) {
    // Validate capacity constraints
    const validationError = validateVehicleCapacityForGo(
      vehicleData.type,
      vehicleData.capacityWeightMax || vehicleData.capacityWeight,
      Math.floor((vehicleData.capacityWeightMax || vehicleData.capacityWeight || 1000) / 20)
    );

    if (validationError) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError,
          status: 400
        }
      };
    }

    const transformedData = transformVehicleToGo(vehicleData);
    return this.makeRequest(
      `${process.env.DRIVER_API_URL}/api/v1/organizations/${organizationId}/vehicles`,
      {
        method: 'POST',
        body: JSON.stringify(transformedData)
      }
    );
  }

  async getOrganizationVehicles(organizationId: string) {
    const result = await this.makeRequest(
      `${process.env.DRIVER_API_URL}/api/v1/organizations/${organizationId}/vehicles`,
      { method: 'GET' }
    );

    if (result.success && result.data) {
      if (Array.isArray(result.data)) {
        result.data = result.data.map(transformVehicleFromGo);
      }
    }

    return result;
  }

  async getOrganizationDrivers(organizationId: string) {
    return this.makeRequest(
      `${process.env.DRIVER_API_URL}/api/v1/organizations/${organizationId}/drivers`,
      { method: 'GET' }
    );
  }

  // Parcel Service (Port 8085) - Driver Trips
  async createDriverTrip(tripData: any) {
    const transformedData = transformTripToGo(tripData);
    return this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/driver/trips`,
      {
        method: 'POST',
        body: JSON.stringify(transformedData)
      }
    );
  }

  async getDriverTrips(params: {
    status?: string;
    page?: number;
    page_size?: number;
  } = {}) {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryString.append(key, value.toString());
      }
    });

    const result = await this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/driver/trips?${queryString.toString()}`,
      { method: 'GET' }
    );

    if (result.success && result.data) {
      if (result.data.trips) {
        result.data.trips = result.data.trips.map(transformTripFromGo);
      } else if (Array.isArray(result.data)) {
        result.data = result.data.map(transformTripFromGo);
      }
    }

    return result;
  }

  async getDriverTripDetails(tripId: string) {
    const result = await this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/driver/trips/${tripId}/details`,
      { method: 'GET' }
    );

    if (result.success && result.data) {
      result.data = transformTripFromGo(result.data);
    }

    return result;
  }

  async updateDriverTrip(tripId: string, updateData: any) {
    const transformedData = objectKeysToSnake(updateData);
    return this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/driver/trips/${tripId}`,
      {
        method: 'PUT',
        body: JSON.stringify(transformedData)
      }
    );
  }

  async addStopToTrip(tripId: string, stopData: any) {
    const transformedData = {
      address: stopData.address,
      city: stopData.city,
      country: stopData.country,
      location: {
        latitude: stopData.latitude,
        longitude: stopData.longitude
      },
      sequence: stopData.sequence,
      estimated_arrival: stopData.estimatedArrival,
      stop_type: stopData.stopType
    };

    return this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/driver/trips/${tripId}/stops`,
      {
        method: 'POST',
        body: JSON.stringify(transformedData)
      }
    );
  }

  // Parcel Service (Port 8085) - Organization Trips
  async createOrganizationTrip(organizationId: string, tripData: any) {
    const transformedData = transformTripToGo(tripData);
    return this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/organizations/${organizationId}/trips`,
      {
        method: 'POST',
        body: JSON.stringify(transformedData)
      }
    );
  }

  async getOrganizationTrips(organizationId: string, params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryString.append(key, value.toString());
      }
    });

    const result = await this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/organizations/${organizationId}/trips?${queryString.toString()}`,
      { method: 'GET' }
    );

    if (result.success && result.data) {
      if (result.data.trips) {
        result.data.trips = result.data.trips.map(transformTripFromGo);
      } else if (Array.isArray(result.data)) {
        result.data = result.data.map(transformTripFromGo);
      }
    }

    return result;
  }

  async getOrganizationTrip(organizationId: string, tripId: string) {
    const result = await this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/organizations/${organizationId}/trips/${tripId}`,
      { method: 'GET' }
    );

    if (result.success && result.data) {
      result.data = transformTripFromGo(result.data);
    }

    return result;
  }

  async updateOrganizationTrip(organizationId: string, tripId: string, updateData: any) {
    const transformedData = objectKeysToSnake(updateData);
    return this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/organizations/${organizationId}/trips/${tripId}`,
      {
        method: 'PUT',
        body: JSON.stringify(transformedData)
      }
    );
  }

  async cancelOrganizationTrip(organizationId: string, tripId: string, reason?: string) {
    return this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/organizations/${organizationId}/trips/${tripId}/cancel`,
      {
        method: 'POST',
        body: JSON.stringify({ reason: reason || 'Cancelled by user' })
      }
    );
  }

  async assignDriverToTrip(organizationId: string, tripId: string, driverId: string) {
    return this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/organizations/${organizationId}/trips/${tripId}/assign-driver`,
      {
        method: 'POST',
        body: JSON.stringify({ driver_id: driverId })
      }
    );
  }

  async getVehicleTrips(vehicleId: string, params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryString.append(key, value.toString());
      }
    });

    const result = await this.makeRequest(
      `${process.env.PARCEL_API_URL}/api/v1/vehicles/${vehicleId}/trips?${queryString.toString()}`,
      { method: 'GET' }
    );

    if (result.success && result.data) {
      if (result.data.trips) {
        result.data.trips = result.data.trips.map(transformTripFromGo);
      } else if (Array.isArray(result.data)) {
        result.data = result.data.map(transformTripFromGo);
      }
    }

    return result;
  }
}

// Helper function to create a client with session info
export function createGoBackendClient(sessionInfo?: SessionInfo): GoBackendClient {
  return new GoBackendClient(sessionInfo);
}

// Helper function to convert object keys to snake_case (needed for some transformations)
function objectKeysToSnake(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => objectKeysToSnake(item));
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = objectKeysToSnake(value);
  }

  return result;
}