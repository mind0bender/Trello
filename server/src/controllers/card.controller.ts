import type { Request, Response } from "express";
import { successResponse, type ApiResponse } from "../utils/response";
import type { Card } from "../generated/prisma/client";
import cardService from "../services/card.service";

type CardIdParam = { id: string };
type ListIdParam = { listId: string };

export const cardController = {
  async createCard(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Card>>> {
    const card = await cardService.createCard(req.body);
    return res.status(201).json(successResponse(card));
  },

  async getCardsByList(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Card[]>>> {
    const { listId } = req.params as ListIdParam;

    const cards = await cardService.getCardsByList(listId);

    return res.json(successResponse(cards));
  },

  async updateCard(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Card>>> {
    const { id } = req.params as CardIdParam;

    const card = await cardService.updateCard(id, req.body);

    return res.json(successResponse(card));
  },

  async deleteCard(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<null>>> {
    const { id } = req.params as CardIdParam;

    await cardService.deleteCard(id);

    return res.json(successResponse(null));
  },

  async moveCard(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Card>>> {
    const card = await cardService.moveCard(req.body);

    return res.json(successResponse(card));
  },

  async addMember(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<null>>> {
    const { id } = req.params as CardIdParam;
    const { memberId } = req.body;

    await cardService.addMember(id, memberId);

    return res.json(successResponse(null));
  },

  async addLabel(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<null>>> {
    const { id } = req.params as CardIdParam;
    const { labelId } = req.body;

    await cardService.addLabel(id, labelId);

    return res.json(successResponse(null));
  },

  async toggleChecklistItem(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<null>>> {
    const { id } = req.params as CardIdParam;

    await cardService.toggleChecklistItem(id);

    return res.json(successResponse(null));
  },
};
