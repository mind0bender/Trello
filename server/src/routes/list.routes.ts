import { Router } from "express";
import { listController } from "../controllers/list.controller";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createListSchema,
  updateListSchema,
  moveListSchema,
  listIdParamSchema,
  boardIdParamSchema,
  swapListSchema,
} from "../validator/list.schema";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.post(
  "/lists",
  validate(createListSchema),
  asyncHandler(listController.createList),
);

router.get(
  "/boards/:boardId/lists",
  validate(boardIdParamSchema, "params"),
  asyncHandler(listController.getLists),
);

router.patch(
  "/lists/:id",
  validate(listIdParamSchema, "params"),
  validate(updateListSchema),
  asyncHandler(listController.updateList),
);

router.delete(
  "/lists/:id",
  validate(listIdParamSchema, "params"),
  asyncHandler(listController.deleteList),
);

router.post(
  "/lists/swap",
  validate(swapListSchema),
  asyncHandler(listController.swapList),
);

router.post(
  "/lists/move",
  validate(moveListSchema),
  asyncHandler(listController.moveList),
);

export default router;
