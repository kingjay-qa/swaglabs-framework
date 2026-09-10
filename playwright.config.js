// playwright.config.js
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

const defaultBaseURL = 'https://www.saucedemo.com';
const configuredBaseURL = process.env.BASE_URL?.trim();
const baseURL = configuredBaseURL || defaultBaseURL;

try {
  new URL(baseURL);
} catch {
  throw new Error(`BASE_URL must be a valid absolute URL. Received: ${baseURL}`);
}

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});