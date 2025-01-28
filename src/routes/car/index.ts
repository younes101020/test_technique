import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "stoker/openapi";

import type { AppBindings } from "@/lib/types";

import { CarController } from "@/controllers/car";
import { CarService } from "@/services/car";

import { createRouteDefinition, deleteRouteDefinition, getOneRouteDefinition, listRouteDefinition, patchRouteDefinition } from "./route-definition";

const service = new CarService();
const controller = new CarController(service);

const router = new OpenAPIHono<AppBindings>({
  strict: false,
  defaultHook,
})
  .openapi(createRouteDefinition, controller.create)
  .openapi(deleteRouteDefinition, controller.delete)
  .openapi(patchRouteDefinition, controller.patch)
  .openapi(listRouteDefinition, controller.list)
  .openapi(getOneRouteDefinition, controller.getOne);

export default router;
