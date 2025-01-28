import { z } from "@hono/zod-openapi";

export const carInsertSchema = z.object({
  country: z.string(),
  brandId: z.number(),
});

export const carSelectSchema = z.object({
  id: z.number(),
  country: z.string(),
  brandId: z.number(),
});

export const patchCarSchema = carInsertSchema.partial();

export type CarInsertSchema = z.infer<typeof carInsertSchema>;
export type CarSelectSchema = z.infer<typeof carSelectSchema>;
export type PatchCarSchema = z.infer<typeof patchCarSchema>;
