import { z } from "zod";

const id = z.uuid();

export const createListSchema = z.object({
  title: z.string().trim().min(1).max(100),
  boardId: id,
});

export const updateListSchema = z
  .object({
    title: z.string().trim().min(1).max(100).optional(),
  })
  .refine((data): boolean => data.title !== undefined, {
    message: "At least one field must be provided",
  });

export const swapListSchema = z.object({
  list1Id: id,
  boardId: id,
  list2Id: id,
});

export const moveListSchema = z.object({
  listId: id,
  boardId: id,
  newPosition: z.number().int().min(1),
});

export const listIdParamSchema = z.object({
  id,
});

export const boardIdParamSchema = z.object({
  boardId: id,
});
