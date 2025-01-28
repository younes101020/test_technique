import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { CarInsertSchema, PatchCarSchema } from "@/dtos";

import { db } from "@/lib/db";
import { cars } from "@/lib/db/schema";

export class CarService {
  async list(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const results = await db
      .select()
      .from(cars)
      .limit(limit)
      .offset(offset);

    return results;
  }

  async getOne(carId: number) {
    const [car] = await db.select().from(cars).where(eq(cars.id, carId));

    if (!car) {
      throw new HTTPException(HttpStatusCodes.NOT_FOUND, { message: "Car not found" });
    }

    return car;
  }

  async create(data: CarInsertSchema) {
    const [car] = await db
      .insert(cars)
      .values(data)
      .returning();

    return car;
  }

  async delete(carId: number) {
    await db.delete(cars).where(eq(cars.id, carId));
  }

  async patch(carId: number, updatedCar: PatchCarSchema) {
    const [car] = await db.update(cars)
      .set(updatedCar)
      .where(eq(cars.id, carId))
      .returning();

    if (!car) {
      throw new HTTPException(404, { message: "Car not found" });
    }

    return car;
  }
}
