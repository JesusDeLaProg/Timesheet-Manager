import { Router } from "express";
import { inject, injectable } from "inversify";
import ms from "ms";

import Controllers from "../../constants/symbols/controllers";
import { IAuthController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
import utils from "../abstract";
import { CrudResult } from "../../../../types/viewmodels";

const tokenCookieName = "SESSIONID";

@injectable()
export class AuthRouter implements HasRouter {
  readonly router = Router();

  constructor(
    @inject(Controllers.AuthController)
    private _authController: IAuthController
  ) {
    this._init();
  }

  private _init() {
    this.router.post("/login", async (req, res, next) => {
      const username = (req.body || {}).username || "";
      const password = (req.body || {}).password || "";

      try {
        const result = await this._authController.login(username, password);
        if (!result.success) {
          return next(result);
        }

        const sessionTimeout = ms(process.env.SESSIONTIMEOUT || "");
        res.cookie(tokenCookieName, result.result, {
          httpOnly: true,
          maxAge: sessionTimeout
        });
        res.header("X-Token-Expiration", sessionTimeout.toString());
        delete result.result;
        res
          .type("json")
          .status(200)
          .send(result);
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/logout", async (req, res, next) => {
      res.clearCookie(tokenCookieName, { httpOnly: true });
      res
        .type("json")
        .status(200)
        .send(<CrudResult>{ success: true, message: "" });
    });
  }
}
