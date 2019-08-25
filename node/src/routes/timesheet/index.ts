import { inject, injectable } from "inversify";
import { Router } from "express";

import Controllers from "../../constants/symbols/controllers";
import { ITimesheetController } from "../../interfaces/controllers";
import { AbstractRouter } from "../abstract";

@injectable()
export class TimesheetRouter extends AbstractRouter {
  readonly router = Router();

  constructor(
    @inject(Controllers.PhaseController)
    private _timesheetController: ITimesheetController
  ) {
    super();
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._timesheetController.validate(req.body || {}),
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
          await this._timesheetController.save(req.body || {}),
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
          await this._timesheetController.deleteById(req.params.id || ""),
          res,
          next
        );
      } catch (err) {
        next(this.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/byUserId/:id", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._timesheetController.getAllByUserId(
            req.params.id || "",
            this.buildQueryOptionsFromRequest(req)
          ),
          res,
          next
        );
      } catch (err) {
        next(this.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/populated/:id", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._timesheetController.getByIdPopulated(req.params.id || ""),
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
          await this._timesheetController.getById(req.params.id || ""),
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
          await this._timesheetController.getAll(
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
