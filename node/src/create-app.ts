import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import fs from "fs";
import httpProxy from "http-proxy";
import logger from "morgan";
import path from "path";

import { SERVER_KEY_OR_SECRET } from "./constants/symbols/parameters";
import Routers from "./constants/symbols/routers";
import { ControllerModule } from "./controllers";
import { ModelModule } from "./infrastructure/database/models";
import initializeContainer from "./infrastructure/ioc/init";
import { CrudResult } from "./infrastructure/utils/crud-result";
import { HasHttpCode } from "./infrastructure/utils/has-http-code";
import { IHasRouter } from "./interfaces/routers";
import { RouterModule } from "./routes";

export function createExpressApp() {
  const app = express();

  const iocContainer = initializeContainer([
    ModelModule,
    ControllerModule,
    RouterModule,
  ]);
  iocContainer
    .bind(SERVER_KEY_OR_SECRET)
    .toConstantValue(
      process.env.JWTSECRET ||
        fs.readFileSync(path.resolve(process.cwd(), "keys/jwt/key"))
    );

  app.use(logger("dev"));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(
    "/api",
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(),
    iocContainer.get<IHasRouter>(Routers.ApiRouter).router
  );

  if (process.env.NODE_ENV?.toLowerCase() === "development") {
    const proxy = httpProxy.createProxyServer({});
    app.use((req, res, next) => {
      try {
        proxy.web(
          req,
          res,
          { target: { host: "localhost", port: "4200" } },
          (err) => process.stderr.write(err.message)
        );
      } catch (err) {
        next(err);
      }
    });
  }

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
