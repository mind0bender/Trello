import { Router } from "express";
import { boardController } from "../controllers/board.controller";
import {
  createBoardSchema,
  updateBoardSchema,
  boardIdParamSchema,
} from "../validator/board.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.post(
  "/boards",
  validate(createBoardSchema),
  asyncHandler(boardController.createBoard),
);

router.get("/boards", asyncHandler(boardController.getBoards));

router.get(
  "/boards/:id",
  validate(boardIdParamSchema, "params"),
  asyncHandler(boardController.getBoard),
);

router.get(
  "/boards/:id/full",
  validate(boardIdParamSchema, "params"),
  asyncHandler(boardController.getBoardFull),
);

router.patch(
  "/boards/:id",
  validate(boardIdParamSchema, "params"),
  validate(updateBoardSchema),
  asyncHandler(boardController.updateBoard),
);

router.delete(
  "/boards/:id",
  validate(boardIdParamSchema, "params"),
  asyncHandler(boardController.deleteBoard),
);

export default router;
