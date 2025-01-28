import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "stoker/openapi";

import type { AppBindings } from "@/lib/types";

import { BrandController } from "@/controllers/brand";
import { BrandService } from "@/services/brand";

import { carsListRouteDefinition, createRouteDefinition, deleteRouteDefinition, getOneRouteDefinition, listRouteDefinition, patchRouteDefinition } from "./route-definition";

const service = new BrandService();
export const controller = new BrandController(service);

const router = new OpenAPIHono<AppBindings>({
  strict: false,
  defaultHook,
})
  .openapi(listRouteDefinition, controller.list)
  .openapi(getOneRouteDefinition, controller.getOne)
  .openapi(carsListRouteDefinition, controller.listCars)
  .openapi(createRouteDefinition, controller.create)
  .openapi(deleteRouteDefinition, controller.delete)
  .openapi(patchRouteDefinition, controller.patch);

export default router;
