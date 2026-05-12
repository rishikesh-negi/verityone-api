import type { CookieOptions, Request, Response } from "express";
import type { EmployeeDocument } from "../models/employeeModel.js";
import { sseService } from "../services/sseService.js";
import type { RequestWithUser, SSEResponseStream } from "../types/types.js";
import { v7 as uuidv7 } from "uuid";

export const subscribeToPublicSSE = (req: Request, res: SSEResponseStream) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  res.subscriberId = uuidv7();

  sseService.addClient(res);
  const sseSubscriberIdCookieOptions: CookieOptions = {
    httpOnly: true,
    secure:
      process.env["NODE_ENV"] === "development"
        ? false
        : req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: process.env["NODE_ENV"] === "development" ? "lax" : "strict",
  };

  res.cookie("sse_subscriber_id", res.subscriberId, sseSubscriberIdCookieOptions);

  const heartbeat = setInterval(() => res.write(": keep-alive"), 30_000);

  res.on("close", () => {
    clearInterval(heartbeat);
    res.clearCookie("sse_subscriber_id", sseSubscriberIdCookieOptions);
  });
};

export const startSSE = (req: RequestWithUser, res: Response) => {
  const { organization } = req.user as EmployeeDocument;
  if (!organization)
    return res
      .status(403)
      .json({ status: "fail", error: "Only onboarded employees may receive survey updates" });

  const orgId = organization._id.toString();

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  sseService.addClient(res, orgId);
};
