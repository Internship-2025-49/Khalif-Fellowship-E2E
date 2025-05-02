import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightDeleteProgram {
  readonly page: Page;
  readonly goToProgram: Locator;
  readonly programDropdown: Locator;
  readonly btnDeleteProgram: Locator;
  readonly programName: Locator;
  readonly submitDeleteProgram: Locator;
  readonly expectDeleteProgram: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToProgram = page.getByTestId("card-program-test-program");
    this.programDropdown = page.getByTestId("dropdown-configure-program");
    this.btnDeleteProgram = page.getByTestId("dropdown-program-delete");
    this.programName = page.getByTestId("program-delete-name-input");
    this.submitDeleteProgram = page.getByTestId("program-delete-submit");
    this.expectDeleteProgram = page.getByText("Program has been successfully");
  }

  async deleteProgram() {
    await this.goToProgram.click();
    await this.programDropdown.click();
    await this.btnDeleteProgram.click();
    await this.programName.fill("Test Program");
    await this.submitDeleteProgram.click();
    await expect(this.expectDeleteProgram).toBeVisible();
  }
}
