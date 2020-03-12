import "reflect-metadata";
import controllersTestSuite from "../controllers/test";

import setup from "../infrastructure/environment/setup";

setup();

describe("Timesheet-Manager app", function() {
  controllersTestSuite();
  //routersTestSuite(createExpressApp, "/api");
});
