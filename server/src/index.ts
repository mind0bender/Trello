import express, { type Application } from "express";
import helmet from "helmet";
import cors from "cors";
import rootRouter from "./routes";
import httpLogger from "./middleware/logger.middleware";
import { PORT } from "./utils/constants";
import logger from "./lib/logger";
import errorHandler from "./middleware/error.middleware";

const app: Application = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(httpLogger);
app.use(errorHandler);

// API routes
app.use(rootRouter);

app.listen(PORT, (): void => {
  logger.info(`Server running on PORT ${PORT}`);
});

