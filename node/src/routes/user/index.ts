import { inject, injectable } from "inversify";
import { Router } from "express";

import Controllers from "../../constants/symbols/controllers";
import { IUserController } from "../../interfaces/controllers";
import utils from "../abstract";

@injectable()
export class UserRouter {
  readonly router = Router();

  constructor(
    @inject(Controllers.UserController)
    private _userController: IUserController
  ) {
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._userController.validate(req.body || {}),
          res,
          next
        );
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.post("/save", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._userController.save(req.body || {}),
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
