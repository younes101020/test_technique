import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "stoker/openapi";

import configureOpenAPI from "@/lib/doc/configure-open-api";
import handleNotFound from "@/middlewares/not-found";
import index from "@/routes";
import auth from "@/routes/auth";
import brands from "@/routes/brand";
import cars from "@/routes/car";

import type { AppBindings } from "./lib/types";

import handleAuthentication from "./middlewares/authentication";
import handleIsAdmin from "./middlewares/check-admin";
import handleLogger from "./middlewares/logger";
import handleError from "./middlewares/on-error";

const app = new OpenAPIHono<AppBindings>({
  strict: false,
  defaultHook,
});

app.use(handleLogger());

app.notFound(handleNotFound);
app.onError(handleError);

configureOpenAPI(app);

app.use("/^(?!\/auth\/).+/", handleAuthentication);
app.delete("*", handleIsAdmin);

const routes = [
  auth,
  cars,
  brands,
  index,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
