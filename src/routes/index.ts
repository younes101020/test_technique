import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { defaultHook } from "stoker/openapi";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import type { AppBindings } from "@/lib/types";

const tags = ["Index"];

const router = new OpenAPIHono<AppBindings>({
  strict: false,
  defaultHook,
})
  .openapi(
    createRoute({
      tags,
      method: "get",
      path: "/",
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          createMessageObjectSchema("Valuemycar API"),
          "Valuemycar API Index",
        ),
      },
    }),
    (c) => {
      return c.json({
        message: "Valuemycar API",
      }, HttpStatusCodes.OK);
    },
  );

export default router;
