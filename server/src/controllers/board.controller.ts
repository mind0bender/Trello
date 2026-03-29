import type { Request, Response } from "express";
import { boardService } from "../services/board.service";
import {
  successResponse,
  failureResponse,
  type ApiResponse,
} from "../utils/response";
import type { BoardIdParam } from "../validator/board.schema";
import type { Board } from "../generated/prisma/client";
import type { FullBoard } from "../types";

export const boardController = {
  async createBoard(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Board>>> {
    const board = await boardService.createBoard(req.body);
    return res.status(201).json(successResponse<Board>(board));
  },

  async getBoards(
    _req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Board[]>>> {
    const boards = await boardService.getBoards();
    return res.json(successResponse<Board[]>(boards));
  },

  async getBoard(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Board>>> {
    const { id } = req.params as BoardIdParam;

    const board = await boardService.getBoardById(id);

    if (!board) {
      return res.status(404).json(failureResponse(["Board not found"]));
    }

    return res.json(successResponse<Board>(board));
  },

  async getBoardFull(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<FullBoard>>> {
    const { id } = req.params as BoardIdParam;

    const board: FullBoard | null = await boardService.getBoardFull(id);

    if (!board) {
      return res.status(404).json(failureResponse(["Board not found"]));
    }

    return res.json(successResponse<FullBoard>(board));
  },

  async updateBoard(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Board>>> {
    const { id } = req.params as BoardIdParam;

    const board: Board = await boardService.updateBoard(id, req.body);

    return res.json(successResponse<Board>(board));
  },

  async deleteBoard(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<null>>> {
    const { id } = req.params as BoardIdParam;

    await boardService.deleteBoard(id);

    return res.json(successResponse<null>(null));
  },
};
