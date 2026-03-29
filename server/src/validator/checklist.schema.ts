import { z } from "zod";

const id = z.uuid();

export const createChecklistItemSchema = z.object({
  content: z.string().trim().min(1).max(500),
  cardId: id,
});

export const updateChecklistItemSchema = z.object({
  content: z.string().trim().min(1).max(500),
});

export const reorderChecklistItemSchema = z.object({
  itemId: id,
  newPosition: z.number().int().min(1),
});
