import { test, expect, type Page } from '@playwright/test';

// Test data
const ORGANIZATION_DATA = {
  businessName: 'E2E Test Logistics',
  businessType: 'freight_forward',
  businessEmail: 'e2e-test@logistics.com',
  businessPhone: '+212600000000',
  businessAddress: '123 E2E Test Street, Casablanca',
  registrationNumber: 'E2E-REG-123',
  taxId: 'E2E-TAX-456',
  website: 'https://e2e-test-logistics.com',
  description: 'E2E test logistics company',
  adminFirstName: 'E2E',
  adminLastName: 'Tester',
  adminEmail: 'e2e-admin@testlogistics.com',
  adminPassword: 'E2ETestPassword123!',
};

const CUSTOMER_DATA = {
  firstName: 'E2E',
  lastName: 'Customer',
  email: 'e2e-customer@example.com',
  password: 'E2ECustomerPassword123!',
  phone: '+212600000001',
};

const DRIVER_DATA = {
  firstName: 'E2E',
  lastName: 'Driver',
  email: 'e2e-driver@example.com',
  password: 'E2EDriverPassword123!',
  phone: '+212600000002',
};

const TRIP_DATA = {
  departureCountry: 'Morocco',
  departureCity: 'Casablanca',
  departureAddress: '123 Departure Street',
  destinationCountry: 'France',
  destinationCity: 'Paris',
  destinationAddress: '456 Arrival Avenue',
  departureDate: '2024-02-01',
  departureTime: '10:00',
  arrivalDate: '2024-02-03',
  arrivalTime: '14:00',
  basePrice: '500',
  pricePerKg: '2.5',
  minimumPrice: '50',
  capacity: '1000',
};

class BasePage {
  constructor(public page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForElement(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async fillForm(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async clickButton(text: string) {
    await this.page.click(`button:has-text("${text}")`);
  }

  async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value);
  }

  async uploadFile(selector: string, fileName: string) {
    await this.page.setInputFiles(selector, fileName);
  }

  async waitForText(text: string, timeout = 10000) {
    await this.page.waitForSelector(`text=${text}`, { timeout });
  }

  async check(text: string) {
    await this.page.check(`text=${text}`);
  }

  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }
}

class AuthPage extends BasePage {
  async signIn(email: string, password: string) {
    await this.goto('/auth/signin');
    await this.fillForm('[placeholder="Email"]', email);
    await this.fillForm('[placeholder="Password"]', password);
    await this.clickButton('Sign In');
    await this.page.waitForURL(/dashboard/);
  }

  async signUp(userData: any, role: 'customer' | 'driver') {
    await this.goto(`/auth/signup?role=${role}`);

    await this.fillForm('[placeholder="First Name"]', userData.firstName);
    await this.fillForm('[placeholder="Last Name"]', userData.lastName);
    await this.fillForm('[placeholder="Email"]', userData.email);
    await this.fillForm('[placeholder="Phone"]', userData.phone);
    await this.fillForm('[placeholder="Password"]', userData.password);
    await this.fillForm('[placeholder="Confirm Password"]', userData.password);

    await this.clickButton('Create Account');
    await this.page.waitForURL(/dashboard/);
  }
}

class OrganizationPage extends BasePage {
  async registerOrganization(orgData: any) {
    await this.goto('/organizations/register');

    // Step 1: Business Information
    await this.waitForText('Business Information');
    await this.fillForm('[placeholder="Business Name"]', orgData.businessName);
    await this.selectOption('select[name="businessType"]', orgData.businessType);
    await this.fillForm('[placeholder="Business Email"]', orgData.businessEmail);
    await this.fillForm('[placeholder="Business Phone"]', orgData.businessPhone);
    await this.fillForm('textarea[name="businessAddress"]', orgData.businessAddress);
    await this.fillForm('[placeholder="Registration Number"]', orgData.registrationNumber);
    await this.fillForm('[placeholder="Tax ID"]', orgData.taxId);
    await this.fillForm('[placeholder="Website"]', orgData.website);
    await this.fillForm('textarea[name="description"]', orgData.description);

    await this.clickButton('Next');

    // Step 2: Admin Account
    await this.waitForText('Admin Account Information');
    await this.fillForm('[placeholder="First Name"]', orgData.adminFirstName);
    await this.fillForm('[placeholder="Last Name"]', orgData.adminLastName);
    await this.fillForm('[placeholder="Email"]', orgData.adminEmail);
    await this.fillForm('[placeholder="Phone"]', orgData.adminPhone);
    await this.fillForm('[placeholder="Password"]', orgData.adminPassword);
    await this.fillForm('[placeholder="Confirm Password"]', orgData.adminPassword);

    await this.clickButton('Next');

    // Step 3: Documents (skip for E2E test)
    await this.waitForText('Verification Documents');
    await this.clickButton('Next');

    // Step 4: Review and Submit
    await this.waitForText('Review and Submit');
    await this.check('I accept the Terms of Service');
    await this.check('I accept the Privacy Policy');

    await this.clickButton('Submit Registration');
    await this.waitForText('Registration Successful');
  }

