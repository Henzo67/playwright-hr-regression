import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  
  // Enhanced reporting configuration
  reporter: [
    ['html', { 
      open: 'never',
      outputFolder: 'playwright-report'
    }],
    ['line'], // Console output for CI/CD
    ['json', { outputFile: 'test-results.json' }] // JSON results for parsing
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'https://www.breathehrstaging.com',
    
    // Enhanced tracing and recording
    trace: 'on', // Always capture trace for debugging
    screenshot: 'only-on-failure', // Screenshots on failures
    video: 'retain-on-failure', // Videos for failed tests
    
    // Additional browser context options
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    
    // Enhanced action logging
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          slowMo: 100, // Slow down for better video capture
          args: [
            '--window-size=1920,1080',
            '--disable-dev-shm-usage', // Prevent shared memory issues
            '--no-sandbox' // Better CI/CD compatibility
          ]
        }
      },
    },
  ],
  
  // Output directory for test artifacts
  outputDir: 'test-results/',
  
  // Global test configuration
  globalSetup: undefined,
  globalTeardown: undefined,
}); 