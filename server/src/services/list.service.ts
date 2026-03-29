import type { List } from "../generated/prisma/client";
import prisma from "../lib/db";

export const listService = {
  async createList(data: { title: string; boardId: string }): Promise<List> {
    const maxPosition = await prisma.list.aggregate({
      where: { boardId: data.boardId },
      _max: { position: true },
    });

    return prisma.list.create({
      data: {
        title: data.title,
        boardId: data.boardId,
        position: (maxPosition._max.position ?? 0) + 1,
      },
    });
  },

  async getLists(boardId: string): Promise<List[]> {
    return prisma.list.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
      include: {
        cards: {
          orderBy: { position: "asc" },
        },
      },
    });
  },

  async updateList(listId: string, data: { title?: string }): Promise<List> {
    return prisma.list.update({
      where: { id: listId },
      data,
    });
  },

  async deleteList(listId: string): Promise<boolean> {
    return prisma.$transaction(async (tx): Promise<boolean> => {
      const list = await tx.list.findUnique({
        where: { id: listId },
      });

      if (!list) throw new Error("List not found");

      await tx.list.delete({
        where: { id: listId },
      });

      await tx.list.updateMany({
        where: {
          boardId: list.boardId,
          position: { gt: list.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      return true;
    });
  },

  async swapLists({
    list1Id,
    list2Id,
    boardId,
  }: {
    list1Id: string;
    boardId: string;
    list2Id: string;
  }): Promise<List> {
    const newPosition: number | undefined = (
      await prisma.list.findUnique({
        where: {
          id: list2Id,
        },
      })
    )?.position;

    if (!newPosition) throw new Error("List not found");

    return await this.moveList({
      listId: list1Id,
      boardId,
      newPosition,
    });
  },

  async moveList(params: {
    listId: string;
    boardId: string;
    newPosition: number;
  }): Promise<List> {
    const { listId, boardId, newPosition } = params;

    return prisma.$transaction(async (tx): Promise<List> => {
      const list = await tx.list.findUnique({
        where: { id: listId },
      });

      if (!list) throw new Error("List not found");

      const oldPosition = list.position;

      if (newPosition === oldPosition) return list;

      if (newPosition > oldPosition) {
        await tx.list.updateMany({
          where: {
            boardId,
            position: {
              gt: oldPosition,
              lte: newPosition,
            },
          },
          data: { position: { decrement: 1 } },
        });
      } else {
        await tx.list.updateMany({
          where: {
            boardId,
            position: {
              gte: newPosition,
              lt: oldPosition,
            },
          },
          data: { position: { increment: 1 } },
        });
      }

      return tx.list.update({
        where: { id: listId },
        data: { position: newPosition },
      });
    });
  },
};