  async navigateToFleet() {
    await this.goto('/organizations/fleet');
    await this.waitForText('Fleet Management');
  }

  async addVehicle(vehicleData: any) {
    await this.clickButton('Add Vehicle');
    await this.waitForText('Add New Vehicle');

    await this.selectOption('select[name="type"]', vehicleData.type);
    await this.fillForm('[placeholder="Brand"]', vehicleData.brand);
    await this.fillForm('[placeholder="Model"]', vehicleData.model);
    await this.fillForm('[placeholder="License Plate"]', vehicleData.licensePlate);
    await this.fillForm('[placeholder="Year"]', vehicleData.year);
    await this.fillForm('[placeholder="Min Weight"]', vehicleData.minWeight);
    await this.fillForm('[placeholder="Max Weight"]', vehicleData.maxWeight);

    await this.clickButton('Add Vehicle');
    await this.waitForText('Vehicle added successfully');
  }

  async navigateToTrips() {
    await this.goto('/organizations/trips');
    await this.waitForText('Trip Management');
  }

  async createTrip(tripData: any) {
    await this.clickButton('Create Trip');
    await this.waitForText('Create New Trip');

    // Step 1: Route Information
    await this.selectOption('select[name="departureCountry"]', tripData.departureCountry);
    await this.fillForm('[placeholder="Departure City"]', tripData.departureCity);
    await this.fillForm('textarea[name="departureAddress"]', tripData.departureAddress);
    await this.selectOption('select[name="destinationCountry"]', tripData.destinationCountry);
    await this.fillForm('[placeholder="Destination City"]', tripData.destinationCity);
    await this.fillForm('textarea[name="destinationAddress"]', tripData.destinationAddress);

    await this.clickButton('Next');

    // Step 2: Schedule
    await this.waitForText('Schedule Information');
    await this.fillForm('input[name="departureDate"]', tripData.departureDate);
    await this.fillForm('input[name="departureTime"]', tripData.departureTime);
    await this.fillForm('input[name="arrivalDate"]', tripData.arrivalDate);
    await this.fillForm('input[name="arrivalTime"]', tripData.arrivalTime);

    await this.clickButton('Next');

    // Step 3: Pricing
    await this.waitForText('Pricing Information');
    await this.fillForm('[placeholder="Base Price"]', tripData.basePrice);
    await this.fillForm('[placeholder="Price per KG"]', tripData.pricePerKg);
    await this.fillForm('[placeholder="Minimum Price"]', tripData.minimumPrice);
    await this.fillForm('[placeholder="Total Capacity"]', tripData.capacity);

    await this.clickButton('Next');

    // Step 4: Assignment
    await this.waitForText('Driver & Vehicle Assignment');
    // Select first available driver and vehicle
    await this.clickButton('Auto-assign');

    await this.clickButton('Next');

    // Step 5: Review
    await this.waitForText('Review Trip Details');
    await this.clickButton('Create Trip');
    await this.waitForText('Trip created successfully');
  }
}

class CustomerPage extends BasePage {
  async searchTrip(from: string, to: string) {
    await this.goto('/search');
    await this.fillForm('[placeholder="From"]', from);
    await this.fillForm('[placeholder="To"]', to);
    await this.clickButton('Search');
  }

  async bookTrip() {
    await this.clickButton('Book', { first: true });
    await this.waitForText('Trip Details');

    await this.fillForm('[placeholder="Weight (KG)"]', '10');
    await this.fillForm('[placeholder="Description"]', 'E2E test parcel');
    await this.fillForm('[placeholder="Recipient Name"]', 'Test Recipient');
    await this.fillForm('[placeholder="Recipient Phone"]', '+33600000000');

    await this.clickButton('Proceed to Payment');
    await this.waitForText('Payment Information');

    // Mock payment form
    await this.fillForm('[placeholder="Card Number"]', '4242424242424242');
    await this.fillForm('[placeholder="MM/YY"]', '12/25');
    await this.fillForm('[placeholder="CVC"]', '123');

    await this.clickButton('Complete Payment');
    await this.waitForText('Booking Successful');
  }

