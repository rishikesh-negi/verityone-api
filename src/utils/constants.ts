export const GENERIC_ERROR_MSG: string = "Something went wrong!";

export const EMPLOYEE_NAME_MIN_LENGTH = 2;
export const EMPLOYEE_NAME_MAX_LENGTH = 40;

export const DEVICE_SESSION_VALIDITY_IN_SECONDS =
  Number.parseInt(process.env["REFRESH_JWT_EXPIRES_IN"]!) * 24 * 60 * 60;

export const REFRESH_JWT_COOKIE_NAME = "refresh_token";

export const INVITE_VALIDITY_SECONDS = 3 * 30.5 * 24 * 60 * 60;

export const ORG_FIELDS_TO_POPULATE =
  "_id name slug username email postalCode city country overallRating numRatings";

export const SURVEY_DURATION_DAYS_OPTIONS: number[] = [7, 30, 90];

export const MIN_EMPLOYEES_TO_SURVEY = 25;

export const SURVEY_COOLDOWN_MS = 180 * 24 * 60 * 60 * 1000;
