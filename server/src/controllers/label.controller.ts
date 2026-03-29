import type { Request, Response } from "express";
import { successResponse, type ApiResponse } from "../utils/response";
import type { CardLabel, Label } from "../generated/prisma/client";
import labelService from "../services/label.service";
import type { CardLabelGetPayload } from "../generated/prisma/models";

type LabelIdParam = { id: string };
type CardIdParam = { id: string };

export const labelController = {
  async createLabel(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Label>>> {
    const label = await labelService.createLabel(req.body);
    return res.status(201).json(successResponse(label));
  },

  async getLabels(
    _req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Label[]>>> {
    const labels = await labelService.getAllLabels();
    return res.json(successResponse(labels));
  },

  async getLabelsByCard(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Label[]>>> {
    const { id } = req.params as CardIdParam;

    const result: CardLabelGetPayload<{ include: { label: true } }>[] =
      await labelService.getLabelsByCard(id);

    const labels = result.map(
      (l: CardLabelGetPayload<{ include: { label: true } }>): Label => l.label,
    );

    return res.json(successResponse(labels));
  },

  async updateLabel(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Label>>> {
    const { id } = req.params as LabelIdParam;

    const label = await labelService.updateLabel(id, req.body);

    return res.json(successResponse(label));
  },

  async deleteLabel(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<null>>> {
    const { id } = req.params as LabelIdParam;

    await labelService.deleteLabel(id);

    return res.json(successResponse(null));
  },
};
