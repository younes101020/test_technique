import { pinoLogger as logger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

import env from "@/config/env";

export class Logger {
  private static pinoInstance = pino({
    level: env.LOG_LEVEL || "info",
  }, env.NODE_ENV === "production" ? undefined : pretty());

  static handle() {
    return logger({
      pino: Logger.pinoInstance,
      http: {
        reqId: () => crypto.randomUUID(),
      },
    });
  }
}

export default Logger.handle;
