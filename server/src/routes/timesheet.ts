import { Router } from "express";
import { inject, injectable } from "inversify";

import { UserRole } from "../constants/enums/user-role";
import Controllers from "../constants/symbols/controllers";
import { ITimesheetController } from "../interfaces/controllers";
import { IHasRouter } from "../interfaces/routers";
import utils from "./abstract";

@injectable()
export class TimesheetRouter implements IHasRouter {
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
          await this._timesheetController.validate(
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
          await this._timesheetController.save(req.user!._id, req.body || {}),
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
            req.user!._id,
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
          await this._timesheetController.getByIdPopulated(
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

    this.router.get("/countByUserId/:userId", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._timesheetController.countByUserId(
            req.user!._id,
            req.params.userId || ""
          ),
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
          await this._timesheetController.getById(
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
          req.user && req.user.role && req.user.role === UserRole.Everyone
            ? await this._timesheetController.getAllByUserId(
                req.user._id.toHexString(),
                req.user._id,
                utils.buildQueryOptionsFromRequest(req)
              )
            : await this._timesheetController.getAll(
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
