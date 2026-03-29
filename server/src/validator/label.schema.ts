import { z } from "zod";

const id = z.uuid();

export const createLabelSchema = z.object({
  name: z.string().trim().min(1).max(50),
  color: z.string().trim().min(1).max(20),
});

export const updateLabelSchema = z
  .object({
    name: z.string().trim().min(1).max(50).optional(),
    color: z.string().trim().min(1).max(20).optional(),
  })
  .refine(
    (data): boolean => data.name !== undefined || data.color !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const labelIdParamSchema = z.object({
  id,
});
