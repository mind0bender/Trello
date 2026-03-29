import { Router, type Request, type Response } from "express";

const rootRouter: Router = Router();

import boardRoutes from "./board.routes";
import listRoutes from "./list.routes";
import cardRoutes from "./card.routes";
import checklistRoutes from "./checklist.routes";
import labelRoutes from "./label.routes";
import memberRoutes from "./member.routes";

rootRouter.use(boardRoutes);
rootRouter.use(listRoutes);
rootRouter.use(cardRoutes);
rootRouter.use(checklistRoutes);
rootRouter.use(labelRoutes);
rootRouter.use(memberRoutes);

rootRouter.get("/health", (_req: Request, res: Response): void => {
  res.send("OK");
});

export default rootRouter;
