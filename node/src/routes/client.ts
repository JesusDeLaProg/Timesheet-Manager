import { Router } from "express";
import { inject, injectable } from "inversify";

import Controllers from "../constants/symbols/controllers";
import { IClientController } from "../interfaces/controllers";
import { HasRouter } from "../interfaces/routers";
import utils from "./abstract";

@injectable()
export class ClientRouter implements HasRouter {
  public readonly router = Router();

  constructor(
    @inject(Controllers.ClientController)
    private _clientController: IClientController
  ) {
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._clientController.validate(req.user!._id, req.body || {}),
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
          await this._clientController.save(req.user!._id, req.body || {}),
          res,
          next
        );
      } catch (err) {
        next(utils.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/byName/:name?", async (req, res, next) => {
      try {
        utils.sendResultOrGiveToErrorHandler(
          await this._clientController.getAllByName(
            req.user!._id,
            req.params.name || "",
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
          await this._clientController.getById(req.user!._id, req.params.id || ""),
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
          await this._clientController.getAll(
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
