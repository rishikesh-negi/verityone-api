import type { NextFunction, Response } from "express";
import { AppError, UnprocessableContentError } from "../errors/AppError.js";
import { Employee } from "../models/employeeModel.js";
import { OnboardingInvite } from "../models/onboardingInviteModel.js";
import type { RequestWithUser } from "../types/types.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";

export const createInvite = catchAsyncError(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { employeeId } = req.params;
    if (!employeeId) return next(new UnprocessableContentError());

    const employee = await Employee.findById(employeeId);
    if (!employee) return next(new UnprocessableContentError());
    if (employee.organization !== null)
      return next(new AppError("Employee is part of another organization", 403));

    await OnboardingInvite.create({ organization: req.user!.id, employee: employeeId });
    return res.status(201).json({
      status: "success",
      message: "Onboarding invite sent to the employee",
    });
  },
);
