import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";

import { authenticatedUserSelectSchema, loginSchema, registerSchema } from "@/dtos/auth";
import { conflictSchema, okSchema } from "@/lib/constants";

const tags = ["Auth"];

export const loginRouteDefinition = createRoute({
  path: "/auth/login",
  method: "post",
  request: {
    body: jsonContentRequired(
      loginSchema,
      "The credentials",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      authenticatedUserSelectSchema,
      "The authenticated user info",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginSchema),
      "The validation error(s)",
    ),
  },
});

export const registerRouteDefinition = createRoute({
  path: "/auth/register",
  method: "post",
  request: {
    body: jsonContentRequired(
      registerSchema,
      "The new user info",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      authenticatedUserSelectSchema,
      "The authenticated user info",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(registerSchema),
      "The validation error(s)",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      conflictSchema,
      "User already exists",
    ),
  },
});

export const logoutRouteDefinition = createRoute({
  path: "/auth/logout",
  method: "delete",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      okSchema,
      "Session has been deleted",
    ),
  },
});

export type LoginRoute = typeof loginRouteDefinition;
export type RegisterRoute = typeof registerRouteDefinition;
export type LogoutRoute = typeof logoutRouteDefinition;
