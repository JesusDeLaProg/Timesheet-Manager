import { Router } from "express";
import { inject, injectable } from "inversify";

import Controllers from "../../constants/symbols/controllers";
import { ITimesheetController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
import utils from "../abstract";

@injectable()
export class TimesheetRouter implements HasRouter {
  public readonly router = Router();

  constructor(
    @inject(Controllers.TimesheetController)
    private _timesheetController: ITimesheetController
  ) {
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._timesheetController.validate(req.body || {}),
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
          await this._timesheetController.save(req.body || {}),
          res,
          next
        );
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/byUserId/:id", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._timesheetController.getAllByUserId(
            req.params.id || "",
            utils.buildQueryOptionsFromRequest(req)
          ),
          res,
          next
        );
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/populated/:id", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._timesheetController.getByIdPopulated(req.params.id || ""),
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
          await this._timesheetController.getById(req.params.id || ""),
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
          await this._timesheetController.getAll(
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
