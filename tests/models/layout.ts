import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightSidebarGoTo {
  readonly page: Page;
  readonly sidebarLink: Locator;
  readonly dashboardHeader: Locator;

  constructor(page: Page, linkName: string, headerName: string) {
    this.page = page;
    this.sidebarLink = page.getByTestId(`sidebar-link-${linkName}`);
    this.dashboardHeader = page.getByRole("heading", {
      name: `${headerName}`,
      exact: true,
    });
  }

  async sidebarGoTo() {
    await this.sidebarLink.click();
    await expect(this.dashboardHeader).toBeVisible();
  }

  async sidebarGoToOverview() {
    await this.sidebarLink.click();
    await expect(this.dashboardHeader).toBeVisible();
  }
}
