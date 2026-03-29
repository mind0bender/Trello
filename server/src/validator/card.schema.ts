import { z } from "zod";

const id = z.string().uuid();

export const createCardSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().optional(),
  listId: id,
});

export const updateCardSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().optional(),
    dueDate: z.coerce.date().optional(),
  })
  .refine(
    (data): boolean =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.dueDate !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const moveCardSchema = z.object({
  cardId: id,
  source: z.object({
    listId: id,
    position: z.number().int().min(1),
  }),
  destination: z.object({
    listId: id,
    position: z.number().int().min(1),
  }),
});

export const addMemberSchema = z.object({
  memberId: id,
});

export const addLabelSchema = z.object({
  labelId: id,
});
