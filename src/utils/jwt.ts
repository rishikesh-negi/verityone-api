import crypto from "crypto";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import type { HydratedDocument } from "mongoose";
import ms from "ms";
import { promisify } from "util";
import type { IEmployee } from "../models/employeeModel.js";
import type { IOrganization } from "../models/organizationModel.js";
import type { AuthJWTPayload } from "../types/types.js";

const ACCESS_JWT_SECRET: string = process.env["ACCESS_JWT_SECRET"]!;
const REFRESH_JWT_SECRET: string = process.env["REFREST_JWT_SECRET"]!;

export function signAuthJWT(payload: object, tokenType: "access" | "refresh") {
  const jwtSecret: Secret =
    tokenType === "access" ? ACCESS_JWT_SECRET : REFRESH_JWT_SECRET;

  const expiresIn: ms.StringValue = (
    tokenType === "access"
      ? process.env["ACCESS_JWT_EXPIRES_IN"]
      : process.env["REFRESH_JWT_EXPIRES_IN"]
  ) as ms.StringValue;

  return jwt.sign(payload, jwtSecret, {
    expiresIn,
  });
}

export async function verifyAuthJWT(
  token: string,
  type: "access" | "refresh",
): Promise<JwtPayload> {
  const SECRET = type === "access" ? ACCESS_JWT_SECRET : REFRESH_JWT_SECRET;

  // Promisifying JWT verification to free up Node.js event loop:
  const verifyAsync = promisify(
    jwt.verify as (token: string, secret: string) => JwtPayload,
  );
  const decoded = (await verifyAsync(token, SECRET)) as JwtPayload;

  return decoded;
}

export function createRefreshToken(
  user: HydratedDocument<IEmployee | IOrganization>,
  payload: AuthJWTPayload,
) {
  const accountType = "firstName" in user ? "employee" : "organization";

  const refreshToken = signAuthJWT(payload, "refresh");
  const expiresAt: Date = new Date(
    Date.now() +
      Number.parseInt(process.env["REFRESH_JWT_EXPIRES_IN"]!) *
        24 *
        60 *
        60 *
        1000,
  );

  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  return { refreshToken, tokenHash, expiresAt };
}

export function createAccessToken(
  user: HydratedDocument<IEmployee | IOrganization>,
) {
  const accountType = "firstName" in user ? "employee" : "organization";
  const payload = {
    id: user.id,
    accountType,
  };
}
