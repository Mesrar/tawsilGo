import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { OrganizationRegistrationPage } from '@/app/[locale]/(site)/organizations/register/page';
import { organizationService } from '@/app/services/organizationService';

// Mock the organization service
jest.mock('@/app/services/organizationService');
const mockOrganizationService = organizationService as jest.Mocked<typeof organizationService>;

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSession: () => ({ data: null, status: 'unauthenticated' })
}));

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}));

describe('Organization Registration Integration', () => {
  let queryClient: QueryClient;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {component}
        </SessionProvider>
      </QueryClientProvider>
    );
  };

  describe('Complete Registration Flow', () => {
    it('should successfully complete the 4-step organization registration', async () => {
      // Mock successful registration response
      mockOrganizationService.register.mockResolvedValue({
        success: true,
        data: {
          organization: {
            id: 'org-123',
            businessName: 'Test Logistics Company',
            businessType: 'freight_forward',
            email: 'test@logistics.com',
            verificationStatus: 'pending',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          admin: {
            id: 'admin-123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@testlogistics.com',
            role: 'organization_admin',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        },
        message: 'Organization registered successfully'
      });

      renderWithProviders(<OrganizationRegistrationPage />);

      // Step 1: Business Information
      await waitFor(() => {
        expect(screen.getByText(/Business Information/)).toBeInTheDocument();
      });

      // Fill business information
      await act(async () => {
        await user.type(screen.getByLabelText(/Business Name/i), 'Test Logistics Company');
        await user.selectOptions(screen.getByLabelText(/Business Type/i), 'freight_forward');
        await user.type(screen.getByLabelText(/Business Email/i), 'test@logistics.com');
        await user.type(screen.getByLabelText(/Business Phone/i), '+212600000000');
        await user.type(screen.getByLabelText(/Business Address/i), '123 Business Street, Casablanca');
        await user.type(screen.getByLabelText(/Registration Number/i), 'REG123456');
        await user.type(screen.getByLabelText(/Tax ID/i), 'TAX123456');
        await user.type(screen.getByLabelText(/Website/i), 'https://testlogistics.com');
        await user.type(screen.getByLabelText(/Description/i), 'A comprehensive logistics solution provider');
      });

      // Click next to go to step 2
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Next/i }));
      });

      // Step 2: Admin Account Information
      await waitFor(() => {
        expect(screen.getByText(/Admin Account Information/)).toBeInTheDocument();
      });

      // Fill admin account information
      await act(async () => {
        await user.type(screen.getByLabelText(/First Name/i), 'John');
        await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
        await user.type(screen.getByLabelText(/Email/i), 'john.doe@testlogistics.com');
        await user.type(screen.getByLabelText(/Phone/i), '+212600000001');
        await user.type(screen.getByLabelText(/Password/i), 'SecurePassword123!');
        await user.type(screen.getByLabelText(/Confirm Password/i), 'SecurePassword123!');
      });

      // Click next to go to step 3
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Next/i }));
      });

      // Step 3: Verification Documents
      await waitFor(() => {
        expect(screen.getByText(/Verification Documents/)).toBeInTheDocument();
      });

      // Mock file upload
      const commercialRegisterFile = new File(['test'], 'commercial-register.pdf', { type: 'application/pdf' });
      const taxIdFile = new File(['test'], 'tax-id.pdf', { type: 'application/pdf' });

      // Upload files
      await act(async () => {
        const commercialRegisterInput = screen.getByLabelText(/Commercial Register/i);
        await user.upload(commercialRegisterInput, commercialRegisterFile);

        const taxIdInput = screen.getByLabelText(/Tax ID Document/i);
        await user.upload(taxIdInput, taxIdFile);
      });

      // Click next to go to step 4
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Next/i }));
      });

      // Step 4: Review and Submit
      await waitFor(() => {
        expect(screen.getByText(/Review and Submit/i)).toBeInTheDocument();
      });

      // Verify all information is displayed correctly
      expect(screen.getByText('Test Logistics Company')).toBeInTheDocument();
      expect(screen.getByText('freight_forward')).toBeInTheDocument();
      expect(screen.getByText('test@logistics.com')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@testlogistics.com')).toBeInTheDocument();

      // Accept terms and privacy policy
      await act(async () => {
        await user.click(screen.getByLabelText(/I accept the Terms of Service/i));
        await user.click(screen.getByLabelText(/I accept the Privacy Policy/i));
      });

      // Submit registration
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Submit Registration/i }));
      });

      // Verify registration service was called with correct data
      await waitFor(() => {
        expect(mockOrganizationService.register).toHaveBeenCalledWith(
          expect.objectContaining({
            businessName: 'Test Logistics Company',
            businessType: 'freight_forward',
            businessEmail: 'test@logistics.com',
            adminFirstName: 'John',
            adminLastName: 'Doe',
            adminEmail: 'john.doe@testlogistics.com',
            acceptTerms: true,
            acceptPrivacy: true
          })
        );
      });

      // Verify success message
      await waitFor(() => {
        expect(screen.getByText(/Registration Successful/i)).toBeInTheDocument();
        expect(screen.getByText(/Organization registered successfully/i)).toBeInTheDocument();
      });
    });

    it('should handle validation errors in business information step', async () => {
      renderWithProviders(<OrganizationRegistrationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Business Information/)).toBeInTheDocument();
      });

      // Try to proceed without filling required fields
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Next/i }));
      });

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/Business Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Business Email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Business Phone is required/i)).toBeInTheDocument();
      });
    });

    it('should handle password mismatch in admin account step', async () => {
      renderWithProviders(<OrganizationRegistrationPage />);

      // Complete step 1
      await waitFor(() => {
        expect(screen.getByText(/Business Information/)).toBeInTheDocument();
      });

      await act(async () => {
        await user.type(screen.getByLabelText(/Business Name/i), 'Test Logistics');
        await user.type(screen.getByLabelText(/Business Email/i), 'test@logistics.com');
        await user.type(screen.getByLabelText(/Business Phone/i), '+212600000000');
        await user.type(screen.getByLabelText(/Business Address/i), '123 Business St');
        await user.click(screen.getByRole('button', { name: /Next/i }));
      });

      // Step 2: Fill admin info with mismatched passwords
      await waitFor(() => {
        expect(screen.getByText(/Admin Account Information/)).toBeInTheDocument();
      });

      await act(async () => {
        await user.type(screen.getByLabelText(/First Name/i), 'John');
        await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
        await user.type(screen.getByLabelText(/Email/i), 'admin@testlogistics.com');
        await user.type(screen.getByLabelText(/Password/i), 'Password123!');
        await user.type(screen.getByLabelText(/Confirm Password/i), 'DifferentPassword123!');
        await user.click(screen.getByRole('button', { name: /Next/i }));
      });

      // Should show password mismatch error
      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should handle registration API errors', async () => {
      // Mock API error
      mockOrganizationService.register.mockRejectedValue({
        success: false,
        error: {
          code: 'BUSINESS_EMAIL_EXISTS',
          message: 'An organization with this email already exists'
        }
      });

      renderWithProviders(<OrganizationRegistrationPage />);

      // Complete all steps
      await completeRegistrationSteps(user);

      // Submit registration
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Submit Registration/i }));
      });

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/An organization with this email already exists/i)).toBeInTheDocument();
      });
    });

    it('should navigate between steps correctly', async () => {
      renderWithProviders(<OrganizationRegistrationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Business Information/)).toBeInTheDocument();
      });

      // Fill step 1
      await act(async () => {
        await user.type(screen.getByLabelText(/Business Name/i), 'Test Logistics');
        await user.type(screen.getByLabelText(/Business Email/i), 'test@logistics.com');
        await user.type(screen.getByLabelText(/Business Phone/i), '+212600000000');
        await user.type(screen.getByLabelText(/Business Address/i), '123 Business St');
      });

      // Go to step 2
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Next/i }));
      });

      await waitFor(() => {
        expect(screen.getByText(/Admin Account Information/)).toBeInTheDocument();
      });

      // Go back to step 1
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Previous/i }));
      });

      await waitFor(() => {
        expect(screen.getByText(/Business Information/)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Logistics')).toBeInTheDocument();
      });

      // Progress indicator should show correct step
      expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
    });
  });

  describe('Form Persistence', () => {
    it('should save form data to session storage', async () => {
      const sessionStorageSetSpy = jest.spyOn(Storage.prototype, 'setItem');

      renderWithProviders(<OrganizationRegistrationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Business Information/)).toBeInTheDocument();
      });

      // Fill form data
      await act(async () => {
        await user.type(screen.getByLabelText(/Business Name/i), 'Test Logistics');
        await user.type(screen.getByLabelText(/Business Email/i), 'test@logistics.com');
      });

      // Should save to session storage
      expect(sessionStorageSetSpy).toHaveBeenCalledWith(
        'organization-registration-data',
        expect.stringContaining('Test Logistics')
      );
    });

    it('should restore form data from session storage', async () => {
      const savedData = {
        businessName: 'Saved Logistics',
        businessEmail: 'saved@logistics.com',
        businessPhone: '+212600000000',
        businessAddress: '123 Saved St',
        step: 1
      };

      const sessionStorageGetSpy = jest.spyOn(Storage.prototype, 'getItem');
      sessionStorageGetSpy.mockReturnValue(JSON.stringify(savedData));

      renderWithProviders(<OrganizationRegistrationPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Saved Logistics')).toBeInTheDocument();
        expect(screen.getByDisplayValue('saved@logistics.com')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', async () => {
      renderWithProviders(<OrganizationRegistrationPage />);

      await waitFor(() => {
        expect(screen.getByRole('form')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });

      // Progress indicator should be accessible
      const progressElements = screen.getAllByRole('listitem');
      expect(progressElements).toHaveLength(4);

      // Form fields should have proper labels
      expect(screen.getByLabelText(/Business Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Business Email/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      renderWithProviders(<OrganizationRegistrationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Business Information/)).toBeInTheDocument();
      });

      // Tab through form fields
      await act(async () => {
        await user.tab(); // Should focus business name
        expect(screen.getByLabelText(/Business Name/i)).toHaveFocus();

        await user.tab(); // Should focus business type
        expect(screen.getByLabelText(/Business Type/i)).toHaveFocus();
      });
    });
  });
});

