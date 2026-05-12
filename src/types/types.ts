import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { HydratedDocument } from "mongoose";
import type { EmployeeDocument, IEmployee } from "../models/employeeModel.js";
import type { IOrganization, OrganizationDocument } from "../models/organizationModel.js";

export interface RequestWithUser extends Request {
  user?: EmployeeDocument | OrganizationDocument;
}

export interface SSEResponseStream extends Response {
  subscriberId: string;
}

export type SyncRouteHandler = (req: RequestWithUser, res: Response, next: NextFunction) => void;

export type AsyncRouteHandler = (
  req: RequestWithUser,
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
