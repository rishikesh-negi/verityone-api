import z from "zod";
import { ObjectId } from "mongodb";

export const inviteSchema = z.object({
  params: z.object({
    employeeId: z.string().refine((val) => ObjectId.isValid(val), { error: "Invalid user ID" }),
  }),
});
