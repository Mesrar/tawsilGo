import { organizationService } from '@/app/services/organizationService';
import { apiClient } from '@/lib/api/api-client';

// Mock the apiClient
jest.mock('@/lib/api/api-client');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('OrganizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new organization successfully', async () => {
      const mockRegistrationData = {
        businessName: 'Test Logistics Company',
        businessType: 'freight_forward' as const,
        businessEmail: 'test@logistics.com',
        businessPhone: '+212600000000',
        businessAddress: '123 Business St',
        businessCity: 'Casablanca',
        businessCountry: 'Morocco',
        registrationNumber: 'REG123456',
        taxId: 'TAX123456',
        website: 'https://testlogistics.com',
        description: 'A test logistics company',
        adminFirstName: 'John',
        adminLastName: 'Doe',
        adminEmail: 'john.doe@testlogistics.com',
        adminPhone: '+212600000001',
        adminPassword: 'SecurePassword123!',
        acceptTerms: true,
        acceptPrivacy: true
      };

      const mockResponse = {
        success: true,
        data: {
          organization: {
            id: 'org-123',
            businessName: 'Test Logistics Company',
            businessType: 'freight_forward',
            email: 'test@logistics.com',
            verificationStatus: 'pending' as const,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          admin: {
            id: 'admin-123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@testlogistics.com',
            role: 'organization_admin' as const,
            isActive: true,
            createdAt: new Date().toISOString()
          }
        },
        message: 'Organization registered successfully'
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await organizationService.register(mockRegistrationData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/api/organizations/register',
        mockRegistrationData,
        { requireAuth: false }
      );
      expect(result.success).toBe(true);
      expect(result.data.organization.businessName).toBe('Test Logistics Company');
      expect(result.data.organization.verificationStatus).toBe('pending');
    });

    it('should handle registration validation errors', async () => {
      const invalidData = {
        businessName: '', // Invalid empty business name
        businessType: 'invalid_type' as any,
        businessEmail: 'invalid-email', // Invalid email format
        // Missing required fields
      };

      const mockErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: {
            businessName: ['Business name is required'],
            businessEmail: ['Invalid email format'],
            businessType: ['Invalid business type']
          }
        }
      };

      mockedApiClient.post.mockRejectedValue(mockErrorResponse);

      await expect(organizationService.register(invalidData))
        .rejects.toThrow();
    });
  });

  describe('getCurrentOrganization', () => {
    it('should fetch current organization details', async () => {
      const mockOrganizationData = {
        id: 'org-123',
        businessName: 'Test Logistics',
        businessType: 'freight_forward',
        email: 'test@logistics.com',
        phone: '+212600000000',
        address: '123 Business St',
        city: 'Casablanca',
        country: 'Morocco',
        registrationNumber: 'REG123456',
        taxId: 'TAX123456',
        website: 'https://testlogistics.com',
        description: 'A test logistics company',
        logo: 'https://example.com/logo.png',
        verificationStatus: 'verified' as const,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        adminId: 'admin-123',
        _count: {
          vehicles: 10,
          drivers: 15,
          trips: 100
        },
        stats: {
          totalVehicles: 10,
          activeVehicles: 8,
          totalDrivers: 15,
          activeDrivers: 12,
          completedTrips: 95,
          scheduledTrips: 5,
          averageRating: 4.8,
          totalRevenue: 150000
        }
      };

      mockedApiClient.get.mockResolvedValue({
        success: true,
        data: mockOrganizationData
      });

      const result = await organizationService.getCurrentOrganization();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/organizations/current');
      expect(result.success).toBe(true);
      expect(result.data.businessName).toBe('Test Logistics');
      expect(result.data.verificationStatus).toBe('verified');
      expect(result.data.stats.totalVehicles).toBe(10);
    });

    it('should handle unauthorized access', async () => {
      mockedApiClient.get.mockRejectedValue({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User is not an organization admin'
        }
      });

      await expect(organizationService.getCurrentOrganization())
        .rejects.toThrow();
    });
  });

  describe('updateProfile', () => {
    it('should update organization profile successfully', async () => {
      const updateData = {
        businessName: 'Updated Logistics Company',
        description: 'Updated description',
        website: 'https://updated-logistics.com',
        phone: '+212600000999'
      };

      const mockResponse = {
        success: true,
        data: {
          id: 'org-123',
          businessName: 'Updated Logistics Company',
          description: 'Updated description',
          website: 'https://updated-logistics.com',
          phone: '+212600000999',
          updatedAt: new Date().toISOString()
        }
      };

      mockedApiClient.put.mockResolvedValue(mockResponse);

      const result = await organizationService.updateProfile(updateData);

      expect(mockedApiClient.put).toHaveBeenCalledWith(
        '/api/organizations/profile',
        updateData
      );
      expect(result.success).toBe(true);
      expect(result.data.businessName).toBe('Updated Logistics Company');
    });
  });

  describe('getTrips', () => {
    it('should fetch organization trips with pagination', async () => {
      const mockTripsData = {
        trips: [
          {
            id: 'trip-1',
            departureCountry: 'Morocco',
            departureCity: 'Casablanca',
            destinationCountry: 'France',
            destinationCity: 'Paris',
            departureTime: '2024-01-15T10:00:00Z',
            arrivalTime: '2024-01-17T14:00:00Z',
            basePrice: 500,
            pricePerKg: 2.5,
            status: 'scheduled' as const,
            totalCapacity: 1000,
            remainingCapacity: 750,
            currency: 'EUR',
            driver: {
              id: 'driver-1',
              name: 'Driver One',
              email: 'driver1@example.com'
            },
            vehicle: {
              id: 'vehicle-1',
              brand: 'Mercedes',
              model: 'Actros',
              licensePlate: '123-ABC-456'
            }
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 5,
          totalItems: 50,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPreviousPage: false
        },
        stats: {
          totalTrips: 50,
          scheduledTrips: 10,
          activeTrips: 8,
          completedTrips: 30,
          cancelledTrips: 2,
          averageRevenuePerTrip: 750
        }
      };

      mockedApiClient.get.mockResolvedValue({
        success: true,
        data: mockTripsData
      });

      const params = {
        page: 1,
        limit: 10,
        status: 'scheduled'
      };

      const result = await organizationService.getTrips(params);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        '/api/organizations/trips?page=1&limit=10&status=scheduled'
      );
      expect(result.success).toBe(true);
      expect(result.data.trips).toHaveLength(1);
      expect(result.data.trips[0].departureCity).toBe('Casablanca');
      expect(result.data.stats.totalTrips).toBe(50);
    });

    it('should handle empty trips list', async () => {
      const mockResponse = {
        success: true,
        data: {
          trips: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPreviousPage: false
          },
          stats: {
            totalTrips: 0,
            scheduledTrips: 0,
            activeTrips: 0,
            completedTrips: 0,
            cancelledTrips: 0,
            averageRevenuePerTrip: 0
          }
        }
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await organizationService.getTrips();

      expect(result.success).toBe(true);
      expect(result.data.trips).toHaveLength(0);
      expect(result.data.stats.totalTrips).toBe(0);
    });
  });

  describe('createTrip', () => {
    it('should create a new trip successfully', async () => {
      const tripData = {
        departureCountry: 'Morocco',
        departureCity: 'Casablanca',
        departureAddress: '123 Departure St',
        destinationCountry: 'France',
        destinationCity: 'Paris',
        destinationAddress: '456 Arrival Ave',
        departureTime: '2024-02-01T10:00:00Z',
        arrivalTime: '2024-02-03T14:00:00Z',
        basePrice: 600,
        pricePerKg: 3,
        minimumPrice: 50,
        currency: 'EUR',
        totalCapacity: 1500,
        notes: 'Special handling required',
        vehicleId: 'vehicle-1',
        driverId: 'driver-1'
      };

      const mockResponse = {
        success: true,
        data: {
          id: 'trip-new',
          ...tripData,
          status: 'scheduled' as const,
          remainingCapacity: 1500,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await organizationService.createTrip(tripData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/api/organizations/trips',
        tripData
      );
      expect(result.success).toBe(true);
      expect(result.data.departureCity).toBe('Casablanca');
      expect(result.data.status).toBe('scheduled');
    });
  });

  describe('getDrivers', () => {
    it('should fetch organization drivers', async () => {
      const mockDriversData = {
        drivers: [
          {
            id: 'driver-1',
            organizationId: 'org-123',
            userId: 'user-1',
            name: 'Driver One',
            email: 'driver1@example.com',
            phone: '+212600000001',
            role: 'organization_driver' as const,
            status: 'active' as const,
            isVerified: true,
            joinedAt: '2024-01-01T00:00:00Z',
            lastActiveAt: '2024-01-15T10:00:00Z',
            currentVehicleId: 'vehicle-1',
            _count: {
              trips: 25,
              activeTrips: 2
            },
            stats: {
              completedTrips: 23,
              averageRating: 4.7,
              totalDistance: 15000,
              onTimePercentage: 95
            }
          }
        ],
        stats: {
          totalDrivers: 1,
          activeDrivers: 1,
          verifiedDrivers: 1,
          unverifiedDrivers: 0,
          averageRating: 4.7,
          totalTrips: 25
        }
      };

      mockedApiClient.get.mockResolvedValue({
        success: true,
        data: mockDriversData
      });

      const result = await organizationService.getDrivers();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/organizations/drivers');
      expect(result.success).toBe(true);
      expect(result.data.drivers).toHaveLength(1);
      expect(result.data.drivers[0].name).toBe('Driver One');
      expect(result.data.stats.totalDrivers).toBe(1);
    });
  });

  describe('uploadDocument', () => {
    it('should upload document successfully', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const documentType = 'commercial_register';

      const mockResponse = {
        success: true,
        data: {
          id: 'doc-1',
          type: documentType,
          filename: 'commercial_register.pdf',
          url: 'https://storage.example.com/commercial_register.pdf',
          uploadedAt: new Date().toISOString()
        }
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await organizationService.uploadDocument(file, documentType);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/api/organizations/documents',
        expect.objectContaining({
          file: expect.any(FormData)
        })
      );
      expect(result.success).toBe(true);
      expect(result.data.type).toBe(documentType);
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(organizationService.getCurrentOrganization())
        .rejects.toThrow('Network error');
    });

    it('should handle API error responses', async () => {
      mockedApiClient.get.mockRejectedValue({
        success: false,
        error: {
          code: 'ORGANIZATION_NOT_FOUND',
          message: 'Organization not found'
        }
      });

      await expect(organizationService.getCurrentOrganization())
        .rejects.toThrow();
    });
  });
});