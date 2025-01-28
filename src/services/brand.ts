import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { BrandInsertSchema, PatchBrandSchema } from "@/dtos";

import { db } from "@/lib/db";
import { brands, cars } from "@/lib/db/schema";

export class BrandService {
  async list(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const results = await db
      .select()
      .from(brands)
      .limit(limit)
      .offset(offset);

    return results;
  }

  async getOne(brandId: number) {
    const [brand] = await db.select().from(brands).where(eq(brands.id, brandId));

    if (!brand) {
      throw new HTTPException(HttpStatusCodes.NOT_FOUND, { message: "Brand not found" });
    }

    return brand;
  }

  async listCars(brandId: number) {
    const result = await db
      .select()
      .from(cars)
      .where(eq(cars.brandId, brandId));

    return result;
  }

  async create(data: BrandInsertSchema) {
    const [brand] = await db
      .insert(brands)
      .values(data)
      .returning();

    return brand;
  }

  async delete(brandId: number) {
    await db.delete(brands).where(eq(brands.id, brandId))
  }

  async patch(brandId: number, updatedBrand: PatchBrandSchema) {
    const [brand] = await db.update(brands)
      .set(updatedBrand)
      .where(eq(brands.id, brandId))
      .returning();

    if (!brand) {
      throw new HTTPException(404, { message: "Brand not found" });
    }

    return brand;
  }
}
