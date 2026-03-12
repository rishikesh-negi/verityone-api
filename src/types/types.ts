import type { NextFunction, Request, Response } from "express";
import type { HydratedDocument } from "mongoose";
import type { IEmployee } from "../models/employeeModel.js";
import type { IOrganization } from "../models/organizationModel.js";
import type { JwtPayload } from "jsonwebtoken";

export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown | void>;

export type CreateSendAuthJWTOptions = Required<{
  tokenType: "access" | "refresh";
  user: HydratedDocument<IEmployee | IOrganization>;
  statusCode: number;
  req: Request<unknown>;
  res: Response;
  sendUserData?: boolean;
}>;

export interface AuthJWTPayload extends JwtPayload {
  id: string;
  accountType: "Employee" | "Organization";
}
