import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { carInsertSchema, carSelectSchema, paginationQuerySchema, patchCarSchema } from "@/dtos";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Cars"];

export const listRouteDefinition = createRoute({
  path: "/cars",
  method: "get",
  request: {
    query: paginationQuerySchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(carSelectSchema),
      "The list of cars",
    ),
  },
});

export const getOneRouteDefinition = createRoute({
  path: "/cars/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      carSelectSchema,
      "The requested car",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Car not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The validation error(s)",
    ),
  },
});

export const createRouteDefinition = createRoute({
  path: "/cars",
  method: "post",
  request: {
    body: jsonContentRequired(
      carInsertSchema,
      "The car to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      carSelectSchema,
      "The created car",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(carInsertSchema),
      "The validation error(s)",
    ),
  },
});

export const deleteRouteDefinition = createRoute({
  path: "/cars/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Car deleted",
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid car id error",
    ),
  },
});

export const patchRouteDefinition = createRoute({
  path: "/cars/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchCarSchema, "Car updates"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(carSelectSchema, "The updated car"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Car not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchCarSchema).or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type ListRoute = typeof listRouteDefinition;
export type GetOneRoute = typeof getOneRouteDefinition;
export type CreateRoute = typeof createRouteDefinition;
export type DeleteRoute = typeof deleteRouteDefinition;
export type PatchRoute = typeof patchRouteDefinition;
