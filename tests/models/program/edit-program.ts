import { expect, type Locator, type Page } from "@playwright/test";

import { faker } from "@faker-js/faker/locale/id_ID";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { editProgramInput } from "../../data/programData";

export class PlaywrightEditProgram {
  readonly page: Page;
  readonly clickPage: Locator;
  readonly goToProgram: Locator;
  readonly dropdownProgram: Locator;
  readonly btnEditProgram: Locator;
  readonly headerEditProgram: Locator;

  readonly programName: Locator;
  readonly programShortName: Locator;
  readonly programSlug: Locator;

  readonly timezoneBtn: Locator;
  readonly timezoneItem: Locator;

  readonly startDateBtn: Locator;
  readonly nextMonthBtn: Locator;
  readonly selectStartDate: Locator;
  readonly selectEndDate: Locator;
  readonly endDateBtn: Locator;
  readonly revisionDateBtn: Locator;
  readonly selectRevisionDate: Locator;

  readonly locationInput: Locator;
  readonly descriptionInput: Locator;

  readonly programType: Locator;
  readonly programStatus: Locator;

  readonly removeLogo: Locator;
  readonly removeBanner: Locator;
  readonly inputLogo: Locator;
  readonly inputBanner: Locator;

  readonly btnSubmit: Locator;
  readonly cancelBtn: Locator;

  readonly expectSuccess: Locator;
  readonly expectFailed: Locator;
  readonly expectProgram: Locator;

  constructor(page: Page) {
    this.page = page;
    this.clickPage = page.locator("html");
    this.goToProgram = page.getByTestId("card-program-test-program");
    this.dropdownProgram = page.getByTestId("dropdown-configure-program");
    this.btnEditProgram = page.getByTestId("dropdown-program-detail");
    this.headerEditProgram = page.getByRole("heading", {
      name: "Edit Program",
    });

    this.programName = page.getByRole("textbox", { name: "Program Name" });
    this.programShortName = page.getByRole("textbox", {
      name: "Program Short Name",
    });
    this.programSlug = page.getByRole("textbox", {
      name: "Enter program slug",
    });

    this.timezoneBtn = page.getByRole("combobox");

    this.startDateBtn = page
      .locator("div")
      .filter({ hasText: /^Timeline Start.*$/ })
      .getByRole("button")
      .first();
    this.endDateBtn = page
      .locator("div")
      .filter({ hasText: /^Timeline End.*$/ })
      .getByRole("button");
    this.revisionDateBtn = page
      .locator("div")
      .filter({ hasText: /^Revision End.*$/ })
      .getByRole("button");

    this.locationInput = page.getByRole("textbox", { name: "Location" });
    this.descriptionInput = page.getByRole("textbox", { name: "Description" });

    this.removeLogo = page.getByRole("button", { name: "Remove Logo" });
    this.removeBanner = page.getByRole("button", { name: "Remove Banner" });
    this.inputLogo = page.getByRole("button", { name: "Program Logo" });
    this.inputBanner = page.getByRole("button", { name: "Program Banner" });

    this.btnSubmit = page.getByRole("button", { name: "Save Changes" });
    this.cancelBtn = page.getByRole("button", { name: "Cancel Edit" });

    this.expectSuccess = page.getByRole("main").getByText("Success!");
    this.expectFailed = page.getByText("The program slug is optional");
    this.expectProgram = page.getByTestId("dropdown-configure-program");
  }

  async goToEditProgram() {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();
  }

  async downloadImage(url: string, filePath: string) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);
  }

  async dateInput(date: string, button: string) {
    await this[button].click();
    const selectDate = await this.page.getByRole("button", {
      name: date,
    });
    await selectDate.click();
  }

  async editProgramInformation({
    newName,
    newSlug,
    newShortName,
    newTimezone,
    newStartDate,
    newEndDate,
    newRevisionDate,
    newLocation,
    newDescription,
    newProgramType,
    newProgramStatus,
    newLogo,
    newBanner,
  }: editProgramInput) {
    if (newName) {
      await this.programName.fill(newName);
    }
    if (newShortName) {
      await this.programShortName.fill(newShortName);
    }
    if (newSlug) {
      await this.programSlug.fill(newSlug);
    }

    if (newTimezone) {
      await this.timezoneBtn.click();
      await this.page.getByTestId(`timezone-item-${newTimezone}`).click();
    }

    if (newStartDate) {
      await this.dateInput(newStartDate, "startDateBtn");
      await this.clickPage.click();
    }
    if (newEndDate) {
      await this.dateInput(newEndDate, "endDateBtn");
      await this.clickPage.click();
    }
    if (newRevisionDate) {
      await this.dateInput(newRevisionDate, "revisionDateBtn");
      await this.clickPage.click();
    }

    if (newLocation) {
      await this.locationInput.fill(newLocation);
    }
    if (newDescription) {
      await this.descriptionInput.fill(newDescription);
    }

    if (newProgramType) {
      const programTypeLocator = this.page.getByTestId(
        `program-type-${newProgramType}`
      );
      await programTypeLocator.click();
    }
    if (newProgramStatus) {
      const programStatusLocator = this.page.getByTestId(
        `program-status-${newProgramStatus}`
      );
      await programStatusLocator.click();
    }

    if (newLogo) {
      const avatarUrl = faker.image.avatar();
      const filePath = path.resolve(__dirname, "temp_avatar.jpg");
      await this.downloadImage(avatarUrl, filePath);

      if (await this.removeLogo.isVisible()) {
        await this.removeLogo.click();
      }
      await this.inputLogo.setInputFiles(filePath);
    }

    if (newBanner) {
      const avatarUrl = faker.image.avatar();
      const filePath = path.resolve(__dirname, "temp_banner.jpg");
      await this.downloadImage(avatarUrl, filePath);

      if (await this.removeBanner.isVisible()) {
        await this.removeBanner.click();
      }
      await this.inputBanner.setInputFiles(filePath);
    }
  }

  async submitSuccess() {
    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async submitFailed() {
    await this.btnSubmit.click();
    await expect(this.expectFailed).toBeVisible();
  }

  async cancelEditProgram() {
    await this.cancelBtn.click();
    await expect(this.expectProgram).toBeVisible();
  }
}
