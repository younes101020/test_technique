import { OpenAPIHono } from "@hono/zod-openapi";
import { testClient } from "hono/testing";
import { defaultHook } from "stoker/openapi";
import { describe, expect, expectTypeOf } from "vitest";

import type { AppBindings } from "@/lib/types";

import handleLogger from "@/middlewares/logger";
import handleNotFound from "@/middlewares/not-found";
import handleError from "@/middlewares/on-error";
import router from "@/routes/car";

import { it } from "./fixtures";

const app = new OpenAPIHono<AppBindings>({
  strict: false,
  defaultHook,
});

app.use(handleLogger());
app.notFound(handleNotFound);
app.onError(handleError);

const client = testClient(app.route("/", router));

describe("cars CRUD", () => {
  describe("post requests", () => {
    it("/cars creates a car", async ({ car }) => {
      const response = await client.cars.$post({
        json: car,
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.country).toBe(car.country);
      }
    });
  });

  describe("patch requests", () => {
    it("updates a car", async ({ car, carId }) => {
      const { country } = car;
      const updatedCountry = `${country}:updated`;
      const response = await client.cars[":id"].$patch({
        param: { id: carId },
        json: { country: updatedCountry },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.country).toBe(updatedCountry);
      }
    });
  });

  describe("get requests", () => {
    it("default to list of 10 cars records when omitting pagination query", async () => {
      const response = await client.cars.$get({
        query: {},
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toBeArray();
        expect(json.length).toBe(10);
      }
    });

    it("list 14 cars when pagination query limit is set to 14", async () => {
      const response = await client.cars.$get({
        query: {
          limit: 14,
        },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toBeArray();
        expect(json.length).toBe(14);
      }
    });

    it("get car by id", async ({ carId }) => {
      const response = await client.cars[":id"].$get({
        param: { id: carId },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.country).toBeDefined();
      }
    });
  });

  describe("delete requests", () => {
    it("removes a car", async ({ carId }) => {
      const response = await client.cars[":id"].$delete({
        param: {
          id: carId,
        },
      });
      expect(response.status).toBe(204);
    });
  });
});
