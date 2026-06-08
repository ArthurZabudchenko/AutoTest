// Shared test configuration constants
// Centralizes URLs, credentials, timeouts, and selectors used across tests.

export const BASE_URL = "https://176.trackensure.site";

export const TEST_CREDENTIALS = {
  email: "5",
  password: "test",
} as const;

export const TIMEOUTS = {
  short: 5_000,
  medium: 10_000,
  long: 15_000,
  extraLong: 30_000,
} as const;

export const SELECTORS = {
  mainMenu: ".admin-main-screen-menu",
} as const;
