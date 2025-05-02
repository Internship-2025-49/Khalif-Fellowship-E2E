import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightLogin {
  readonly page: Page;
  readonly expectPage: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly buttonSubmit: Locator;
  readonly dashboardHeader: Locator;

  constructor(page: Page) {
    this.expectPage = page.getByRole("heading", {
      name: "Sign in to your account",
    });
    this.emailInput = page.getByTestId("signin-email-input");
    this.passwordInput = page.getByTestId("signin-password-input");
    this.buttonSubmit = page.getByTestId("signin-submit");
    this.dashboardHeader = page.getByRole("heading", {
      name: `Overview`,
      exact: true,
    });
  }

  async login(email: string, password: string) {
    await expect(this.expectPage).toBeVisible();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.buttonSubmit.click();
    await expect(this.dashboardHeader).toBeVisible();
  }
}