// Helper function to complete all registration steps
async function completeRegistrationSteps(user: ReturnType<typeof userEvent.setup>) {
  // Step 1
  await act(async () => {
    await user.type(screen.getByLabelText(/Business Name/i), 'Test Logistics');
    await user.type(screen.getByLabelText(/Business Email/i), 'test@logistics.com');
    await user.type(screen.getByLabelText(/Business Phone/i), '+212600000000');
    await user.type(screen.getByLabelText(/Business Address/i), '123 Business St');
    await user.click(screen.getByRole('button', { name: /Next/i }));
  });

  // Step 2
  await waitFor(() => {
    expect(screen.getByText(/Admin Account Information/)).toBeInTheDocument();
  });

  await act(async () => {
    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'admin@testlogistics.com');
    await user.type(screen.getByLabelText(/Password/i), 'Password123!');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /Next/i }));
  });

  // Step 3
  await waitFor(() => {
    expect(screen.getByText(/Verification Documents/)).toBeInTheDocument();
  });

  // Mock file uploads
  const file1 = new File(['test'], 'doc1.pdf', { type: 'application/pdf' });
  const file2 = new File(['test'], 'doc2.pdf', { type: 'application/pdf' });

  await act(async () => {
    await user.upload(screen.getByLabelText(/Commercial Register/i), file1);
    await user.upload(screen.getByLabelText(/Tax ID Document/i), file2);
    await user.click(screen.getByRole('button', { name: /Next/i }));
  });

  // Step 4
  await waitFor(() => {
    expect(screen.getByText(/Review and Submit/i)).toBeInTheDocument();
  });

  await act(async () => {
    await user.click(screen.getByLabelText(/I accept the Terms of Service/i));
    await user.click(screen.getByLabelText(/I accept the Privacy Policy/i));
  });
}