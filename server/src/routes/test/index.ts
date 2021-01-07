import { Express } from "express";

import { Container } from "inversify";
import { UserRole } from "../../constants/enums/user-role";
import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/models";
import { UserModel } from "../../interfaces/models";
import activityTestSuite from "./activity";
import authTestSuite from "./auth";
import clientTestSuite from "./client";
import phaseTestSuite from "./phase";
import projectTestSuite from "./project";
import timesheetTestSuite from "./timesheet";
import userTestSuite from "./user";

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  describe("Api routers", function RoutersTest() {
    let User: UserModel;

    this.beforeAll(async () => {
      const container = new Container();
      container.load(ModelModule);
      User = container.get(Models.User);
      const user = new User({
        isActive: true,
        role: UserRole.Superadmin,
        username: "admin",
      });
      await user.setPassword("admin");
      await user.save({ validateBeforeSave: false });
    });

    this.afterAll(async () => {
      await User.deleteMany({});
    });

    authTestSuite(appFactory, baseUrl + "/auth");
    activityTestSuite(appFactory, baseUrl + "/activity");
    clientTestSuite(appFactory, baseUrl + "/client");
    phaseTestSuite(appFactory, baseUrl + "/phase");
    projectTestSuite(appFactory, baseUrl + "/project");
    timesheetTestSuite(appFactory, baseUrl + "/timesheet");
    userTestSuite(appFactory, baseUrl + "/user");
  });
}
