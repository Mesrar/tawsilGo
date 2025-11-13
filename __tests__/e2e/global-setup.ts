import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test setup...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the app to be ready
    await page.goto(config.webServer?.url || 'http://localhost:3000');
    await page.waitForSelector('body', { timeout: 30000 });

    // Check if the app is running properly
    const isReady = await page.evaluate(() => {
      return document.readyState === 'complete';
    });

    if (!isReady) {
      throw new Error('Application is not ready for testing');
    }

    console.log('✅ Application is ready for E2E testing');

    // Create test users and organizations if needed
    await setupTestData(page);

  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

async function setupTestData(page: any) {
  console.log('📋 Setting up test data...');

  try {
    // Check if we can access the API
    const response = await page.request.get('/api/health');

    if (response.status() !== 200) {
      console.warn('⚠️ Health check failed, but continuing with tests...');
    }

    // You can add more setup logic here, such as:
    // - Creating test users via API
    // - Setting up test organizations
    // - Populating test data

    console.log('✅ Test data setup completed');
  } catch (error) {
    console.warn('⚠️ Test data setup failed, but tests can still run:', error);
  }
}

export default globalSetup;