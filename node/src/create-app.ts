import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import path from "path";

import Routers from "./constants/symbols/routers";
import { ControllerModule } from "./controllers";
import { ModelModule } from "./infrastructure/database/models";
import initializeContainer from "./infrastructure/ioc/init";
import { CrudResult } from "./infrastructure/utils/crud-result";
import { HasHttpCode } from "./infrastructure/utils/has-http-code";
import { HasRouter } from "./interfaces/routers";
import { RouterModule } from "./routes";

export function createExpressApp() {
  const app = express();
  const iocContainer = initializeContainer([
    ModelModule,
    ControllerModule,
    RouterModule
  ]);

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));
  app.options("*", cors({ origin: true, credentials: true }));
  app.use(
    "/api",
    cors({ origin: true, credentials: true }),
    iocContainer.get<HasRouter>(Routers.ApiRouter).router
  );
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CrudResult) {
      res.status((err.result as HasHttpCode).code || 500);

      if (err.result instanceof Error) {
        err = CrudResult.Failure(err.result + "", err.result.message);
      }
      return res.type("json").send(err);
    } else {
      res.status(err.code || 500);
      if (err instanceof Error) {
        err = err + "";
      }
      if (err.info instanceof Error) {
        err.info = err.info + "";
      }
      return res.type("json").send(err);
    }
  });

  return app;
}
