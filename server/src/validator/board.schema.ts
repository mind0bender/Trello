import { z } from "zod";

const title = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(100, "Title too long");

const background = z.url("Background must be a valid URL").trim().optional();

export const createBoardSchema = z.object({
  title,
  background,
});

export const updateBoardSchema = z
  .object({
    title: title.optional(),
    background: background.optional(),
  })
  .refine(
    (data): boolean =>
      data.title !== undefined || data.background !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const boardIdParamSchema = z.object({
  id: z.uuid("Invalid board id"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
export type BoardIdParam = z.infer<typeof boardIdParamSchema>;
