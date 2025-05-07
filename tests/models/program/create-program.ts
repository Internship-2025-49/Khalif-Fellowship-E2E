import { expect, type Locator, type Page } from "@playwright/test";

import { faker } from "@faker-js/faker/locale/id_ID";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import {
  emptyProgramFill,
  programInput,
  requirementInput,
} from "../../data/programData";

export class PlaywrightCreateProgram {
  readonly page: Page;
  readonly clickPage: Locator;
  readonly btnCreate: Locator;
  readonly headerCreateProgram: Locator;

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

  readonly visibility: Locator;
  readonly matchMaking: Locator;
  readonly notification: Locator;

  readonly inputLogo: Locator;
  readonly inputBanner: Locator;

  readonly programColor: Locator;

  readonly btnAddReqruitment: Locator;
  readonly inputLabelName: Locator;
  readonly btnPreview: Locator;
  readonly expectPreview: Locator;
  readonly btnClosePreview: Locator;
  readonly btnRemoveReqruitment: Locator;
  readonly inputValueName: Locator;
  readonly removeValueName: Locator;

  readonly btnAddPurpose: Locator;
  readonly inputPurposeName: Locator;
  readonly btnRemovePurpose: Locator;

  readonly btnAddAsManager: Locator;

  readonly btnSubmit: Locator;

  readonly expectProgramSuccess: Locator;
  readonly expectProgramError: Locator;
  readonly expectSubmitSlugFailed: Locator;
  readonly expectSubmitNameFailed: Locator;

