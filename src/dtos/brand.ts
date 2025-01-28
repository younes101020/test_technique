import { z } from "@hono/zod-openapi";

export const brandInsertSchema = z.object({
  name: z.string(),
  year: z.number(),
  price: z.number(),
});

export const brandSelectSchema = z.object({
  id: z.number(),
  name: z.string(),
  year: z.number(),
  price: z.number(),
});

export const patchBrandSchema = brandInsertSchema.partial();

export type BrandInsertSchema = z.infer<typeof brandInsertSchema>;
export type BrandSelectSchema = z.infer<typeof brandSelectSchema>;
export type PatchBrandSchema = z.infer<typeof patchBrandSchema>;
