import express, { type Application } from "express";
import helmet from "helmet";
import cors from "cors";
import rootRouter from "./routes";
import { IS_DEV, PORT } from "./utils/constants";
import logger from "./lib/logger";
import { errorHandler } from "./middleware/error.middleware";
import morgan from "morgan";

const app: Application = express();

// middlewares
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: IS_DEV ? "http://localhost:5173" : "https://trello-m0b.vercel.app",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(errorHandler);

// API routes
app.use("/api/", rootRouter);

app.listen(PORT, (): void => {
  logger.info(`Server running on PORT ${PORT}`);
});
