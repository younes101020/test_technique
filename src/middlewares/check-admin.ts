import type { MiddlewareHandler } from "hono";

import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

export class CheckRole {
  public isAdmin: MiddlewareHandler = async (c, next) => {
    const role = c.get("role");

    if (!role || role !== "admin") {
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
        message: "You must be an admin to access this resource",
      });
    }

    await next();
  };
}

const middleware = new CheckRole();
export default middleware.isAdmin;
