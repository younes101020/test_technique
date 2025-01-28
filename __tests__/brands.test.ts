import { OpenAPIHono } from "@hono/zod-openapi";
import { testClient } from "hono/testing";
import { defaultHook } from "stoker/openapi";
import { describe, expect, expectTypeOf } from "vitest";

import type { AppBindings } from "@/lib/types";

import handleLogger from "@/middlewares/logger";
import handleNotFound from "@/middlewares/not-found";
import handleError from "@/middlewares/on-error";
import router from "@/routes/brand";

import { it } from "./fixtures";

const app = new OpenAPIHono<AppBindings>({
  strict: false,
  defaultHook,
});

app.use(handleLogger());
app.notFound(handleNotFound);
app.onError(handleError);

export const client = testClient(app.route("/", router));

describe("brands CRUD", () => {
  describe("post requests", () => {
    it("/brands creates a brand", async ({ brand }) => {
      const response = await client.brands.$post({
        json: brand,
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.name).toBe(brand.name);
        expect(json.price).toBe(brand.price);
      }
    });
  });

  describe("patch requests", () => {
    it("updates a brand", async ({ brand, brandIdRelatedToZeroCars }) => {
      const { name } = brand;
      const updatedName = `${name}:updated`;
      const response = await client.brands[":id"].$patch({
        param: { id: brandIdRelatedToZeroCars },
        json: { name: updatedName },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.name).toBe(updatedName);
      }
    });
  });

  describe("get requests", () => {
    it("default to list of 10 brands records when omitting pagination query", async () => {
      const response = await client.brands.$get({
        query: {},
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toBeArray();
        expect(json.length).toBe(10);
      }
    });

    it("list 5 brands when pagination query limit is set to 5", async () => {
      const response = await client.brands.$get({
        query: {
          limit: 5,
        },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toBeArray();
        expect(json.length).toBe(5);
      }
    });

    it("get brand by id", async ({ brandIdRelatedToZeroCars }) => {
      const response = await client.brands[":id"].$get({
        param: { id: brandIdRelatedToZeroCars },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.name).toBeDefined();
      }
    });

    it("list cars related to the given brand", async ({ brandIdRelatedToOneOrManyCars }) => {
      const response = await client.brands[":id"].cars.$get({
        param: {
          id: brandIdRelatedToOneOrManyCars,
        },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toBeArray();
        expect(json[0].country).toBeDefined();
      }
    });
  });

  describe("delete requests", () => {
    it("removes a brand", async ({ brandIdRelatedToOneOrManyCars }) => {
      const response = await client.brands[":id"].$delete({
        param: {
          id: brandIdRelatedToOneOrManyCars,
        },
      });
      expect(response.status).toBe(204);
    });
  });
});
