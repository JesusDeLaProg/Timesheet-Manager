import { inject, injectable } from "inversify";
import { Router } from "express";

import Controllers from "../../constants/symbols/controllers";
import { IProjectController } from "../../interfaces/controllers";
import { AbstractRouter } from "../abstract";

@injectable()
export class ProjectRouter extends AbstractRouter {
  readonly router = Router();

  constructor(
    @inject(Controllers.PhaseController)
    private _projectController: IProjectController
  ) {
    super();
    this._init();
  }

  private _init() {
    this.router.post("/validate", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._projectController.validate(req.body || {}),
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
          await this._projectController.save(req.body || {}),
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
          await this._projectController.deleteById(req.params.id || ""),
          res,
          next
        );
      } catch (err) {
        next(this.buildErrorCrudResultFromError(err));
      }
    });

    this.router.get("/byCode/:code?", async (req, res, next) => {
      try {
        this.sendResultOrGiveToErrorHandler(
          await this._projectController.getAllByCode(
            req.params.code || "",
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
          await this._projectController.getById(req.params.id || ""),
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
          await this._projectController.getAll(
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
