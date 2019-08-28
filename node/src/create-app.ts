import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import path from "path";

import Routers from "./constants/symbols/routers";
import { ControllerModule } from "./controllers";
import { ModelModule } from "./infrastructure/database/models";
import initializeContainer from "./infrastructure/ioc";
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
  app.use("/api", iocContainer.get<HasRouter>(Routers.ApiRouter).router);
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res
      .status(500)
      .type("json")
      .send(err);
  });

  return app;
}
