import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightLogout {
  readonly page: Page;
  readonly dropdownLogout: Locator;
  readonly buttonLogout: Locator;
  readonly checkLogout: Locator;

  constructor(page: Page) {
    this.dropdownLogout = page.getByRole("button", {
      name: /.*Profile Picture$/,
    });
    this.buttonLogout = page.getByRole("menuitem", { name: "Signout" });
    this.checkLogout = page.getByRole("heading", {
      name: "Sign in to your account",
    });
  }

  async logout() {
    await this.dropdownLogout.click();
    await this.buttonLogout.click();
    await expect(this.checkLogout).toBeVisible();
  }
}