  constructor(page: Page) {
    this.page = page;
    this.clickPage = page.locator("html");
    this.btnCreate = page.getByTestId("button-create-program");
    this.headerCreateProgram = page.getByRole("heading", {
      name: "Create New Program",
    });

    this.programName = page.getByTestId("program-name-input");
    this.programShortName = page.getByTestId("program-short-name-input");
    this.programSlug = page.getByTestId("program-slug-input");

    this.timezoneBtn = page.getByTestId("program-timezone-button");

    this.startDateBtn = page.getByTestId("program-start-date");
    this.endDateBtn = page.getByTestId("program-end-date");
    this.revisionDateBtn = page.getByTestId("program-revision-end-date");

    this.locationInput = page.getByTestId("program-location-input");
    this.descriptionInput = page.getByTestId("program-description-input");

    this.visibility = page.getByRole("switch", { name: "Hidden" });
    this.matchMaking = page.locator("#matchmaking");
    this.notification = page.locator("#notification-feature");

    this.inputLogo = page.getByRole("button", { name: "Program Logo" });
    this.inputBanner = page.getByRole("button", { name: "Program Banner" });

    this.programColor = page.locator(
      '[id="\\:r25\\:-form-item"] > div > .placeholder\\:text-muted-foreground'
    );

    this.btnAddReqruitment = page.getByRole("button", {
      name: "Add Requirement",
    });
    this.inputLabelName = page.getByRole("textbox", {
      name: "Label",
      exact: true,
    });
    this.btnRemoveReqruitment = page.getByRole("button", { name: "Remove" });
    this.inputValueName = page
      .getByRole("textbox", { name: "Radio button value" })
      .last();

    this.btnAddPurpose = page.getByRole("button", { name: "Add Purpose" });
    this.inputPurposeName = page
      .getByRole("textbox", { name: "Enter meeting purpose" })
      .last();
    this.btnRemovePurpose = page
      .locator("button:has(svg.lucide.lucide-trash2)")
      .last();
    this.removeValueName = page
      .locator("#radio-selection-value-0")
      .getByRole("button")
      .last();

    this.btnAddAsManager = page
      .getByRole("switch", { name: "Toggle add as program manager" })
      .first();

    this.btnSubmit = page.getByTestId("button-submit-create-program");

    this.expectProgramSuccess = page.getByText("Program has been successfully");
    this.expectProgramError = page.getByText("Uh oh! Something went wrong.");
    this.expectSubmitSlugFailed = page.getByText(
      "The program slug is optional"
    );
    this.expectSubmitNameFailed = page.getByText(
      "Program name must be at least"
    );
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

  async navigateToCreateProgram() {
    await this.btnCreate.click();
    await expect(this.headerCreateProgram).toBeVisible();
  }

  async programInput({
    programName,
    programShortName,
    programSlug,
    timezone,
    startDate,
    endDate,
    revisionDate,
    location,
    description,
    programType,
    programStatus,
    visible,
    matchmaking,
    notification,
    addLogo,
    addBanner,
    programColor,
  }: programInput) {
    await this.programName.fill(programName);
    await this.programShortName.fill(programShortName);
    await this.programSlug.fill(programSlug);

    await this.timezoneBtn.click();
    await this.page.getByTestId(`timezone-item-${timezone}`).click();

    await this.dateInput(startDate, "startDateBtn");
    await this.clickPage.click();
    await this.dateInput(endDate, "endDateBtn");
    await this.clickPage.click();
    await this.dateInput(revisionDate, "revisionDateBtn");
    await this.clickPage.click();

    await this.locationInput.fill(location);
    await this.descriptionInput.fill(description);

    const programTypeLocator = this.page.getByTestId(
      `program-type-${programType}`
    );
    await programTypeLocator.click();

    const programStatusLocator = this.page.getByTestId(
      `program-status-${programStatus}`
    );
    await programStatusLocator.click();

    if (visible) {
      await this.visibility.click();
    }
    if (!matchmaking) {
      await this.matchMaking.click();
    }
    if (!notification) {
      await this.notification.click();
    }

    if (addLogo) {
      const avatarUrl = faker.image.avatar();
      const filePath = path.resolve(__dirname, "temp_avatar.jpg");
      await this.downloadImage(avatarUrl, filePath);

      await this.inputLogo.setInputFiles(filePath);
    }

    if (addBanner) {
      const avatarUrl = faker.image.avatar();
      const filePath = path.resolve(__dirname, "temp_banner.jpg");
      await this.downloadImage(avatarUrl, filePath);

      await this.inputBanner.setInputFiles(filePath);
    }

    if (programColor) {
      await this.programColor.fill(programColor || "#FFFFFF");
    }
  }

  async addRequirement({
    labelName,
    fieldType,
    organizationTarget,
    requirementType,
    visibilityType,
    removeReqruitment,
    radioValue,
    removeValue,
  }: requirementInput) {
    await this.btnAddReqruitment.click();
    await this.inputLabelName.fill(labelName || "");

    const reqruitmentFieldType = this.page
      .locator("div")
      .filter({ hasText: new RegExp(`^${fieldType}$`) })
      .getByRole("radio");
    await reqruitmentFieldType.click();

    const reqruitmentOrganizationTarget = this.page.getByRole("checkbox", {
      name: `${organizationTarget}`,
    });
    await reqruitmentOrganizationTarget.click();

    const reqruitmentInputType = this.page
      .locator("div")
      .filter({ hasText: new RegExp(`^${requirementType}$`) })
      .getByRole("radio");
    await reqruitmentInputType.click();

    const reqruitmentVisibilityType = this.page
      .locator("div")
      .filter({ hasText: new RegExp(`^${visibilityType}$`) })
      .getByRole("radio");
    await reqruitmentVisibilityType.click();

    if (
      fieldType?.includes("Selection") ||
      fieldType?.includes("Radio Button")
    ) {
      const addValueName =
        fieldType || "".includes("Selection")
          ? "Add Selection Value"
          : "Add Radio Value";
      const btnAddValue = this.page.getByRole("button", { name: addValueName });
      await btnAddValue.click();
      await this.inputValueName.fill(radioValue || "");

      if (removeValue) {
        await this.removeValueName.click();
      }
    }

    if (removeReqruitment) {
      await this.btnRemoveReqruitment.click();
    }
  }

  async addPurpose({
    meetingPurpose,
    removePurpose,
  }: {
    meetingPurpose: string;
    removePurpose: boolean;
  }) {
    await this.btnAddPurpose.click();
    if (meetingPurpose) {
      await this.inputPurposeName.fill(meetingPurpose);
    }

    if (removePurpose) {
      await this.btnRemovePurpose.click();
    }
  }

  async addAsManager({ asManager }: { asManager?: boolean }) {
    if (asManager) {
      await this.btnAddAsManager.click();
    }
  }

  async submitSuccess() {
    await this.btnSubmit.click();
    await expect(this.expectProgramSuccess).toBeVisible();
  }

  async submitError() {
    await this.btnSubmit.click();
    await expect(this.expectProgramError).toBeVisible();
  }

  async submitSlugFailed() {
    await this.btnSubmit.click();
    await expect(this.expectSubmitSlugFailed).toBeVisible();
  }

  async submitNameFailed() {
    await this.btnSubmit.click();
    await expect(this.expectSubmitNameFailed).toBeVisible();
  }
}
