import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @playwright/test's expect so page objects can call expect(locator).toBeVisible()
vi.mock("@playwright/test", () => ({
  expect: () => ({
    toBeVisible: vi.fn().mockResolvedValue(undefined),
  }),
}));

import { OrganizationPage } from "../playwright/pages/OrganizationPage";

function createMockLocator(overrides = {}) {
  return {
    first: vi.fn().mockReturnThis(),
    nth: vi.fn().mockReturnThis(),
    click: vi.fn().mockResolvedValue(undefined),
    fill: vi.fn().mockResolvedValue(undefined),
    scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function createMockPage() {
  const menuLocator = createMockLocator();
  const cellLocator = createMockLocator();
  const placeholderLocator = createMockLocator();
  const buttonLocator = createMockLocator();

  const page = {
    locator: vi.fn().mockImplementation((selector: string) => {
      if (selector === ".admin-main-screen-menu") return menuLocator;
      if (selector.includes("uiGrid")) return cellLocator;
      return createMockLocator();
    }),
    getByPlaceholder: vi.fn().mockReturnValue(placeholderLocator),
    getByRole: vi.fn().mockReturnValue(buttonLocator),
    _menuLocator: menuLocator,
    _cellLocator: cellLocator,
    _placeholderLocator: placeholderLocator,
    _buttonLocator: buttonLocator,
  } as any;

  return page;
}

describe("OrganizationPage", () => {
  let page: ReturnType<typeof createMockPage>;
  let orgPage: OrganizationPage;

  beforeEach(() => {
    page = createMockPage();
    orgPage = new OrganizationPage(page);
  });

  describe("constructor", () => {
    it("should create an instance without errors", () => {
      expect(orgPage).toBeInstanceOf(OrganizationPage);
    });
  });

  describe("openMenu()", () => {
    it("should locate the menu using .admin-main-screen-menu selector", async () => {
      await orgPage.openMenu();

      expect(page.locator).toHaveBeenCalledWith(".admin-main-screen-menu");
    });

    it("should target the 13th menu item (index 12)", async () => {
      await orgPage.openMenu();

      expect(page._menuLocator.nth).toHaveBeenCalledWith(12);
    });

    it("should click the menu item", async () => {
      await orgPage.openMenu();

      expect(page._menuLocator.click).toHaveBeenCalled();
    });
  });

  describe("selectOrganization()", () => {
    it("should fill the Org ID placeholder with the given orgId", async () => {
      await orgPage.selectOrganization("32");

      expect(page.getByPlaceholder).toHaveBeenCalledWith("Org ID");
      expect(page._placeholderLocator.fill).toHaveBeenCalledWith("32");
    });

    it("should click the Search button with exact name match", async () => {
      await orgPage.selectOrganization("32");

      expect(page.getByRole).toHaveBeenCalledWith("button", {
        name: "Search",
        exact: true,
      });
      expect(page._buttonLocator.click).toHaveBeenCalled();
    });

    it("should locate the login-as-org link using grid cell selector", async () => {
      await orgPage.selectOrganization("32");

      expect(page.locator).toHaveBeenCalledWith(
        '[id$="-uiGrid-000F-cell"] a',
      );
    });

    it("should scroll the link into view before clicking", async () => {
      await orgPage.selectOrganization("32");

      expect(page._cellLocator.scrollIntoViewIfNeeded).toHaveBeenCalled();
    });

    it("should click the login-as-org link", async () => {
      await orgPage.selectOrganization("32");

      expect(page._cellLocator.click).toHaveBeenCalled();
    });

    it("should handle different orgId values", async () => {
      await orgPage.selectOrganization("999");

      expect(page._placeholderLocator.fill).toHaveBeenCalledWith("999");
    });

    it("should handle orgId with special characters", async () => {
      await orgPage.selectOrganization("abc-123");

      expect(page._placeholderLocator.fill).toHaveBeenCalledWith("abc-123");
    });
  });
});
