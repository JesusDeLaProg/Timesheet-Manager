import { Router } from "express";
import { inject, injectable } from "inversify";

import { UserRole } from "../constants/enums/user-role";
import Controllers from "../constants/symbols/controllers";
import { ITimesheetController } from "../interfaces/controllers";
import { HasRouter } from "../interfaces/routers";
import utils from "./abstract";

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
        const userId = (req.user && req.user._id) || undefined;
        utils.sendResultOrGiveToErrorHandler(
          await this._timesheetController.validate(req.body || {}, userId),
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
          await this._timesheetController.save(req.body || {}, userId),
          res,
          next
        );
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/byUserId/:id", async (req, res, next) => {
      try {
        const userId = (req.user && req.user._id) || undefined;
        utils.sendResultOrGiveToErrorHandler(
          await this._timesheetController.getAllByUserId(
            req.params.id || "",
            userId,
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
        const userId = (req.user && req.user._id) || undefined;
        utils.sendResultOrGiveToErrorHandler(
          await this._timesheetController.getByIdPopulated(
            req.params.id || "",
            userId
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
        const userId = (req.user && req.user._id) || undefined;
        utils.sendResultOrGiveToErrorHandler(
          await this._timesheetController.countByUserId(
            req.params.userId || "",
            userId
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
        const userId = (req.user && req.user._id) || undefined;
        utils.sendResultOrGiveToErrorHandler(
          await this._timesheetController.getById(req.params.id || "", userId),
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
