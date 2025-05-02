import { expect, type Locator, type Page } from "@playwright/test";

import { faker } from "@faker-js/faker/locale/id_ID";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

export class PlaywrightEditProgram {
  readonly page: Page;
  readonly goToProgram: Locator;
  readonly dropdownProgram: Locator;
  readonly btnEditProgram: Locator;
  readonly headerEditProgram: Locator;
  readonly programName: Locator;
  readonly programShortName: Locator;
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
  readonly programSlug: Locator;
  readonly programType: Locator;
  readonly programStatus: Locator;
  readonly inputLogo: Locator;
  readonly inputBanner: Locator;
  readonly btnSubmit: Locator;
  readonly expectSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToProgram = page.getByTestId("card-program-qwertyuiop");
    this.dropdownProgram = page.getByTestId("dropdown-configure-program");
    this.btnEditProgram = page.getByTestId("dropdown-program-detail");
    this.headerEditProgram = page.getByRole("heading", {
      name: "Edit Program",
    });
    this.programName = page.getByTestId("program-name-input");
    this.programShortName = page.getByTestId("program-short-name-input");
    this.timezoneBtn = page.getByTestId("program-timezone-button");
    this.timezoneItem = page.getByTestId("timezone-item-asia/bangkok");
    this.startDateBtn = page.getByTestId("program-start-date");
    this.nextMonthBtn = page.getByRole("button", {
      name: "Go to the Next Month",
    });
    this.selectStartDate = page.getByRole("button", {
      name: "Friday, May 2st,",
    });
    this.selectEndDate = page.getByRole("button", {
      name: "Thursday, May 29th,",
    });
    this.endDateBtn = page.getByTestId("program-end-date");
    this.revisionDateBtn = page.getByTestId("program-revision-end-date");
    this.selectRevisionDate = page.getByRole("button", {
      name: "Wednesday, May 28th,",
    });
    this.locationInput = page.getByRole("textbox", { name: "Location" });
    this.descriptionInput = page.getByTestId("program-description-input");
    this.programSlug = page.getByTestId("program-slug-input");
    this.programType = page.getByTestId("program-type-online");
    this.programStatus = page.getByTestId("program-status-on_going");
    this.inputLogo = page.getByRole("button", { name: "Program Logo" });
    this.inputBanner = page.getByRole("button", { name: "Program Banner" });
    this.btnSubmit = page.getByRole("button", { name: "Save Changes" });
    this.expectSuccess = page.getByRole("main").getByText("Success!");
  }

  async editProgramName(newName: string) {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.programName.fill(newName);

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editLocation(newLocation: string) {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.locationInput.fill(newLocation);

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editProgramShortName(newShortName: string) {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.programShortName.fill(newShortName);

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editTimezone() {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.timezoneBtn.click();
    await this.timezoneItem.click();

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editStartDate() {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.startDateBtn.click();
    await this.nextMonthBtn.click();
    await this.selectStartDate.click();

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editEndDate() {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.endDateBtn.click();
    await this.nextMonthBtn.click();
    await this.selectEndDate.click();

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editRevisionDate() {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.revisionDateBtn.click();
    await this.nextMonthBtn.click();
    await this.selectRevisionDate.click();

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editProgramSlug(newSlug: string) {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.programSlug.fill(newSlug);

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editProgramType() {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.programType.click();

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editProgramStatus() {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.programStatus.click();

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async downloadImage(url: string, filePath: string) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);
  }

  async editProgramLogo() {
    const avatarUrl = faker.image.avatar();
    const filePath = path.resolve(__dirname, "temp_avatar.jpg");
    await this.downloadImage(avatarUrl, filePath);

    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.inputLogo.setInputFiles(filePath);

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editProgramBanner() {
    const avatarUrl = faker.image.avatar();
    const filePath = path.resolve(__dirname, "temp_avatar.jpg");
    await this.downloadImage(avatarUrl, filePath);

    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.inputBanner.setInputFiles(filePath);

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }

  async editDescription(newDescription: string) {
    await this.goToProgram.click();
    await this.dropdownProgram.click();
    await this.btnEditProgram.click();
    await expect(this.headerEditProgram).toBeVisible();

    await this.descriptionInput.fill(newDescription);

    await this.btnSubmit.click();
    await expect(this.expectSuccess).toBeVisible();
  }
}
