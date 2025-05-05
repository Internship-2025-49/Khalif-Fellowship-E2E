import { addDays, format } from "date-fns";

const today = new Date();

export type programInput = {
  programName: string;
  programShortName: string;
  programSlug: string;
  timezone: string;
  startDate: string;
  endDate: string;
  revisionDate: string;
  location: string;
  description: string;
  programType: string[];
  programStatus: string[];
};

export type requirementInput = {
  labelName: string;
  fieldType: string[];
  organizationTarget: string[];
  requirementType: string[];
  visibilityType: string[];
  removeReqruitment?: boolean;
  radioValue?: string;
  removeValue?: boolean;
};

export const programFill = {
  programName: "Test Program",
  programShortName: "TP",
  programSlug: "test-program",
  timezone: "asia/jakarta",
  startDate: format(addDays(today, 3), "MMMM do, yyyy"),
  endDate: format(addDays(today, 6), "MMMM do, yyyy"),
  revisionDate: format(addDays(today, 5), "MMMM do, yyyy"),
  location: "Jakarta, Indonesia",
  description: "This is a test program",
  programType: ["offline", "online", "hybrid"],
  programStatus: [
    "draft",
    "upcoming",
    "open_registration",
    "on_going",
    "ended",
  ],
};

export const requirementFill = {
  labelName: "Test Requirement",
  fieldType: ["File", "Radio Button", "Selection", "Text"],
  organizationTarget: ["Startup", "Venture Capital", "Corporate"],
  requirementType: ["Required", "Optional"],
  visibilityType: ["Visible", "Invisible"],
  removeReqruitment: true,
  radioValue: "lorem ipsum",
  removeValue: true,
};

export const emptyProgramFill = {
  emptyFill: "",
};

export const characterFill = {
  oneCharacter: "a",
  twoCharacter: "ab",
  threeCharacter: "abc",
  fourCharacter: "abcd",
  fiveCharacter: "abcde",
};
