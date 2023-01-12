import { BrowserFormOptions } from "./types";

export const DEFAULT_OPTIONS: Partial<BrowserFormOptions<any>> = {
  mode: "onSubmitUnlessError",
  revalidationStrategy: "onChange",
  liveFields: [],
  validateAfterInit: false,
};

export const DEFAULT_REQUIRED_ERROR_MESSAGE = "This field is required.";
export const DEFAULT_VALIDATION_ERROR_MESSAGE = "This field is incorrect.";
