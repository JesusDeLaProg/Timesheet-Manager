import { createExpressApp } from "../create-app";
import controllersTestSuite from "../controllers/test";
import routersTestSuite from "../routes/test";

describe("Timesheet-Manager app", function() {
  controllersTestSuite();
  routersTestSuite(createExpressApp, "/api");
});
