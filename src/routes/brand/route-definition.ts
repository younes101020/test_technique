import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { brandInsertSchema, brandSelectSchema, carSelectSchema, paginationQuerySchema, patchBrandSchema } from "@/dtos";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Brands"];

export const listRouteDefinition = createRoute({
  path: "/brands",
  method: "get",
  request: {
    query: paginationQuerySchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(brandSelectSchema),
      "The list of brands",
    ),
  },
});

export const getOneRouteDefinition = createRoute({
  path: "/brands/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      brandSelectSchema,
      "The requested brand",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Brand not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The validation error(s)",
    ),
  },
});

export const createRouteDefinition = createRoute({
  path: "/brands",
  method: "post",
  request: {
    body: jsonContentRequired(
      brandInsertSchema,
      "The brand to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      brandSelectSchema,
      "The created brand",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(brandInsertSchema),
      "The validation error(s)",
    ),
  },
});

export const deleteRouteDefinition = createRoute({
  path: "/brands/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Brand deleted",
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid brand id error",
    ),
  },
});

export const patchRouteDefinition = createRoute({
  path: "/brands/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchBrandSchema, "Brand updates"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(brandSelectSchema, "The updated brand"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Brand not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchBrandSchema).or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const carsListRouteDefinition = createRoute({
  path: "/brands/{id}/cars",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(carSelectSchema),
      "The requested brand related cars",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid brand id error",
    ),
  },
});

export type ListRoute = typeof listRouteDefinition;
export type GetOneRoute = typeof getOneRouteDefinition;
export type CarsListRoute = typeof carsListRouteDefinition;
export type CreateRoute = typeof createRouteDefinition;
export type DeleteRoute = typeof deleteRouteDefinition;
export type PatchRoute = typeof patchRouteDefinition;
