import "reflect-metadata";
import controllersTestSuite from "../controllers/test";
import { createExpressApp } from "../create-app";
import routersTestSuite from "../routes/test";

import setup from "../infrastructure/environment/setup";

setup();

describe("Timesheet-Manager app", function() {
  controllersTestSuite();
  routersTestSuite(createExpressApp, "/api");
});
