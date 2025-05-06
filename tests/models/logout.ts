import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightLogout {
  readonly page: Page;
  readonly dropdownLogout: Locator;
  readonly buttonLogout: Locator;

  constructor(page: Page) {
    this.dropdownLogout = page.getByRole("button", {
      name: /.*Profile Picture$/,
    });
    this.buttonLogout = page.getByRole("menuitem", { name: "Signout" });
  }

  async logout() {
    await this.dropdownLogout.click();
    await this.buttonLogout.click();
  }
}