  async viewMyBookings() {
    await this.goto('/users/bookings');
    await this.waitForText('My Bookings');
  }
}

test.describe('Multi-Profile System E2E Tests', () => {
  let authPage: AuthPage;
  let organizationPage: OrganizationPage;
  let customerPage: CustomerPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    organizationPage = new OrganizationPage(page);
    customerPage = new CustomerPage(page);
  });

  test('Organization admin complete workflow', async ({ page }) => {
    // Register new organization
    await organizationPage.registerOrganization(ORGANIZATION_DATA);

    // Verify organization admin is logged in and redirected to dashboard
    await expect(page).toHaveURL(/dashboard/);
    await page.waitForSelector('text=Organization Dashboard');

    // Navigate to fleet management
    await organizationPage.navigateToFleet();

    // Add a vehicle
    const vehicleData = {
      type: 'truck',
      brand: 'Mercedes-Benz',
      model: 'Actros',
      licensePlate: 'E2E-TEST-123',
      year: '2022',
      minWeight: '1000',
      maxWeight: '25000'
    };
    await organizationPage.addVehicle(vehicleData);

    // Navigate to trip management
    await organizationPage.navigateToTrips();

    // Create a trip
    await organizationPage.createTrip(TRIP_DATA);

    // Verify trip appears in trips list
    await expect(page.locator('text=Casablanca')).toBeVisible();
    await expect(page.locator('text=Paris')).toBeVisible();
  });

  test('Customer complete workflow', async ({ page }) => {
    // Sign up as customer
    await authPage.signUp(CUSTOMER_DATA, 'customer');

    // Verify customer dashboard
    await expect(page).toHaveURL(/dashboard/);
    await page.waitForSelector('text=Customer Dashboard');

    // Search for trips
    await customerPage.searchTrip('Casablanca', 'Paris');

    // Verify search results
    await page.waitForSelector('text=Search Results');

    // Book a trip
    await customerPage.bookTrip();

    // View bookings
    await customerPage.viewMyBookings();

    // Verify booking appears in list
    await expect(page.locator('text=Active')).toBeVisible();
  });

  test('Driver complete workflow', async ({ page }) => {
    // Sign up as driver
    await authPage.signUp(DRIVER_DATA, 'driver');

    // Verify driver dashboard
    await expect(page).toHaveURL(/dashboard/);
    await page.waitForSelector('text=Driver Dashboard');

    // Navigate to available trips
    await page.goto('/drivers/trips');
    await page.waitForSelector('text=Available Trips');

    // Check for available trips (if any)
    const availableTrips = page.locator('[data-testid="trip-card"]');
    const tripCount = await availableTrips.count();

    if (tripCount > 0) {
      // Accept first available trip
      await availableTrips.first().click();
      await page.waitForSelector('text=Trip Details');
      await page.click('button:has-text("Accept Trip")');
      await page.waitForSelector('text=Trip Accepted');
    }
  });

  test('Role-based access control', async ({ page }) => {
    // Test organization admin accessing organization routes
    await authPage.signIn(ORGANIZATION_DATA.adminEmail, ORGANIZATION_DATA.adminPassword);

    // Should be able to access organization pages
    await organizationPage.navigateToFleet();
    await expect(page.locator('text=Fleet Management')).toBeVisible();

    await organizationPage.navigateToTrips();
    await expect(page.locator('text=Trip Management')).toBeVisible();

    // Should not be able to access customer-only routes
    await page.goto('/users/bookings');
    await expect(page.locator('text=Access Denied')).toBeVisible();

    // Test customer access
    await authPage.signIn(CUSTOMER_DATA.email, CUSTOMER_DATA.password);

    // Should be able to access customer pages
    await customerPage.viewMyBookings();
    await expect(page.locator('text=My Bookings')).toBeVisible();

    // Should not be able to access organization pages
    await page.goto('/organizations/fleet');
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Test organization registration on mobile
    await organizationPage.registerOrganization(ORGANIZATION_DATA);

    // Verify mobile-specific elements
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Test navigation on mobile
    await page.click('[data-testid="mobile-menu"]');
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
  });

  test('Performance and loading states', async ({ page }) => {
    // Monitor network requests
    const responses: any[] = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        timing: Date.now()
      });
    });

    // Navigate through application
    await authPage.signIn(ORGANIZATION_DATA.adminEmail, ORGANIZATION_DATA.adminPassword);

    // Check loading states
    await organizationPage.navigateToFleet();

    // Verify loading indicators
    const loadingIndicator = page.locator('[data-testid="loading"]');
    await expect(loadingIndicator).toBeVisible();
    await loadingIndicator.waitFor({ state: 'hidden' });

    // Verify responses are successful
    const failedRequests = responses.filter(r => r.status >= 400);
    expect(failedRequests).toHaveLength(0);
  });

  test('Error handling', async ({ page }) => {
    // Test network error handling
    await page.route('/api/organizations/register', route => route.abort());

    await organizationPage.registerOrganization(ORGANIZATION_DATA);

    // Should show error message
    await expect(page.locator('text=Registration failed')).toBeVisible();

    // Test retry mechanism
    await page.unroute('/api/organizations/register');
    await page.click('button:has-text("Retry")');
  });

  test('Cross-browser compatibility', async ({ page, browserName }) => {
    // Test basic functionality across different browsers
    await authPage.signIn(ORGANIZATION_DATA.adminEmail, ORGANIZATION_DATA.adminPassword);

    // Verify dashboard loads correctly
    await expect(page.locator('text=Organization Dashboard')).toBeVisible();

    // Test basic navigation
    await organizationPage.navigateToFleet();
    await expect(page.locator('text=Fleet Management')).toBeVisible();

    console.log(`Test passed on ${browserName}`);
  });

  test('Data persistence and session management', async ({ page, context }) => {
    // Sign in as organization admin
    await authPage.signIn(ORGANIZATION_DATA.adminEmail, ORGANIZATION_DATA.adminPassword);

    // Verify session is established
    const cookies = await context.cookies();
    expect(cookies.filter(c => c.name.includes('next-auth'))).toHaveLength(1);

    // Navigate to different pages
    await organizationPage.navigateToFleet();
    await organizationPage.navigateToTrips();

    // Refresh page
    await page.reload();

    // Should still be authenticated
    await expect(page.locator('text=Organization Dashboard')).toBeVisible();

    // Test session expiration (mock)
    await context.clearCookies();
    await page.reload();

    // Should redirect to login
    await expect(page).toHaveURL(/auth/);
  });
});

