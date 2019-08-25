import { inject, injectable } from "inversify";
import { Router } from "express";

import Controllers from "../../constants/symbols/controllers";
import { IUserController } from "../../interfaces/controllers";
import { AbstractRouter } from "../abstract";

@injectable()
export class UserRouter extends AbstractRouter {
  readonly router = Router();

  constructor(
    @inject(Controllers.PhaseController)
    private _userController: IUserController
  ) {
    super();
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._userController.validate(req.body || {}),
          res,
          next
        );
      } catch (err) {
        next(this.buildErrorCrudResultFromError(err));
      }
    });

    this.router.post("/save", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._userController.save(req.body || {}),
          res,
          next
        );
      } catch (err) {
        next(this.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/:id", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._userController.getById(req.params.id || ""),
          res,
          next
        );
      } catch (err) {
        next(this.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._userController.getAll(
            this.buildQueryOptionsFromRequest(req)
          ),
          res,
          next
        );
      } catch (err) {
        next(this.buildErrorCrudResultFromError(err));
      }
    });
  }
}
