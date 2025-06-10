import { defineConfig } from '@playwright/mcp';

export default defineConfig({
  // Use Chromium browser
  browser: 'chromium',
  
  // Configure viewport and window size
  viewport: {
    width: 1920,
    height: 1080
  },
  
  // Configure browser launch options
  launchOptions: {
    headless: false,
    args: ['--window-size=1920,1080']
  },
  
  // Configure timeouts
  timeout: 30000,
  navigationTimeout: 30000,
  
  // Configure screenshot options
  screenshotOnFailure: true,
  screenshotPath: './test-results/screenshots',
  
  // Configure video recording
  video: 'retain-on-failure',
  
  // Configure trace
  trace: 'retain-on-failure',
  
  // Base URL for the application
  baseURL: 'https://www.breathehrstaging.com',
  
  // Server options
  server: {
    port: 3000,
    host: 'localhost'
  }
}); 