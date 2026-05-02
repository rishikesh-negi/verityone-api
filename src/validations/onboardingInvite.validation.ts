import z from "zod";
import { ObjectId } from "mongodb";

export const documentIdSchema = z
  .string()
  .refine((val) => ObjectId.isValid(val), { error: "Invalid resource ID" });

export const inviteSchema = z.object({ params: z.object({ employeeId: documentIdSchema }) });

export const inviteActionSchema = z.object({ params: z.object({ inviteId: documentIdSchema }) });
