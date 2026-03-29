import type { ChecklistItem } from "../generated/prisma/client";
import prisma from "../lib/db";

export const checklistService = {
  async createItem(data: {
    content: string;
    cardId: string;
  }): Promise<ChecklistItem> {
    const maxPosition = await prisma.checklistItem.aggregate({
      where: { cardId: data.cardId },
      _max: { position: true },
    });

    return prisma.checklistItem.create({
      data: {
        content: data.content,
        cardId: data.cardId,
        position: (maxPosition._max.position ?? 0) + 1,
      },
    });
  },

  async getItems(cardId: string): Promise<ChecklistItem[]> {
    return prisma.checklistItem.findMany({
      where: { cardId },
      orderBy: { position: "asc" },
    });
  },

  async toggleItem(itemId: string): Promise<ChecklistItem> {
    const item = await prisma.checklistItem.findUnique({
      where: { id: itemId },
    });

    if (!item) throw new Error("Checklist item not found");

    return prisma.checklistItem.update({
      where: { id: itemId },
      data: { done: !item.done },
    });
  },

  async updateItem(itemId: string, content: string): Promise<ChecklistItem> {
    return prisma.checklistItem.update({
      where: { id: itemId },
      data: { content },
    });
  },

  async deleteItem(itemId: string): Promise<boolean> {
    return prisma.$transaction(async (tx): Promise<boolean> => {
      const item = await tx.checklistItem.findUnique({
        where: { id: itemId },
      });

      if (!item) throw new Error("Checklist item not found");

      await tx.checklistItem.delete({
        where: { id: itemId },
      });

      await tx.checklistItem.updateMany({
        where: {
          cardId: item.cardId,
          position: { gt: item.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      return true;
    });
  },

  async reorderItem(params: {
    itemId: string;
    newPosition: number;
  }): Promise<ChecklistItem> {
    const { itemId, newPosition } = params;

    return prisma.$transaction(async (tx): Promise<ChecklistItem> => {
      const item = await tx.checklistItem.findUnique({
        where: { id: itemId },
      });

      if (!item) throw new Error("Checklist item not found");

      const oldPosition = item.position;

      if (newPosition === oldPosition) return item;

      if (newPosition > oldPosition) {
        await tx.checklistItem.updateMany({
          where: {
            cardId: item.cardId,
            position: {
              gt: oldPosition,
              lte: newPosition,
            },
          },
          data: { position: { decrement: 1 } },
        });
      } else {
        await tx.checklistItem.updateMany({
          where: {
            cardId: item.cardId,
            position: {
              gte: newPosition,
              lt: oldPosition,
            },
          },
          data: { position: { increment: 1 } },
        });
      }

      return tx.checklistItem.update({
        where: { id: itemId },
        data: { position: newPosition },
      });
    });
  },
};
