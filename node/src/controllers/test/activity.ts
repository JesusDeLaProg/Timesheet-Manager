import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { ActivityController } from "../activity";
import { ActivityModel, UserModel } from "../../interfaces/models";
import { Types } from "mongoose";
import { IViewActivity } from "../../../../types/viewmodels";
import {
  createActivities,
  defaultUsers,
  setupDatabase,
  createControllerTests,
  compareIds
} from "./abstract";
import { UserRole, AllUserRoles } from "../../constants/enums/user-role";

export default function buildTestSuite() {
  describe(ActivityController.name, function() {
    let User: UserModel;
    let Activity: ActivityModel;
    let controller: ActivityController;

    let activities: IViewActivity[];

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<ActivityController>(ActivityController).toSelf();
      controller = container.get(ActivityController);
      User = container.get(Models.User);
      Activity = container.get(Models.Activity);
    });

    this.beforeEach(async function() {
      activities = createActivities(Array(6).fill({}));
      activities = activities.map((act) => {
        act._id = new Types.ObjectId();
        return act;
      });
      await setupDatabase(
        {
          users: defaultUsers,
          activities
        },
        false
      );
    });

    this.afterEach(async function() {
      await Activity.deleteMany({});
      await User.deleteMany({});
    });

    for (let user of defaultUsers) {
      describe(`Logged in as ${user.username}`, function() {
        const inputValidateCreate = createActivities([{}])[0];
        delete inputValidateCreate._id;
        const inputSaveCreate = createActivities([{}])[0];
        delete inputSaveCreate._id;

        createControllerTests(() => controller, user, {
          getById: () => ({
            id: activities[3]._id,
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, activities[3], {
                  _id: compareIds(activities[3]._id)
                })
              ),
            allowedRoles: AllUserRoles
          }),
          getAll: () => ({
            options: {},
            verify: (res) =>
              should(res.result).match(
                activities.map((a) =>
                  Object.assign({}, a, { _id: compareIds(a._id) })
                )
              ),
            allowedRoles: AllUserRoles
          }),
          count: () => ({
            allowedRoles: AllUserRoles,
            verify: (res) => should(res.result).equal(activities.length)
          }),
          validateCreate: () => ({
            input: inputValidateCreate,
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null()
          }),
          validateUpdate: () => ({
            input: JSON.parse(JSON.stringify(activities[4])),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null()
          }),
          saveCreate: () => ({
            input: inputSaveCreate,
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).match(inputSaveCreate)
          }),
          saveUpdate: () => ({
            input: JSON.parse(JSON.stringify(activities[4])),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, activities[4], {
                  _id: compareIds(activities[4]._id)
                })
              )
          })
        });
      });
    }
  });
}
