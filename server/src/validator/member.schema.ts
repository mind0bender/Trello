import { z } from "zod";

const id = z.uuid();

export const createMemberSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().trim(),
});

export const updateMemberSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    email: z.email().optional(),
  })
  .refine(
    (data): boolean => data.name !== undefined || data.email !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const memberIdParamSchema = z.object({
  id,
});

export type MemberIdParam = z.infer<typeof memberIdParamSchema>;
