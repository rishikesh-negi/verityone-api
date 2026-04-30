import type { NextFunction, Response } from "express";
import { UnprocessableContentError } from "../errors/AppError.js";
import type { RequestWithUser } from "../types/types.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { Organization } from "../models/organizationModel.js";
import { Employee } from "../models/employeeModel.js";
import { OnboardingInvite } from "../models/onboardingInviteModel.js";

export const createInvite = catchAsyncError(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { organization: orgId, employee: employeeId } = req.body;
    if (!orgId || !employeeId) return next(new UnprocessableContentError());

    const [organizationExists, employeeExists] = await Promise.all([
      Organization.exists({ _id: orgId }),
      Employee.exists({ _id: employeeId }),
    ]);
    if (!organizationExists || !employeeExists) return next(new UnprocessableContentError());

    await OnboardingInvite.create({ organization: orgId, employee: employeeId });
    return res.status(201).json({
      status: "success",
      message: "Onboarding invite sent to the employee",
    });
  },
);
