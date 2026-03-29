import { Router } from "express";
import { cardController } from "../controllers/card.controller";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createCardSchema,
  updateCardSchema,
  moveCardSchema,
  addMemberSchema,
  addLabelSchema,
} from "../validator/card.schema";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.post(
  "/cards",
  validate(createCardSchema),
  asyncHandler(cardController.createCard),
);

router.get("/lists/:listId/cards", asyncHandler(cardController.getCardsByList));

router.patch(
  "/cards/:id",
  validate(updateCardSchema),
  asyncHandler(cardController.updateCard),
);

router.delete("/cards/:id", asyncHandler(cardController.deleteCard));

router.post(
  "/cards/move",
  validate(moveCardSchema),
  asyncHandler(cardController.moveCard),
);

router.post(
  "/cards/:id/members",
  validate(addMemberSchema),
  asyncHandler(cardController.addMember),
);

router.post(
  "/cards/:id/labels",
  validate(addLabelSchema),
  asyncHandler(cardController.addLabel),
);

router.patch(
  "/checklist/:id/toggle",
  asyncHandler(cardController.toggleChecklistItem),
);

export default router;
