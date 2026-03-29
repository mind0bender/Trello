import { Router } from "express";
import { checklistController } from "../controllers/checklist.controller";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createChecklistItemSchema,
  updateChecklistItemSchema,
  reorderChecklistItemSchema,
} from "../validator/checklist.schema";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.post(
  "/checklist",
  validate(createChecklistItemSchema),
  asyncHandler(checklistController.createItem),
);

router.get(
  "/cards/:cardId/checklist",
  asyncHandler(checklistController.getItems),
);

router.patch(
  "/checklist/:id",
  validate(updateChecklistItemSchema),
  asyncHandler(checklistController.updateItem),
);

router.patch(
  "/checklist/reorder",
  validate(reorderChecklistItemSchema),
  asyncHandler(checklistController.reorderItem),
);

router.delete("/checklist/:id", asyncHandler(checklistController.deleteItem));

export default router;
