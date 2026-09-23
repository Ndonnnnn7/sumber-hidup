import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4174',
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'node server/index.mjs',
      url: 'http://localhost:4174/api/catalog',
      reuseExistingServer: false,
      env: {
        PORT: '4174',
        DATA_DIR: '.playwright-data',
        NODE_ENV: 'test',
        // Never send browser-test submissions through credentials from a local .env.
        SMTP_HOST: '',
        SMTP_USER: '',
        SMTP_PASS: '',
        MAIL_FROM: '',
        INQUIRY_EMAIL_TO: 'inbox@example.test',
      },
    },
    {
      command: 'vite --host 127.0.0.1 --port 5190 --strictPort',
      url: 'http://127.0.0.1:5190',
      reuseExistingServer: false,
      env: { PORT: '4174', NODE_ENV: 'test' },
    },
    {
      command: 'vite preview --host 127.0.0.1 --port 4190 --strictPort',
      url: 'http://127.0.0.1:4190',
      reuseExistingServer: false,
      env: { PORT: '4174', NODE_ENV: 'test' },
    },
  ],
})
