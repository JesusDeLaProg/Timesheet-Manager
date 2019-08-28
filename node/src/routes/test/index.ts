import { Express } from "express";

import activityTestSuite from "../activity/test";
import authTestSuite from "../auth/test";
import clientTestSuite from "../client/test";
import phaseTestSuite from "../phase/test";
import projectTestSuite from "../project/test";
import timesheetTestSuite from "../timesheet/test";
import userTestSuite from "../user/test";

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  describe("Api routers", function() {
    activityTestSuite(appFactory, baseUrl + "/activity");
    authTestSuite(appFactory, baseUrl + "/auth");
    clientTestSuite(appFactory, baseUrl + "/client");
    phaseTestSuite(appFactory, baseUrl + "/phase");
    projectTestSuite(appFactory, baseUrl + "/project");
    timesheetTestSuite(appFactory, baseUrl + "/timesheet");
    userTestSuite(appFactory, baseUrl + "/user");
  });
}
