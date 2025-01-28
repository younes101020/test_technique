import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text().notNull(),
  age: integer().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: roleEnum("role").notNull().default("user"),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name"),
  year: integer("year"),
  price: integer("price"),
});

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  country: text("country"),
  brandId: integer("brand_id").references(() => brands.id, { onDelete: "cascade" }),
});

export const usersRelations = relations(brands, ({ many }) => ({
  cars: many(cars),
}));

export const carsRelations = relations(cars, ({ one }) => ({
  brand: one(brands, {
    fields: [cars.brandId],
    references: [brands.id],
  }),
}));
