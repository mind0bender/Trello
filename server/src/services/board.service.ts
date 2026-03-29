import type { Board } from "../generated/prisma/client";
import type { BoardGetPayload } from "../generated/prisma/models";
import prisma from "../lib/db";
import type { FullBoard } from "../types";

export const boardService = {
  async createBoard(data: {
    title: string;
    background?: string;
  }): Promise<Board> {
    return prisma.board.create({
      data,
    });
  },

  async getBoards(): Promise<Board[]> {
    return prisma.board.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async getBoardById(boardId: string): Promise<Board | null> {
    return prisma.board.findUnique({
      where: { id: boardId },
    });
  },

  async getBoardFull(boardId: string): Promise<FullBoard | null> {
    return prisma.board.findUnique({
      where: { id: boardId },
      include: {
        lists: {
          orderBy: { position: "asc" },
          include: {
            cards: {
              orderBy: { position: "asc" },
              include: {
                labels: { include: { label: true } },
                members: { include: { member: true } },
                checklist: {
                  orderBy: { position: "asc" },
                },
              },
            },
          },
        },
      },
    });
  },

  async updateBoard(
    boardId: string,
    data: { title?: string; background?: string },
  ): Promise<Board> {
    return prisma.board.update({
      where: { id: boardId },
      data,
    });
  },

  async deleteBoard(boardId: string): Promise<Board> {
    return prisma.board.delete({
      where: { id: boardId },
    });
  },
};
