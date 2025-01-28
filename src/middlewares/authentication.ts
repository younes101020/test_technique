import type { MiddlewareHandler } from "hono";

import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import * as HttpStatusCodes from "stoker/http-status-codes";

import env from "@/config/env";

export class Authentication {
  public verify: MiddlewareHandler = async (c, next) => {
    const jwtToken = getCookie(c, "session");

    if (!jwtToken) {
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
        message: "Missing session cookie",
      });
    }

    const decodedJwtSessionPayload = await verify(jwtToken, env.AUTH_SECRET);

    if (!decodedJwtSessionPayload) {
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
        message: "Invalid or expired jwt",
      });
    }

    c.set("role", decodedJwtSessionPayload.role)

    await next();
  };
}

const middleware = new Authentication();
export default middleware.verify;
