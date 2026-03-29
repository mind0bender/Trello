import pino from "pino";
import { IS_DEV } from "../utils/constants";

const logger = pino({
  level: IS_DEV ? "debug" : "info",
  transport: IS_DEV
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      }
    : undefined,
});

export default logger;
