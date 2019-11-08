import { Router } from "express";
import { inject, injectable } from "inversify";

import Controllers from "../constants/symbols/controllers";
import { IUserController } from "../interfaces/controllers";
import { HasRouter } from "../interfaces/routers";
import utils from "./abstract";

@injectable()
export class UserRouter implements HasRouter {
  public readonly router = Router();

  constructor(
    @inject(Controllers.UserController)
    private _userController: IUserController
  ) {
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        const userId = (req.user && req.user._id) || undefined;
        utils.sendResultOrGiveToErrorHandler(
          await this._userController.validate(req.body || {}, userId),
          res,
          next
        );
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.post("/save", async (req, res, next) => {
      try {
        const userId = (req.user && req.user._id) || undefined;
        utils.sendResultOrGiveToErrorHandler(
          await this._userController.save(req.body || {}, userId),
          res,
          next
        );
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/:id", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._userController.getById(req.params.id || ""),
          res,
          next
        );
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._userController.getAll(
            utils.buildQueryOptionsFromRequest(req)
          ),
          res,
          next
        );
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });
  }
}