import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @playwright/test's expect so page objects can call expect(locator).toBeVisible()
vi.mock("@playwright/test", () => ({
  expect: () => ({
    toBeVisible: vi.fn().mockResolvedValue(undefined),
    not: {
      toHaveURL: vi.fn().mockResolvedValue(undefined),
    },
  }),
}));

import { LoginPage } from "../playwright/pages/LoginPage";

function createMockLocator(overrides = {}) {
  return {
    fill: vi.fn().mockResolvedValue(undefined),
    click: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function createMockPage() {
  const emailInput = createMockLocator();
  const passwordInput = createMockLocator();
  const submitButton = createMockLocator();

  const page = {
    goto: vi.fn().mockResolvedValue(undefined),
    getByRole: vi.fn().mockImplementation((role: string, options: any) => {
      if (role === "textbox" && options?.name === "Email Address")
        return emailInput;
      if (role === "textbox" && options?.name === "Password")
        return passwordInput;
      if (role === "button" && options?.name === "Log In") return submitButton;
      return createMockLocator();
    }),
    _emailInput: emailInput,
    _passwordInput: passwordInput,
    _submitButton: submitButton,
  } as any;

  return page;
}

describe("LoginPage", () => {
  let page: ReturnType<typeof createMockPage>;
  let loginPage: LoginPage;

  beforeEach(() => {
    page = createMockPage();
    loginPage = new LoginPage(page);
  });

  describe("constructor", () => {
    it("should initialize emailInput with correct role and name", () => {
      expect(page.getByRole).toHaveBeenCalledWith("textbox", {
        name: "Email Address",
      });
    });

    it("should initialize passwordInput with correct role and name", () => {
      expect(page.getByRole).toHaveBeenCalledWith("textbox", {
        name: "Password",
      });
    });

    it("should initialize submitButton with correct role and name", () => {
      expect(page.getByRole).toHaveBeenCalledWith("button", {
        name: "Log In",
      });
    });

    it("should expose page property", () => {
      expect(loginPage.page).toBe(page);
    });
  });

  describe("open()", () => {
    it("should navigate to the login URL", async () => {
      await loginPage.open();

      expect(page.goto).toHaveBeenCalledWith(
        "https://176.trackensure.site/login",
      );
    });

    it("should call goto exactly once", async () => {
      await loginPage.open();

      expect(page.goto).toHaveBeenCalledTimes(1);
    });
  });

  describe("login()", () => {
    it("should fill email field with provided email", async () => {
      await loginPage.login("user@test.com", "password123");

      expect(page._emailInput.fill).toHaveBeenCalledWith("user@test.com");
    });

    it("should fill password field with provided password", async () => {
      await loginPage.login("user@test.com", "password123");

      expect(page._passwordInput.fill).toHaveBeenCalledWith("password123");
    });

    it("should click submit button after filling fields", async () => {
      await loginPage.login("user@test.com", "password123");

      expect(page._submitButton.click).toHaveBeenCalledTimes(1);
    });

    it("should fill email before password", async () => {
      const callOrder: string[] = [];
      page._emailInput.fill.mockImplementation(() => {
        callOrder.push("email");
        return Promise.resolve();
      });
      page._passwordInput.fill.mockImplementation(() => {
        callOrder.push("password");
        return Promise.resolve();
      });

      await loginPage.login("a", "b");

      expect(callOrder).toEqual(["email", "password"]);
    });

    it("should handle empty string credentials", async () => {
      await loginPage.login("", "");

      expect(page._emailInput.fill).toHaveBeenCalledWith("");
      expect(page._passwordInput.fill).toHaveBeenCalledWith("");
      expect(page._submitButton.click).toHaveBeenCalled();
    });

    it("should handle special characters in credentials", async () => {
      const specialEmail = "test+user@example.com";
      const specialPassword = "p@$$w0rd!#%";

      await loginPage.login(specialEmail, specialPassword);

      expect(page._emailInput.fill).toHaveBeenCalledWith(specialEmail);
      expect(page._passwordInput.fill).toHaveBeenCalledWith(specialPassword);
    });
  });
});
