import "reflect-metadata";
import controllersTestSuite from "../controllers/test";
import { createExpressApp } from "../create-app";
import routersTestSuite from "../routes/test";

describe("Timesheet-Manager app", function() {
  controllersTestSuite();
  routersTestSuite(createExpressApp, "/api");
});
