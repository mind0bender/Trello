import { Router } from "express";
import { labelController } from "../controllers/label.controller";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createLabelSchema,
  updateLabelSchema,
  labelIdParamSchema,
} from "../validator/label.schema";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.post(
  "/labels",
  validate(createLabelSchema),
  asyncHandler(labelController.createLabel),
);

router.get("/labels", asyncHandler(labelController.getLabels));

router.get("/cards/:id/labels", asyncHandler(labelController.getLabelsByCard));

router.patch(
  "/labels/:id",
  validate(labelIdParamSchema, "params"),
  validate(updateLabelSchema),
  asyncHandler(labelController.updateLabel),
);

router.delete(
  "/labels/:id",
  validate(labelIdParamSchema, "params"),
  asyncHandler(labelController.deleteLabel),
);

export default router;
