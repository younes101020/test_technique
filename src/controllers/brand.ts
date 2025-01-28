import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";
import type { CarsListRoute, CreateRoute, DeleteRoute, GetOneRoute, ListRoute, PatchRoute } from "@/routes/brand/route-definition";
import type { BrandService } from "@/services/brand";

import { brandSelectSchema, carSelectSchema } from "@/dtos";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  list: AppRouteHandler<ListRoute> = async (c) => {
    const { page, limit } = c.req.valid("query");
    const brands = await this.brandService.list(page, limit);

    return c.json(
      brands.map(brand => brandSelectSchema.parse(brand)),
      HttpStatusCodes.OK,
    );
  };

  getOne: AppRouteHandler<GetOneRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const brand = await this.brandService.getOne(id);

    return c.json(
      brandSelectSchema.parse(brand),
      HttpStatusCodes.OK,
    );
  }

  listCars: AppRouteHandler<CarsListRoute> = async (c) => {
    const brand = c.req.valid("param");
    const carsRelatedToBrand = await this.brandService.listCars(brand.id);

    return c.json(
      carsRelatedToBrand.map(car => carSelectSchema.parse(car)),
      HttpStatusCodes.OK,
    );
  };

  create: AppRouteHandler<CreateRoute> = async (c) => {
    const data = c.req.valid("json");
    const brand = await this.brandService.create(data);

    return c.json(
      brandSelectSchema.parse(brand),
      HttpStatusCodes.OK,
    );
  };

  delete: AppRouteHandler<DeleteRoute> = async (c) => {
    const brand = c.req.valid("param");
    await this.brandService.delete(brand.id);
    return c.body(null, HttpStatusCodes.NO_CONTENT);
  };

  patch: AppRouteHandler<PatchRoute> = async (c) => {
    const referenceToBrand = c.req.valid("param");
    const updatedBrand = c.req.valid("json");

    if (Object.keys(updatedBrand).length === 0) {
      return c.json(
        {
          success: false,
          error: {
            issues: [
              {
                code: ZOD_ERROR_CODES.INVALID_UPDATES,
                path: [],
                message: ZOD_ERROR_MESSAGES.NO_UPDATES,
              },
            ],
            name: "ZodError",
          },
        },
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
      );
    }

    const brand = await this.brandService.patch(referenceToBrand.id, updatedBrand);
    return c.json(brandSelectSchema.parse(brand), HttpStatusCodes.OK);
  };
}
