import { inject, injectable } from "inversify";
import { Router } from "express";

import Controllers from "../../constants/symbols/controllers";
import { IActivityController } from "../../interfaces/controllers";
import { AbstractRouter } from "../abstract";

@injectable()
export class ActivityRouter extends AbstractRouter {
  readonly router = Router();

  constructor(
    @inject(Controllers.ActivityController)
    private _activityController: IActivityController
  ) {
    super();
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._activityController.validate(req.body || {}),
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
          await this._activityController.save(req.body || {}),
          res,
          next
        );
      } catch (err) {
        next(this.buildErrorCrudResultFromError(err));
      }
    });

    this.router.delete("/:id", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._activityController.deleteById(req.params.id || ""),
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
          await this._activityController.getById(req.params.id || ""),
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
          await this._activityController.getAll(
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
