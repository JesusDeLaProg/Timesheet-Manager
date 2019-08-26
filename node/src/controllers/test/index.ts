import { Container } from "inversify";
import "reflect-metadata";

import abstractTestSuite from "../abstract/test";
import activityTestSuite from "../activity/test";
import authTestSuite from "../auth/test";
import clientTestSuite from "../client/test";
import phaseTestSuite from "../phase/test";
import projectTestSuite from "../project/test";
import timesheetTestSuite from "../timesheet/test";
import userTestSuite from "../user/test";

export default function buildTestSuite() {
  describe("Controllers", function() {
    abstractTestSuite();
    activityTestSuite();
    authTestSuite();
    clientTestSuite();
    phaseTestSuite();
    projectTestSuite();
    timesheetTestSuite();
    userTestSuite();
  });
}
