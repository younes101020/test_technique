import { faker } from "@faker-js/faker";
import { eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { assert, it as base } from "vitest";

import type { BrandInsertSchema, CarInsertSchema } from "@/dtos/";

import env from "@/config/env";
import { brands, cars } from "@/lib/db/schema";

interface Fixtures {
  brand: BrandInsertSchema;
  car: CarInsertSchema;
  brandIdRelatedToOneOrManyCars: number;
  brandIdRelatedToZeroCars: number;
  carId: number;
}

const brand = {
  name: faker.vehicle.model(),
  year: faker.date.past().getFullYear(),
  price: Math.round(Number.parseFloat(faker.commerce.price({
    min: 500,
  }))),
};

const car = {
  country: faker.location.country(),
  brandId: await getBrandIdRelatedToZeroCars(),
};

const recordedIds = {
  brandIdRelatedToOneOrManyCars: await getBrandIdRelatedToOneOrManyCars(),
  brandIdRelatedToZeroCars: await getBrandIdRelatedToZeroCars(),
  carId: await getCarId(),
};

export const it = base.extend<Fixtures>({
  brand: async ({}, use) => { // eslint-disable-line no-empty-pattern
    await use(brand);
  },
  car: async ({}, use) => { // eslint-disable-line no-empty-pattern
    assert(typeof car.brandId === "number", "no recorded brand found");
    await use({
      ...car,
      // Force type as number since we've asserted it
      brandId: car.brandId as number,
    });
  },
  brandIdRelatedToOneOrManyCars: async ({}, use) => { // eslint-disable-line no-empty-pattern
    assert(typeof recordedIds.brandIdRelatedToOneOrManyCars === "number", "no related relation record between brands and cars found");
    await use(recordedIds.brandIdRelatedToOneOrManyCars);
  },
  brandIdRelatedToZeroCars: async ({}, use) => { // eslint-disable-line no-empty-pattern
    assert(typeof recordedIds.brandIdRelatedToZeroCars === "number", "no unrelated relation record between brands and cars found");
    await use(recordedIds.brandIdRelatedToZeroCars);
  },
  carId: async ({}, use) => { // eslint-disable-line no-empty-pattern
    assert(typeof recordedIds.carId === "number", "no car record found");
    await use(recordedIds.carId);
  },
});



async function getBrandIdRelatedToOneOrManyCars() {
  const db = drizzle(env.DATABASE_URL);
  const result = await db
    .select({
      brandId: cars.brandId,
    })
    .from(cars)
    .limit(1);

  if (!result.length) {
    return null;
  }

  return result[0].brandId;
}

async function getBrandIdRelatedToZeroCars() {
  const db = drizzle(env.DATABASE_URL);
  const [result] = await db
    .select({ brandId: brands.id })
    .from(brands)
    .leftJoin(cars, eq(brands.id, cars.brandId))
    .where(isNull(cars.brandId))
    .limit(1);

  if (!result) {
    return null;
  }

  return result.brandId;
}

async function getCarId() {
  const db = drizzle(env.DATABASE_URL);
  const [result] = await db.select({ id: cars.id }).from(cars).limit(1);
  return result.id;
}
