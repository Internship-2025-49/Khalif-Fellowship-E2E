import { test as base, BrowserContext, Page } from "@playwright/test";

import { PlaywrightLogin } from "./models/login";
import { PlaywrightSidebarGoTo } from "./models/layout";
import { PlaywrightLogout } from "./models/logout";
import { PlaywrightCreateProgram } from "./models/program/create-program";
import { PlaywrightEditProgram } from "./models/program/edit-program";

import dotenv from "dotenv";
import {
  characterFill,
  emptyProgramFill,
  programEditFill,
  programFill,
  requirementFill,
} from "./data/programData";
import { PlaywrightDeleteProgram } from "./models/program/delete-program";

dotenv.config();

let context: BrowserContext;
let page: Page;

const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

type MyFixtures = {
  loginPage: PlaywrightLogin;
  logoutPage: PlaywrightLogout;

  goToOverviewPage: PlaywrightSidebarGoTo;
  goToProgramsPage: PlaywrightSidebarGoTo;
  goToOrganizationsPage: PlaywrightSidebarGoTo;

  createProgramPage: PlaywrightCreateProgram;
  editProgramPage: PlaywrightEditProgram;
  deleteProgramPage: PlaywrightDeleteProgram;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({}, use) => {
    await use(new PlaywrightLogin(page));
  },
  logoutPage: async ({}, use) => {
    await use(new PlaywrightLogout(page));
  },

  goToOverviewPage: async ({}, use) => {
    await use(new PlaywrightSidebarGoTo(page, "overview", "Overview"));
  },
  goToProgramsPage: async ({}, use) => {
    await use(new PlaywrightSidebarGoTo(page, "programs", "Programs"));
  },
  goToOrganizationsPage: async ({}, use) => {
    await use(
      new PlaywrightSidebarGoTo(page, "organizations", "Organizations")
    );
  },

  createProgramPage: async ({}, use) => {
    await use(new PlaywrightCreateProgram(page));
  },
  editProgramPage: async ({}, use) => {
    await use(new PlaywrightEditProgram(page));
  },
  deleteProgramPage: async ({}, use) => {
    await use(new PlaywrightDeleteProgram(page));
  },
});

test.describe("Overview", () => {
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new PlaywrightLogin(page);
    await page.goto("/signin");
    await loginPage.login(email, password);
  });

  test.beforeEach(async ({ goToOverviewPage }) => {
    await goToOverviewPage.sidebarGoTo();
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test.afterAll(async ({ logoutPage }) => {
    await logoutPage.logout();
    await context.close();
  });

  test("Go To Overview", async ({ goToOverviewPage }) => {
    await goToOverviewPage.sidebarGoTo();
  });
});

