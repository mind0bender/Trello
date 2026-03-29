import type { Request, Response } from "express";
import { checklistService } from "../services/checklist.service";
import { successResponse, type ApiResponse } from "../utils/response";
import type { ChecklistItem } from "../generated/prisma/client";

type ItemIdParam = { id: string };
type CardIdParam = { cardId: string };

export const checklistController = {
  async createItem(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<ChecklistItem>>> {
    const item = await checklistService.createItem(req.body);
    return res.status(201).json(successResponse(item));
  },

  async getItems(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<ChecklistItem[]>>> {
    const { cardId } = req.params as CardIdParam;

    const items = await checklistService.getItems(cardId);

    return res.json(successResponse(items));
  },

  async toggleItem(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<ChecklistItem>>> {
    const { id } = req.params as ItemIdParam;

    const item = await checklistService.toggleItem(id);

    return res.json(successResponse(item));
  },

  async updateItem(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<ChecklistItem>>> {
    const { id } = req.params as ItemIdParam;
    const { content } = req.body;

    const item = await checklistService.updateItem(id, content);

    return res.json(successResponse(item));
  },

  async deleteItem(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<null>>> {
    const { id } = req.params as ItemIdParam;

    await checklistService.deleteItem(id);

    return res.json(successResponse(null));
  },

  async reorderItem(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<ChecklistItem>>> {
    const item = await checklistService.reorderItem(req.body);

    return res.json(successResponse(item));
  },
};
