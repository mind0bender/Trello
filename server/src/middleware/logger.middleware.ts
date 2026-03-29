import pinoHttp from "pino-http";
import { IS_DEV } from "../utils/constants";

const httpLogger = pinoHttp({
  transport: IS_DEV
    ? {
        target: "pino-pretty",
      }
    : undefined,
});

export default httpLogger;
