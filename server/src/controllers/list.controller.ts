import type { Request, Response } from "express";
import { listService } from "../services/list.service";
import { successResponse, type ApiResponse } from "../utils/response";
import type { List } from "../generated/prisma/client";

type ListIdParam = { id: string };
type BoardIdParam = { boardId: string };

export const listController = {
  async createList(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<List>>> {
    const list = await listService.createList(req.body);
    return res.status(201).json(successResponse(list));
  },

  async getLists(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<List[]>>> {
    const { boardId } = req.params as BoardIdParam;

    const lists = await listService.getLists(boardId);

    return res.json(successResponse(lists));
  },

  async updateList(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<List>>> {
    const { id } = req.params as ListIdParam;

    const list = await listService.updateList(id, req.body);

    return res.json(successResponse(list));
  },

  async deleteList(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<null>>> {
    const { id } = req.params as ListIdParam;

    await listService.deleteList(id);

    return res.json(successResponse(null));
  },

  async swapList(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<List>>> {
    const list = await listService.swapLists(req.body);
    return res.json(successResponse(list));
  },
  async moveList(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<List>>> {
    const list = await listService.moveList(req.body);

    return res.json(successResponse(list));
  },
};
