import { Router } from "express";
import { inject, injectable } from "inversify";

import Controllers from "../constants/symbols/controllers";
import { IPhaseController } from "../interfaces/controllers";
import { HasRouter } from "../interfaces/routers";
import utils from "./abstract";

@injectable()
export class PhaseRouter implements HasRouter {
  public readonly router = Router();

  constructor(
    @inject(Controllers.PhaseController)
    private _phaseController: IPhaseController
  ) {
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._phaseController.validate(req.user!._id, req.body || {}),
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
          await this._phaseController.save(req.user!._id, req.body || {}),
          res,
          next
        );
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/populated", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._phaseController.getAllPopulated(
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

    this.router.get("/:id", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._phaseController.getById(req.user!._id, req.params.id || ""),
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
          await this._phaseController.getAll(
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
