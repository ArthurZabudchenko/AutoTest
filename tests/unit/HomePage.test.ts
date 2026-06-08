import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @playwright/test's expect so page objects can call expect(locator).toBeVisible()
vi.mock("@playwright/test", () => ({
  expect: () => ({
    toBeVisible: vi.fn().mockResolvedValue(undefined),
  }),
}));

import { HomePage } from "../playwright/pages/HomePage";

function createMockLocator(overrides = {}) {
  return {
    first: vi.fn().mockReturnThis(),
    nth: vi.fn().mockReturnThis(),
    click: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function createMockPage(overrides = {}) {
  const menuLocator = createMockLocator();
  return {
    goto: vi.fn().mockResolvedValue(undefined),
    locator: vi.fn().mockReturnValue(menuLocator),
    _menuLocator: menuLocator,
    ...overrides,
  } as any;
}

describe("HomePage", () => {
  let page: ReturnType<typeof createMockPage>;
  let homePage: HomePage;

  beforeEach(() => {
    page = createMockPage();
    homePage = new HomePage(page);
  });

  describe("constructor", () => {
    it("should initialize menuItems locator with correct selector", () => {
      expect(page.locator).toHaveBeenCalledWith(".admin-main-screen-menu");
    });

    it("should expose page property", () => {
      expect(homePage.page).toBe(page);
    });

    it("should expose menuItems property", () => {
      expect(homePage.menuItems).toBeDefined();
    });
  });

  describe("open()", () => {
    it("should navigate to root with domcontentloaded wait", async () => {
      await homePage.open();

      expect(page.goto).toHaveBeenCalledWith("/", {
        waitUntil: "domcontentloaded",
      });
    });

    it("should call goto exactly once", async () => {
      await homePage.open();

      expect(page.goto).toHaveBeenCalledTimes(1);
    });
  });

  describe("verifyLoaded()", () => {
    it("should access first menu item", async () => {
      await homePage.verifyLoaded();

      expect(page._menuLocator.first).toHaveBeenCalled();
    });
  });

  describe("openMenuByIndex()", () => {
    it("should access the menu item at the specified index", async () => {
      await homePage.openMenuByIndex(3);

      expect(page._menuLocator.nth).toHaveBeenCalledWith(3);
    });

    it("should click the menu item after locating it", async () => {
      await homePage.openMenuByIndex(0);

      expect(page._menuLocator.click).toHaveBeenCalled();
    });

    it("should use nth(0) for first menu item", async () => {
      await homePage.openMenuByIndex(0);

      expect(page._menuLocator.nth).toHaveBeenCalledWith(0);
    });

    it("should handle large index values", async () => {
      await homePage.openMenuByIndex(99);

      expect(page._menuLocator.nth).toHaveBeenCalledWith(99);
    });
  });
});
