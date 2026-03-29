import type { Request, Response } from "express";
import { memberService } from "../services/member.service";
import {
  successResponse,
  failureResponse,
  type ApiResponse,
} from "../utils/response";
import type { Member } from "../generated/prisma/client";
import type { MemberIdParam } from "../validator/member.schema";

export const memberController = {
  async createMember(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Member>>> {
    const member = await memberService.createMember(req.body);
    return res.status(201).json(successResponse<Member>(member));
  },

  async getMembers(
    _req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Member[]>>> {
    const members = await memberService.getAllMembers();
    return res.json(successResponse<Member[]>(members));
  },

  async getMember(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Member>>> {
    const { id } = req.params as MemberIdParam;

    const member = await memberService.getMemberById(id);

    if (!member) {
      return res.status(404).json(failureResponse(["Member not found"]));
    }

    return res.json(successResponse<Member>(member));
  },

  async updateMember(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<Member>>> {
    const { id } = req.params as MemberIdParam;

    const member = await memberService.updateMember(id, req.body);

    return res.json(successResponse<Member>(member));
  },

  async deleteMember(
    req: Request,
    res: Response,
  ): Promise<Response<ApiResponse<null>>> {
    const { id } = req.params as MemberIdParam;

    await memberService.deleteMember(id);

    return res.json(successResponse<null>(null));
  },
};
