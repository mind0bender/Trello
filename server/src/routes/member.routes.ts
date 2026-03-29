import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createMemberSchema,
  updateMemberSchema,
  memberIdParamSchema,
} from "../validator/member.schema";
import { validate } from "../middleware/validate.middleware";
import { memberController } from "../controllers/member.controller";

const router = Router();

router.post(
  "/members",
  validate(createMemberSchema),
  asyncHandler(memberController.createMember),
);

router.get("/members", asyncHandler(memberController.getMembers));

router.get(
  "/members/:id",
  validate(memberIdParamSchema, "params"),
  asyncHandler(memberController.getMember),
);

router.patch(
  "/members/:id",
  validate(memberIdParamSchema, "params"),
  validate(updateMemberSchema),
  asyncHandler(memberController.updateMember),
);

router.delete(
  "/members/:id",
  validate(memberIdParamSchema, "params"),
  asyncHandler(memberController.deleteMember),
);

export default router;
