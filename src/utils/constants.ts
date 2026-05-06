export const GENERIC_ERROR_MSG: string = "Something went wrong!";

export const EMPLOYEE_NAME_MIN_LENGTH = 2;
export const EMPLOYEE_NAME_MAX_LENGTH = 40;

export const DEVICE_SESSION_VALIDITY_IN_SECONDS =
  Number.parseInt(process.env["REFRESH_JWT_EXPIRES_IN"]!) * 24 * 60 * 60;

export const REFRESH_JWT_COOKIE_NAME = "refresh_token";

export const onboardingInviteValidityInSeconds = 3 * 30.5 * 24 * 60 * 60;

export const organizationRefPopulateFields =
  "_id name slug username email postalCode city country ratingsAverage numRatings";

export const surveyDurationInDaysOptions: number[] = [7, 30, 90];
