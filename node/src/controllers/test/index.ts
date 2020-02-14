import "reflect-metadata";

import { clearDatabase } from "./abstract";
import activityTestSuite from "./activity";
import authTestSuite from "./auth";
import clientTestSuite from "./client";
import phaseTestSuite from "./phase";
import projectTestSuite from "./project";
import timesheetTestSuite from "./timesheet";
import userTestSuite from "./user";

export default function buildTestSuite() {
  describe("Controllers", function() {
    this.afterAll(async function() {
      await clearDatabase();
    });

    activityTestSuite();
    authTestSuite();
    clientTestSuite();
    phaseTestSuite();
    projectTestSuite();
    timesheetTestSuite();
    userTestSuite();
  });
}
