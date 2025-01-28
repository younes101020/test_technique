import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";
import type { LoginRoute, LogoutRoute, RegisterRoute } from "@/routes/auth/route-definition";
import type { AuthService } from "@/services/auth";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login: AppRouteHandler<LoginRoute> = async (c) => {
    const { email, password } = c.req.valid("json");
    const user = await this.authService.login(email, password, c);

    return c.json(user, HttpStatusCodes.OK);
  };

  register: AppRouteHandler<RegisterRoute> = async (c) => {
    const { password, name, age, email } = c.req.valid("json");
    const user = await this.authService.register(name, email, password, age, c);

    return c.json(user, HttpStatusCodes.OK);
  };

  logout: AppRouteHandler<LogoutRoute> = async (c) => {
    this.authService.logout(c);

    return c.json({
      message: "Session has been deleted",
    }, HttpStatusCodes.OK);
  };
}
