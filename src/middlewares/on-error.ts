import type { ErrorHandler } from "hono";

import { HTTPException } from "hono/http-exception";

class ErrorMiddleware {
  public handle: ErrorHandler = (err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    console.error(err);
    return c.json(
      {
        message: "Internal Server Error",
      },
      500,
    );
  };
}

const middleware = new ErrorMiddleware();
export default middleware.handle;
