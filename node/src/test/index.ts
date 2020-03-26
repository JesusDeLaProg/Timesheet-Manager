import "reflect-metadata";
import controllersTestSuite from "../controllers/test";
import routersTestSuite from "../routes/test";
import { createExpressApp } from "../create-app";

import setup from "../infrastructure/environment/setup";

setup();

describe("Timesheet-Manager app", function() {
  controllersTestSuite();
  routersTestSuite(createExpressApp, "/api");
});
