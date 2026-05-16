import z from "zod";
import { ObjectId } from "mongodb";

export const documentIdSchema = z
  .string()
  .refine((val) => ObjectId.isValid(val), { error: "Invalid resource ID" });

export const inviteCreationRequestSchema = z.object({
  params: z.object({ employeeId: documentIdSchema }),
});
export type InviteCreationInputData = z.infer<typeof inviteCreationRequestSchema>;

export const inviteReplySchema = z.object({ params: z.object({ inviteId: documentIdSchema }) });
export type InviteActionInputData = z.infer<typeof inviteReplySchema>;
