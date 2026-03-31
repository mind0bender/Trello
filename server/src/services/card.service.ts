import type {
  Card,
  CardLabel,
  CardMember,
  ChecklistItem,
} from "../generated/prisma/client";
import type { Card$labelsArgs } from "../generated/prisma/models";
import prisma from "../lib/db";
import logger from "../lib/logger";

const cardService = {
  async createCard({
    title,
    description,
    listId,
  }: {
    title: string;
    description?: string;
    listId: string;
  }): Promise<Card> {
    const maxPosition = await prisma.card.aggregate({
      where: {
        listId,
      },
      _max: { position: true },
    });

    return prisma.card.create({
      data: {
        title,
        listId,
        description: description || "",
        position: (maxPosition._max.position ?? 0) + 1,
      },
    });
  },

  async getCardsByList(listId: string): Promise<Card[]> {
    return prisma.card.findMany({
      where: { listId },
      orderBy: { position: "asc" },
      include: {
        labels: { include: { label: true } },
        members: { include: { member: true } },
        checklist: true,
      },
    });
  },

  async updateCard(
    cardId: string,
    data: {
      title?: string;
      description: string;
      dueDate: Date;
    },
  ): Promise<Card> {
    return prisma.card.update({ where: { id: cardId }, data });
  },

  async deleteCard(cardId: string): Promise<Card> {
    return prisma.card.delete({
      where: {
        id: cardId,
      },
    });
  },

  async moveCard({
    cardId,
    sourceListId,
    destListId,
    newPosition,
  }: {
    cardId: string;
    sourceListId: string;
    destListId: string;
    newPosition: number;
  }): Promise<Card> {
    return prisma.$transaction(
      async (tx) => {
        const card: Card | null = await tx.card.findUnique({
          where: { id: cardId },
        });
        if (!card) throw new Error("Card not found");

        const oldPosition: number = card.position;

        if (sourceListId === destListId) {
          if (newPosition > oldPosition) {
            await tx.card.updateMany({
              where: {
                listId: sourceListId,
                position: {
                  gt: oldPosition,
                  lte: newPosition,
                },
              },
              data: {
                position: { decrement: 1 },
              },
            });
          } else {
            await tx.card.updateMany({
              where: {
                listId: sourceListId,
                position: { gte: newPosition, lt: oldPosition },
              },
              data: {
                position: {
                  increment: 1,
                },
              },
            });
          }
        } else {
          await tx.card.updateMany({
            where: {
              listId: sourceListId,
              position: { gt: oldPosition },
            },
            data: {
              position: { decrement: 1 },
            },
          });

          await tx.card.updateMany({
            where: {
              listId: destListId,
              position: {
                gte: newPosition,
              },
            },
            data: {
              position: { increment: 1 },
            },
          });
        }

        return tx.card.update({
          where: {
            id: cardId,
          },
          data: {
            listId: destListId,
            position: newPosition,
          },
        });
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );
  },

  async addMember(cardId: string, memberId: string): Promise<CardMember> {
    return prisma.cardMember.create({
      data: {
        cardId,
        memberId,
      },
    });
  },

  async addLabel(cardId: string, labelId: string): Promise<CardLabel> {
    return prisma.cardLabel.create({
      data: {
        cardId,
        labelId,
      },
    });
  },

  async toggleChecklistItem(itemId: string): Promise<ChecklistItem> {
    const item: ChecklistItem | null = await prisma.checklistItem.findUnique({
      where: { id: itemId },
    });
    if (!item) throw new Error("Checklist item not found");

    return prisma.checklistItem.update({
      where: {
        id: itemId,
      },
      data: {
        done: !item.done,
      },
    });
  },
};

export default cardService;
