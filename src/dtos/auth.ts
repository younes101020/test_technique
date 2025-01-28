import { z } from "@hono/zod-openapi";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = z.object({
  email: z.string(),
  name: z.string(),
  age: z.number(),
  password: z.string(),
});

export const authenticatedUserSelectSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  age: z.number(),
});

export type AuthenticatedUserSelect = z.infer<typeof authenticatedUserSelectSchema>;