test.describe("Create Programs", () => {
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new PlaywrightLogin(page);
    await page.goto("/signin");
    await loginPage.login(email, password);
  });

  test.beforeEach(async ({ goToProgramsPage }) => {
    await goToProgramsPage.sidebarGoTo();
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test.afterAll(async ({ logoutPage, goToProgramsPage, deleteProgramPage }) => {
    await goToProgramsPage.sidebarGoTo();
    await deleteProgramPage.deleteProgram();
    await logoutPage.logout();
    await context.close();
  });

  test("Go To Programs", async ({ goToProgramsPage }) => {
    await goToProgramsPage.sidebarGoTo();
  });

  test("Create Program Input All (Success)", async ({ createProgramPage }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      visible: true,
      matchmaking: true,
      notification: true,

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Name (Failed)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: emptyProgramFill.emptyFill,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitNameFailed();
  });

  test("Create Program Without Short Name (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: emptyProgramFill.emptyFill,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Slug (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: emptyProgramFill.emptyFill,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Slug 1 Character (Failed)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: characterFill.oneCharacter,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSlugFailed();
  });

  test("Create Program With Slug 2 Character (Failed)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: characterFill.twoCharacter,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSlugFailed();
  });

  test("Create Program With Slug 3 Character (Failed)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: characterFill.threeCharacter,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSlugFailed();
  });

  test("Create Program With Slug 4 Character (Failed)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: characterFill.fourCharacter,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSlugFailed();
  });

  test("Create Program With Slug 5 Character (Failed)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: characterFill.fiveCharacter,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSlugFailed();
  });

  test("Create Program Without Timezone (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: emptyProgramFill.emptyFill,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Default Start Date (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Default End Date (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Default Revision Date (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Location (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: emptyProgramFill.emptyFill,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Description (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: emptyProgramFill.emptyFill,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Type Offline (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[0]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Type Online (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[1]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Type Hybrid (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Status Draft (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[0]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Status Upcoming (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[1]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Status Open Registration (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Status On Going (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[3]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Status Ended (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[4]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Visible To User is Visible (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      visible: true,

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Visible To User is Hidden (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      visible: false,

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Matchmaking Feature is Enabled (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      matchmaking: true,

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Matchmaking Feature is Disabled (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      matchmaking: false,

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Notification Feature is Enabled (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      matchmaking: true,

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Notification Feature is Disabled (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      matchmaking: true,

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Logo (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: false,
      addBanner: true,
    });

    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Banner (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Custom Colors (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,

      programColor: programFill.color1,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Requirement File Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Requirement Radio Button Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[1]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
      radioValue: requirementFill.radioValue,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Requirement Selection Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[2]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
      radioValue: requirementFill.radioValue,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Remove Value In Radio Button Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[1]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
      radioValue: requirementFill.radioValue,
      removeValue: requirementFill.removeValue,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Remove Value In Selection Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[2]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
      radioValue: requirementFill.radioValue,
      removeValue: requirementFill.removeValue,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Requirement Text Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[3]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Organization Target Startup (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Organization Target Venture Capital (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[1]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Organization Target Corporate (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[2]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Requirement Type Required (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Requirement Type Optional (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[1]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Visibility Type Visible (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Visibility Type Invisible (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[1]],
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Reqruitment Remove (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addRequirement({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
      removeReqruitment: requirementFill.removeReqruitment,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Meeting Purpose (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addPurpose({
      meetingPurpose: "Business",
      removePurpose: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Meeting Purpose Remove (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addPurpose({
      meetingPurpose: "",
      removePurpose: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Member As Program Manager (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programInput({
      programName: programFill.programName,
      programShortName: programFill.programShortName,
      programSlug: programFill.programSlug,

      timezone: programFill.timezone,

      startDate: programFill.startDate,
      endDate: programFill.endDate,
      revisionDate: programFill.revisionDate,

      location: programFill.location,
      description: programFill.description,

      programType: [programFill.programType[2]],
      programStatus: [programFill.programStatus[2]],

      addLogo: true,
      addBanner: true,
    });
    await createProgramPage.addAsManager({ asManager: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Input All (Failed)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.submitNameFailed();
  });
});

test.describe("Edit Program (General Information Section)", () => {
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new PlaywrightLogin(page);
    await page.goto("/signin");
    await loginPage.login(email, password);
  });

  test.beforeEach(async ({ goToProgramsPage, editProgramPage }) => {
    await goToProgramsPage.sidebarGoTo();
    await editProgramPage.goToEditProgram();
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test.afterAll(async ({ logoutPage }) => {
    await logoutPage.logout();
    await context.close();
  });

  test("Edit Program Name (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newName: programEditFill.newName,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Name Input 1 Character (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newName: characterFill.oneCharacter,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Name Input 2 Characters (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newName: characterFill.twoCharacter,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Name Input 3 Characters (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newName: characterFill.threeCharacter,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Name Input 4 Characters (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newName: characterFill.fourCharacter,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Name Input 5 Characters (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newName: characterFill.fiveCharacter,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Short Name (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newShortName: programEditFill.newShortName,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Slug (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newSlug: programEditFill.newSlug,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Slug Input 1 Character (Failed)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newSlug: characterFill.oneCharacter,
    });
    await editProgramPage.submitFailed();
  });

  test("Edit Program Slug Input 2 Characters (Failed)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newSlug: characterFill.twoCharacter,
    });
    await editProgramPage.submitFailed();
  });

  test("Edit Program Slug Input 3 Characters (Failed)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newSlug: characterFill.threeCharacter,
    });
    await editProgramPage.submitFailed();
  });

  test("Edit Program Slug Input 4 Characters (Failed)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newSlug: characterFill.fourCharacter,
    });
    await editProgramPage.submitFailed();
  });

  test("Edit Program Slug Input 5 Characters (Failed)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newSlug: characterFill.fiveCharacter,
    });
    await editProgramPage.submitFailed();
  });

  test("Edit Program Timezone (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newTimezone: programEditFill.newTimezone,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Start Date (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newStartDate: programEditFill.newStartDate,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program End Date (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newEndDate: programEditFill.newEndDate,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Revision Date (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newRevisionDate: programEditFill.newRevisionDate,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Location (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newLocation: programEditFill.newLocation,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Description (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newDescription: programEditFill.newDescription,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Type To Offline (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newProgramType: [programEditFill.newProgramType[0]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Type To Online (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newProgramType: [programEditFill.newProgramType[1]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Type To Hybrid (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({
      newProgramType: [programEditFill.newProgramType[2]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Status To Draft (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newProgramStatus: [programEditFill.newProgramStatus[0]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Status To Upcoming (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newProgramStatus: [programEditFill.newProgramStatus[1]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Status To Open Registration (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newProgramStatus: [programEditFill.newProgramStatus[2]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Status To On Going (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newProgramStatus: [programEditFill.newProgramStatus[3]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Status To Ended (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramInformation({
      newProgramStatus: [programEditFill.newProgramStatus[4]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Logo (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({ newLogo: true });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Banner (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramInformation({ newBanner: true });
    await editProgramPage.submitSuccess();
  });

  test("Cancel Edit Program (Success)", async ({ editProgramPage }) => {
    await editProgramPage.cancelEditProgram();
  });
});

test.describe("Edit Program (Program Requirements Section)", () => {
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new PlaywrightLogin(page);
    await page.goto("/signin");
    await loginPage.login(email, password);
  });

  test.beforeEach(async ({ goToProgramsPage, editProgramPage }) => {
    await goToProgramsPage.sidebarGoTo();
    await editProgramPage.goToEditProgram();
    await editProgramPage.goToRequirementsSection();
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test.afterAll(async ({ logoutPage }) => {
    await logoutPage.logout();
    await context.close();
  });

  test("Add Reqruitment With File Field Type (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[3]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Radio Field Type (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[1]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
      radioValue: requirementFill.radioValue,
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Selection Field Type (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[2]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
      radioValue: requirementFill.radioValue,
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Text Field Type (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[3]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Remove Value In Radio Button Field Type (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[1]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
      radioValue: requirementFill.radioValue,
      removeValue: requirementFill.removeValue,
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Remove Value In Selection Field Type (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[2]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
      radioValue: requirementFill.radioValue,
      removeValue: requirementFill.removeValue,
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Organization Target Startup (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Organization Target Venture Capital (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[1]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Organization Target Corporate (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[2]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Requirement Type Required (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Requirement Type Optional (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[1]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Visibility Type Visible (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Visibility Type Invisible (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[1]],
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Reqruitment With Remove Reqruitment (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramRequirements({
      labelName: requirementFill.labelName,
      fieldType: [requirementFill.fieldType[0]],
      organizationTarget: [requirementFill.organizationTarget[0]],
      requirementType: [requirementFill.requirementType[0]],
      visibilityType: [requirementFill.visibilityType[0]],
      removeReqruitment: true,
    });
    await editProgramPage.submitSuccess();
  });

  test("Remove Reqruitment (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramRequirements({
      removeReqruitment: true,
    });
    await editProgramPage.submitSuccess();
  });

  test("Cancel Edit Program Requirement (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.cancelEditProgram();
  });
});

test.describe("Edit Program (Program Features Section)", () => {
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new PlaywrightLogin(page);
    await page.goto("/signin");
    await loginPage.login(email, password);
  });

  test.beforeEach(async ({ goToProgramsPage, editProgramPage }) => {
    await goToProgramsPage.sidebarGoTo();
    await editProgramPage.goToEditProgram();
    await editProgramPage.goToFeaturesSection();
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test.afterAll(async ({ logoutPage }) => {
    await logoutPage.logout();
    await context.close();
  });

  test("Edit Program Meeting Purpose Name (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramFeatures({
      inputPurposeName: requirementFill.purposeName,
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Program Meeting Purpose (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramFeatures({
      addNewPurpose: true,
      inputPurposeName: requirementFill.purposeName,
    });
    await editProgramPage.submitSuccess();
  });

  test("Add Program Meeting Purpose Then Remove (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramFeatures({
      addNewPurpose: true,
      inputPurposeName: requirementFill.purposeName,
      removePurpose: true,
    });
    await editProgramPage.submitSuccess();
  });

  test("Remove Program Meeting Purpose (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.editProgramFeatures({
      removePurpose: true,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Color (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramFeatures({
      color: programFill.color2,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Visibility (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramFeatures({
      visible: true,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Matchmaking (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramFeatures({
      matchmaking: true,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Notification (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramFeatures({
      notification: true,
    });
    await editProgramPage.submitSuccess();
  });

  test("Edit Program Sponsor (Success)", async ({ editProgramPage }) => {
    await editProgramPage.editProgramFeatures({
      sponsor: true,
    });
    await editProgramPage.submitSuccess();
  });

  test("Cancel Edit Program Features (Success)", async ({
    editProgramPage,
  }) => {
    await editProgramPage.cancelEditProgram();
  });
});

test.describe("Organizations", () => {
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new PlaywrightLogin(page);
    await page.goto("/signin");
    await loginPage.login(email, password);
  });

  test.beforeEach(async ({ goToOrganizationsPage }) => {
    await goToOrganizationsPage.sidebarGoTo();
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test.afterAll(async ({ logoutPage }) => {
    await logoutPage.logout();
    await context.close();
  });

  test("Go To Organizations", async ({ goToOrganizationsPage }) => {
    await goToOrganizationsPage.sidebarGoTo();
  });
});
