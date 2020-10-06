import { Router } from "express";
import { inject, injectable } from "inversify";

import Controllers from "../constants/symbols/controllers";
import { IActivityController } from "../interfaces/controllers";
import { IHasRouter } from "../interfaces/routers";
import utils from "./abstract";

@injectable()
export class ActivityRouter implements IHasRouter {
  public readonly router = Router();

  constructor(
    @inject(Controllers.ActivityController)
    private _activityController: IActivityController
  ) {
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._activityController.validate(
            req.user!._id,
            req.body || {}
          ),
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
          await this._activityController.save(req.user!._id, req.body || {}),
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
          await this._activityController.getById(
            req.user!._id,
            req.params.id || ""
          ),
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
          await this._activityController.getAll(
            req.user!._id,
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
