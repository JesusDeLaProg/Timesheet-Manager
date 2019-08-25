import { inject, injectable } from "inversify";
import { Router } from "express";

import Controllers from "../../constants/symbols/controllers";
import { IClientController } from "../../interfaces/controllers";
import { AbstractRouter } from "../abstract";

@injectable()
export class ClientRouter extends AbstractRouter {
  readonly router = Router();

  constructor(
    @inject(Controllers.ClientController)
    private _clientController: IClientController
  ) {
    super();
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._clientController.validate(req.body || {}),
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
          await this._clientController.save(req.body || {}),
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
          await this._clientController.deleteById(req.params.id || ""),
          res,
          next
        );
      } catch (err) {
        next(this.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/byName/:name?", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._clientController.getAllByName(
            req.params.name || "",
            this.buildQueryOptionsFromRequest(req)
          ),
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
          await this._clientController.getById(req.params.id || ""),
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
          await this._clientController.getAll(
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
