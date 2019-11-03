import { Response, Router } from "express";
import { inject, injectable } from "inversify";
import moment from "moment";
import ms from "ms";
import passport from "passport";

import Controllers from "../../constants/symbols/controllers";
import setupJwtStrategy from "../../infrastructure/auth/jwt";
import { HasHttpCode } from "../../infrastructure/utils/has-http-code";
import { IAuthController, IUserController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
import utils from "../abstract";

const tokenCookieName = "SESSIONID";

@injectable()
export class AuthRouter implements HasRouter {
  public readonly router = Router();
  public readonly authenticationMiddlewares = Router();

  constructor(
    @inject(Controllers.AuthController)
    private _authController: IAuthController,
    @inject(Controllers.UserController)
    private _userController: IUserController
  ) {
    this._init();
  }

  private _init() {
    setupJwtStrategy(async (jwtPayload, done) => {
      try {
        const result = await this._userController.getById(jwtPayload.user);
        if (result.result) {
          if (!result.result.isActive) {
            const error = new Error(
              "Ce compte est désactivé. Veuillez vous connecter avec un compte actif."
            );
            (error as HasHttpCode).code = 403;
            return done(error, false);
          }

          return done(null, {
            _id: result.result._id,
            role: result.result.role
          });
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    });

    this.router.post("/login", async (req, res, next) => {
      const username = (req.body || {}).username || "";
      const password = (req.body || {}).password || "";

      try {
        const result = await this._authController.login(username, password);
        if (!result.success || !result.result) {
          return next(result);
        }

        this._setAuthCookieAndHeader(result.result, res);
        result.result = null;
        res
          .type("json")
          .status(200)
          .send(result);
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get(
      "/whoami",
      this.authenticationMiddlewares,
      async (req, res, next) => {
        try {
          utils.sendResultOrGiveToErrorHandler(
            await this._userController.getById(req.user!._id.toHexString()),
            res,
            next
          );
        } catch (err) {
          next(utils.buildErrorCrudResultFromError(err));
        }
      }
    );

    this.router.get("/logout", async (req, res, next) => {
      res.clearCookie(tokenCookieName, { httpOnly: true });
      res
        .type("json")
        .status(200)
        .send({ success: true, message: "", result: null });
    });

    this.authenticationMiddlewares.use((req, res, next) => {
      passport.authenticate("jwt", { session: false }, (error, user, info) => {
        if (error) {
          error.code = 401;
          next(error);
        }

        if (!user) {
          const err = { code: 401, info };
          next(err);
        }
        req.user = user;
        next();
      })(req, res);
    });

    this.authenticationMiddlewares.use((req, res, next) => {
      if (!req.user) {
        return next();
      }
      const jwtoken = this._authController.createJWT({
        user: req.user._id.toHexString()
      });
      this._setAuthCookieAndHeader(jwtoken, res);
      return next();
    });
  }

  private _setAuthCookieAndHeader(jwt: string, res: Response) {
    const sessionTimeout = ms(process.env.SESSIONTIMEOUT || "0");
    res.cookie(tokenCookieName, jwt, {
      httpOnly: true,
      sameSite: false,
      maxAge: sessionTimeout
    });
    res.header(
      "X-Token-Expiration",
      moment(new Date())
        .add(sessionTimeout, "ms")
        .toISOString()
    );
  }
}
