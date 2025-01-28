import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";
import type { CreateRoute, DeleteRoute, GetOneRoute, ListRoute, PatchRoute } from "@/routes/car/route-definition";
import type { CarService } from "@/services/car";

import { carSelectSchema } from "@/dtos";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

export class CarController {
  constructor(private readonly carService: CarService) {}

  list: AppRouteHandler<ListRoute> = async (c) => {
    const { page, limit } = c.req.valid("query");
    const cars = await this.carService.list(page, limit);

    return c.json(
      cars.map(car => carSelectSchema.parse(car)),
      HttpStatusCodes.OK,
    );
  };

  getOne: AppRouteHandler<GetOneRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const car = await this.carService.getOne(id);

    return c.json(
      carSelectSchema.parse(car),
      HttpStatusCodes.OK,
    );
  };

  create: AppRouteHandler<CreateRoute> = async (c) => {
    const data = c.req.valid("json");
    const car = await this.carService.create(data);

    return c.json(
      carSelectSchema.parse(car),
      HttpStatusCodes.OK,
    );
  };

  delete: AppRouteHandler<DeleteRoute> = async (c) => {
    const car = c.req.valid("param");
    await this.carService.delete(car.id);
    return c.body(null, HttpStatusCodes.NO_CONTENT);
  };

  patch: AppRouteHandler<PatchRoute> = async (c) => {
    const referenceToCar = c.req.valid("param");
    const updatedCar = c.req.valid("json");

    if (Object.keys(updatedCar).length === 0) {
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

    const car = await this.carService.patch(referenceToCar.id, updatedCar);
    return c.json(carSelectSchema.parse(car), HttpStatusCodes.OK);
  };
}
