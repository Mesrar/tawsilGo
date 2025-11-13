import { vehicleService } from '@/app/services/vehicleService';
import { apiClient } from '@/lib/api/api-client';

// Mock the apiClient
jest.mock('@/lib/api/api-client');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('VehicleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerVehicle', () => {
    it('should register a new vehicle successfully', async () => {
      const vehicleData = {
        type: 'truck' as const,
        brand: 'Mercedes-Benz',
        model: 'Actros 1845',
        licensePlate: '1234-A-56',
        year: 2022,
        capacityWeightMin: 1000,
        capacityWeightMax: 25000,
        capacityVolumeMin: 10,
        capacityVolumeMax: 50,
        features: ['gps', 'air_conditioning', 'lift_gate'],
        photos: ['https://example.com/photo1.jpg'],
        organizationId: 'org-123'
      };

      const mockResponse = {
        success: true,
        data: {
          id: 'vehicle-1',
          ...vehicleData,
          status: 'active' as const,
          isAvailable: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await vehicleService.registerVehicle(vehicleData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/api/vehicles/register',
        vehicleData
      );
      expect(result.success).toBe(true);
      expect(result.data.brand).toBe('Mercedes-Benz');
      expect(result.data.status).toBe('active');
    });

    it('should handle vehicle registration validation errors', async () => {
      const invalidData = {
        type: 'invalid_type' as any,
        brand: '', // Empty brand
        licensePlate: 'INVALID-PLATE', // Invalid format
        year: 1800, // Invalid year
        // Missing required fields
      };

      mockedApiClient.post.mockRejectedValue({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid vehicle data',
          details: {
            brand: ['Brand is required'],
            year: ['Year must be valid'],
            type: ['Invalid vehicle type']
          }
        }
      });

      await expect(vehicleService.registerVehicle(invalidData))
        .rejects.toThrow();
    });
  });

  describe('getVehicles', () => {
    it('should fetch vehicles with filters', async () => {
      const mockVehiclesData = {
        vehicles: [
          {
            id: 'vehicle-1',
            type: 'truck',
            brand: 'Mercedes-Benz',
            model: 'Actros 1845',
            licensePlate: '1234-A-56',
            year: 2022,
            capacityWeightMin: 1000,
            capacityWeightMax: 25000,
            capacityVolumeMin: 10,
            capacityVolumeMax: 50,
            features: ['gps', 'air_conditioning'],
            status: 'active',
            isAvailable: true,
            photos: ['https://example.com/photo1.jpg'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            organizationId: 'org-123',
            ownerId: 'user-1',
            _count: {
              trips: 25,
              maintenanceRecords: 3
            }
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 3,
          totalItems: 25,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPreviousPage: false
        },
        stats: {
          totalVehicles: 25,
          activeVehicles: 20,
          availableVehicles: 18,
          inMaintenanceVehicles: 2,
          totalCapacity: 25000,
          averageUtilization: 75
        }
      };

      mockedApiClient.get.mockResolvedValue({
        success: true,
        data: mockVehiclesData
      });

      const params = {
        page: 1,
        limit: 10,
        type: 'truck',
        status: 'active'
      };

      const result = await vehicleService.getVehicles(params);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        '/api/vehicles?page=1&limit=10&type=truck&status=active'
      );
      expect(result.success).toBe(true);
      expect(result.data.vehicles).toHaveLength(1);
      expect(result.data.vehicles[0].brand).toBe('Mercedes-Benz');
      expect(result.data.stats.totalVehicles).toBe(25);
    });

    it('should handle empty vehicles list', async () => {
      const mockResponse = {
        success: true,
        data: {
          vehicles: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPreviousPage: false
          },
          stats: {
            totalVehicles: 0,
            activeVehicles: 0,
            availableVehicles: 0,
            inMaintenanceVehicles: 0,
            totalCapacity: 0,
            averageUtilization: 0
          }
        }
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await vehicleService.getVehicles();

      expect(result.success).toBe(true);
      expect(result.data.vehicles).toHaveLength(0);
      expect(result.data.stats.totalVehicles).toBe(0);
    });
  });

  describe('getVehicleById', () => {
    it('should fetch vehicle details by ID', async () => {
      const mockVehicleData = {
        id: 'vehicle-1',
        type: 'truck',
        brand: 'Mercedes-Benz',
        model: 'Actros 1845',
        licensePlate: '1234-A-56',
        year: 2022,
        capacityWeightMin: 1000,
        capacityWeightMax: 25000,
        capacityVolumeMin: 10,
        capacityVolumeMax: 50,
        features: ['gps', 'air_conditioning', 'lift_gate'],
        status: 'active',
        isAvailable: true,
        photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
        documents: [
          {
            id: 'doc-1',
            type: 'insurance',
            url: 'https://example.com/insurance.pdf',
            expiryDate: '2024-12-31'
          }
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        organizationId: 'org-123',
        ownerId: 'user-1',
        stats: {
          totalTrips: 25,
          totalDistance: 15000,
          averageFuelEfficiency: 8.5,
          maintenanceCosts: 5000,
          utilizationRate: 85
        }
      };

      mockedApiClient.get.mockResolvedValue({
        success: true,
        data: mockVehicleData
      });

      const result = await vehicleService.getVehicleById('vehicle-1');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/vehicles/vehicle-1');
      expect(result.success).toBe(true);
      expect(result.data.brand).toBe('Mercedes-Benz');
      expect(result.data.stats.totalTrips).toBe(25);
    });

    it('should handle vehicle not found', async () => {
      mockedApiClient.get.mockRejectedValue({
        success: false,
        error: {
          code: 'VEHICLE_NOT_FOUND',
          message: 'Vehicle with ID not-found does not exist'
        }
      });

      await expect(vehicleService.getVehicleById('not-found'))
        .rejects.toThrow();
    });
  });

  describe('updateVehicle', () => {
    it('should update vehicle information successfully', async () => {
      const updateData = {
        features: ['gps', 'air_conditioning', 'lift_gate', 'refrigeration'],
        photos: ['https://example.com/new-photo.jpg'],
        status: 'maintenance' as const
      };

      const mockResponse = {
        success: true,
        data: {
          id: 'vehicle-1',
          ...updateData,
          updatedAt: new Date().toISOString()
        }
      };

      mockedApiClient.put.mockResolvedValue(mockResponse);

      const result = await vehicleService.updateVehicle('vehicle-1', updateData);

      expect(mockedApiClient.put).toHaveBeenCalledWith(
        '/api/vehicles/vehicle-1',
        updateData
      );
      expect(result.success).toBe(true);
      expect(result.data.features).toContain('refrigeration');
      expect(result.data.status).toBe('maintenance');
    });
  });

  describe('addMaintenanceRecord', () => {
    it('should add maintenance record successfully', async () => {
      const maintenanceData = {
        type: 'routine' as const,
        description: 'Oil change and filter replacement',
        cost: 250,
        odometerReading: 50000,
        nextMaintenanceOdometer: 60000,
        performedBy: 'Auto Service Center',
        notes: 'Used synthetic oil'
      };

      const mockResponse = {
        success: true,
        data: {
          id: 'maintenance-1',
          vehicleId: 'vehicle-1',
          ...maintenanceData,
          performedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await vehicleService.addMaintenanceRecord('vehicle-1', maintenanceData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/api/vehicles/vehicle-1/maintenance',
        maintenanceData
      );
      expect(result.success).toBe(true);
      expect(result.data.type).toBe('routine');
      expect(result.data.cost).toBe(250);
    });
  });

  describe('getMaintenanceRecords', () => {
    it('should fetch maintenance records for a vehicle', async () => {
      const mockMaintenanceData = {
        records: [
          {
            id: 'maintenance-1',
            vehicleId: 'vehicle-1',
            type: 'routine',
            description: 'Oil change',
            cost: 250,
            odometerReading: 50000,
            nextMaintenanceOdometer: 60000,
            performedBy: 'Auto Service Center',
            notes: 'Synthetic oil used',
            performedAt: '2024-01-15T00:00:00Z',
            createdAt: '2024-01-15T00:00:00Z'
          },
          {
            id: 'maintenance-2',
            vehicleId: 'vehicle-1',
            type: 'repair',
            description: 'Brake pad replacement',
            cost: 450,
            odometerReading: 48000,
            performedBy: 'Brake Specialist',
            notes: 'Front brake pads replaced',
            performedAt: '2024-01-10T00:00:00Z',
            createdAt: '2024-01-10T00:00:00Z'
          }
        ],
        stats: {
          totalRecords: 2,
          totalCosts: 700,
          averageCostPerRecord: 350,
          lastMaintenanceAt: '2024-01-15T00:00:00Z',
          nextMaintenanceDue: 60000,
          currentOdometer: 52000
        }
      };

      mockedApiClient.get.mockResolvedValue({
        success: true,
        data: mockMaintenanceData
      });

      const result = await vehicleService.getMaintenanceRecords('vehicle-1');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/vehicles/vehicle-1/maintenance');
      expect(result.success).toBe(true);
      expect(result.data.records).toHaveLength(2);
      expect(result.data.stats.totalCosts).toBe(700);
    });
  });

  describe('getVehicleAnalytics', () => {
    it('should fetch vehicle analytics', async () => {
      const mockAnalyticsData = {
        overview: {
          totalVehicles: 25,
          activeVehicles: 20,
          availableVehicles: 18,
          inMaintenanceVehicles: 2,
          averageAge: 2.5,
          totalCapacity: 25000
        },
        utilization: {
          averageUtilizationRate: 75,
          mostUsedVehicle: {
            id: 'vehicle-1',
            brand: 'Mercedes-Benz',
            utilizationRate: 95
          },
          leastUsedVehicle: {
            id: 'vehicle-5',
            brand: 'Iveco',
            utilizationRate: 45
          }
        },
        performance: {
          averageFuelEfficiency: 8.5,
          totalDistanceTraveled: 150000,
          averageTripDuration: 12.5,
          onTimePerformance: 92
        },
        costs: {
          totalMaintenanceCosts: 15000,
          averageCostPerVehicle: 600,
          costPerKm: 0.10,
          fuelCosts: 50000,
          insuranceCosts: 12000
        },
        trends: [
          {
            month: '2024-01',
            utilization: 70,
            costs: 2000,
            distance: 12000
          },
          {
            month: '2024-02',
            utilization: 75,
            costs: 1800,
            distance: 13500
          }
        ]
      };

      mockedApiClient.get.mockResolvedValue({
        success: true,
        data: mockAnalyticsData
      });

      const result = await vehicleService.getVehicleAnalytics();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/vehicles/analytics');
      expect(result.success).toBe(true);
      expect(result.data.overview.totalVehicles).toBe(25);
      expect(result.data.utilization.averageUtilizationRate).toBe(75);
      expect(result.data.performance.averageFuelEfficiency).toBe(8.5);
    });
  });

  describe('uploadVehicleDocument', () => {
    it('should upload vehicle document successfully', async () => {
      const file = new File(['test'], 'insurance.pdf', { type: 'application/pdf' });
      const documentType = 'insurance';
      const expiryDate = '2024-12-31';

      const mockResponse = {
        success: true,
        data: {
          id: 'doc-1',
          type: documentType,
          url: 'https://storage.example.com/insurance.pdf',
          expiryDate,
          uploadedAt: new Date().toISOString()
        }
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await vehicleService.uploadVehicleDocument('vehicle-1', file, documentType, expiryDate);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/api/vehicles/vehicle-1/documents',
        expect.objectContaining({
          file: expect.any(FormData)
        })
      );
      expect(result.success).toBe(true);
      expect(result.data.type).toBe('insurance');
      expect(result.data.expiryDate).toBe(expiryDate);
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(vehicleService.getVehicles())
        .rejects.toThrow('Network error');
    });

    it('should handle API error responses', async () => {
      mockedApiClient.get.mockRejectedValue({
        success: false,
        error: {
          code: 'VEHICLE_ACCESS_DENIED',
          message: 'Access denied to vehicle information'
        }
      });

      await expect(vehicleService.getVehicles())
        .rejects.toThrow();
    });
  });
});