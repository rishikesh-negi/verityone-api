import type { Response } from "express";
import type { EmployeeDocument } from "../models/employeeModel.js";
import { sseService } from "../services/sseService.js";
import type { RequestWithUser } from "../types/types.js";

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

  sseService.addClient(orgId, res);

  const heartbeat = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 30_000);

  res.on("close", () => clearInterval(heartbeat));
};
