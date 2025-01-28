import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "stoker/openapi";

import type { AppBindings } from "@/lib/types";

import { AuthController } from "@/controllers/auth";
import { AuthService } from "@/services/auth";

import { loginRouteDefinition, logoutRouteDefinition, registerRouteDefinition } from "./route-definition";

const service = new AuthService();
const controller = new AuthController(service);

const router = new OpenAPIHono<AppBindings>({
  strict: false,
  defaultHook,
}).openapi(loginRouteDefinition, controller.login).openapi(registerRouteDefinition, controller.register).openapi(logoutRouteDefinition, controller.logout);

export default router;
