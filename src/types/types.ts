import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { HydratedDocument } from "mongoose";
import type { EmployeeDocument, IEmployee } from "../models/employeeModel.js";
import type { IWorkplace, WorkplaceDocument } from "../models/workplaceModel.js";

export type UserDocument = EmployeeDocument | WorkplaceDocument;

export interface RequestWithUser<T extends UserDocument = UserDocument> extends Request {
  user: T;
}

export type SyncRouteHandler<T extends UserDocument | undefined = undefined> = (
  req: T extends UserDocument ? RequestWithUser<T> : Request,
  res: Response,
  next: NextFunction,
) => void;

export type AsyncRouteHandler<T extends UserDocument | undefined = undefined> = (
  req: T extends UserDocument ? RequestWithUser<T> : Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown | void>;

export type CreateSendAuthJWTOptions = Required<{
  tokenType: "access" | "refresh";
  user: HydratedDocument<IEmployee | IWorkplace>;
  statusCode: number;
  req: Request<unknown>;
  res: Response;
  sendUserData?: boolean;
}>;

export interface AuthJWTPayload extends JwtPayload {
  id: string;
  accountType: "Employee" | "Workplace";
}

export interface SSESubscriberClient {
  subscriberId: string;
  res: Response;
  connectedAt: number;
}
