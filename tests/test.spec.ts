import { test as base, BrowserContext, Page } from "@playwright/test";

import { PlaywrightLogin } from "./models/login";
import { PlaywrightSidebarGoTo } from "./models/sidebar";
import { PlaywrightLogout } from "./models/logout";
import { PlaywrightCreateProgram } from "./models/program/create-program";
import { PlaywrightEditProgram } from "./models/program/edit-program";

import dotenv from "dotenv";

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

  test.afterAll(async ({ logoutPage }) => {
    await logoutPage.logout();
    await context.close();
  });

  test("Go To Programs", async ({ goToProgramsPage }) => {
    await goToProgramsPage.sidebarGoTo();
  });

  test("Create Program Input All (Success)", async ({ createProgramPage }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.visibilityToggle({ visible: true });
    await createProgramPage.matchmakingToggle({ matchmaking: true });
    await createProgramPage.notificationToggle({ notification: true });
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Text",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Name (Failed)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: false });
    await createProgramPage.bannerInput({ addBanner: false });
    await createProgramPage.submitNameFailed();
  });

  test("Create Program Without Short Name (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Slug (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Slug Under 5 Characters (Failed)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwt",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSlugFailed();
  });

  test("Create Program Without Timezone (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: false });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Start Date (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: false });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without End Date (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: false });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Revision Date (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: false });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Location (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: false,
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Description (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: false,
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Type Offline (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("offline");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Type Online (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("online");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Type Hybrid (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Status Draft (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("draft");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Status Upcoming (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("upcoming");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Status Open Registration (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Status On Going (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("on_going");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Status Ended (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("ended");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Visible To User is Visible (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.visibilityToggle({ visible: true });
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Visible To User is Hidden (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.visibilityToggle({ visible: false });
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Matchmaking Feature is Enabled (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.matchmakingToggle({ matchmaking: true });
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Matchmaking Feature is Disabled (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.matchmakingToggle({ matchmaking: false });
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Notification Feature is Enabled (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.notificationToggle({ notification: true });
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Notification Feature is Disabled (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.notificationToggle({ notification: false });
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Logo (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: false });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.submitSuccess();
  });

  test("Create Program Without Banner (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: false });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Custom Colors (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.programColorInput({
      customColor: true,
      programColor: "#00ffb4",
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Requirement File Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "File",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Requirement Radio Button Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Radio Button",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
      radioValue: "lorem ipsum",
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Requirement Selection Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Selection",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
      radioValue: "lorem ipsum",
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Remove Value In Radio Button Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Radio Button",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
      radioValue: "lorem ipsum",
      removeValue: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Remove Value In Selection Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Selection",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
      radioValue: "lorem ipsum",
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Requirement Text Field Type (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Text",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Organization Target Startup (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Text",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Organization Target Venture Capital (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Text",
      organizationTarget: "Venture Capital",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Organization Target Corporate (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Text",
      organizationTarget: "Corporate",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Requirement Type Required (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Text",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Requirement Type Optional (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Text",
      organizationTarget: "Startup",
      requirementType: "Optional",
      visibilityType: "Visible",
      removeReqruitment: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Visibility Type Visible (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Text",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Visibility Type Invisible (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Text",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Invisible",
      removeReqruitment: false,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Reqruitment Remove (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
    await createProgramPage.addRequirement({
      labelName: "lorem ipsum",
      fieldType: "Text",
      organizationTarget: "Startup",
      requirementType: "Required",
      visibilityType: "Visible",
      removeReqruitment: true,
    });
    await createProgramPage.submitSuccess();
  });

  test("Create Program With Add Meeting Purpose (Success)", async ({
    createProgramPage,
  }) => {
    await createProgramPage.navigateToCreateProgram();
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
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
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
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
    await createProgramPage.programNameInput({
      programName: "qwerty",
      programShortName: "qwt",
      programSlug: "qwerty",
    });
    await createProgramPage.timezoneInput({ timezone: true });
    await createProgramPage.startDateInput({ startDate: true });
    await createProgramPage.endDateInput({ endDate: true });
    await createProgramPage.revisionDateInput({ revisionDate: true });
    await createProgramPage.locationInputFill({
      addLocation: true,
      location: "Jakarta, Indonesia",
    });
    await createProgramPage.descriptionInputFill({
      addDescription: true,
      description: "lorem ipsum",
    });
    await createProgramPage.programTypeInput("hybrid");
    await createProgramPage.programStatusInput("open_registration");
    await createProgramPage.logoInput({ addLogo: true });
    await createProgramPage.bannerInput({ addBanner: true });
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
