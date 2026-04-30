import z from "zod";
import { ObjectId } from "mongodb";

const userMongoIdSchema = z
  .string()
  .refine((val) => ObjectId.isValid(val), { error: "Invalid user ID" });

export const inviteSchema = z.object({
  body: z.object({
    organization: userMongoIdSchema,
    employee: userMongoIdSchema,
  }),
});