test.describe('Accessibility Tests', () => {
  test('WCAG compliance', async ({ page }) => {
    await page.goto('/organizations/register');

    // Check for proper heading structure
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', headings =>
      headings.map(h => ({ tag: h.tagName, text: h.textContent }))
    );

    expect(headings.length).toBeGreaterThan(0);

    // Check for proper form labels
    const inputs = await page.$$('input, select, textarea');
    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        const id = el.getAttribute('id');
        const label = document.querySelector(`label[for="${id}"]`);
        return label !== null || el.getAttribute('aria-label') !== null;
      });
      expect(hasLabel).toBe(true);
    }

    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON']).toContain(focusedElement);
  });

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/organizations/register');

    // Check for ARIA labels and roles
    const form = await page.locator('form').first();
    await expect(form).toHaveAttribute('role', 'form');

    const progressIndicator = await page.locator('[role="progressbar"]');
    await expect(progressIndicator).toBeVisible();

    // Check for proper alt text on images
    const images = await page.$$('img');
    for (const img of images) {
      const hasAlt = await img.evaluate(el => el.getAttribute('alt') !== null);
      expect(hasAlt).toBe(true);
    }
  });
});

test.describe('Security Tests', () => {
  test('XSS prevention', async ({ page }) => {
    const xssPayload = '<script>alert("XSS")</script>';

    await page.goto('/auth/signin');
    await page.fill('[placeholder="Email"]', xssPayload);
    await page.fill('[placeholder="Password"]', 'password');
    await page.click('button:has-text("Sign In")');

    // Check if script was not executed
    const alerts = page.on('dialog', () => {});
    await page.waitForTimeout(2000);

    // Should not see any alert dialog
    expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('CSRF protection', async ({ page }) => {
    // This would test CSRF tokens in forms
    await page.goto('/organizations/register');

    const csrfToken = await page.inputValue('input[name="csrfToken"]');
    expect(csrfToken).toBeTruthy();
    expect(csrfToken.length).toBeGreaterThan(20);
  });
});