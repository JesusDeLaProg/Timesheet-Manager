import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import { IViewUser } from "../../../../types/viewmodels";
import { UserRole } from "../../constants/enums/user-role";
import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { UserModel } from "../../interfaces/models";
import { UserController } from "../user";
import {
  compareIds,
  createControllerTests,
  createUsers,
  defaultUsers,
  setupDatabase,
} from "./abstract";

export default function buildTestSuite() {
  describe(UserController.name, function UserControllerTest() {
    let User: UserModel;
    let controller: UserController;

    let otherUser: IViewUser;

    this.beforeAll(() => {
      const container = new Container();
      container.load(ModelModule);
      container.bind<UserController>(UserController).toSelf();
      controller = container.get(UserController);
      User = container.get(Models.User);
    });

    this.beforeEach(async () => {
      otherUser = createUsers([{ role: UserRole.Subadmin }])[0];
      await setupDatabase(
        {
          users: [...defaultUsers, otherUser],
        },
        false
      );
    });

    this.afterEach(async () => {
      await User.deleteMany({});
    });

    for (const user of defaultUsers) {
      describe(`Logged in as ${user.username}`, () => {
        const inputValidateCreate = createUsers([
          { role: UserRole.Subadmin },
        ])[0];
        delete inputValidateCreate._id;
        const inputSaveCreate = createUsers([{ role: UserRole.Subadmin }])[0];
        delete inputSaveCreate._id;

        createControllerTests(() => controller, user, {
          getById: () => ({
            id: otherUser._id,
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin,
            ],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, otherUser, { _id: compareIds(otherUser._id) })
              ),
          }),
          getAll: () => ({
            options: {},
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin,
            ],
            verify: (res) =>
              should(res.result).lengthOf(defaultUsers.length + 1),
          }),
          count: () => ({
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin,
            ],
            verify: (res) => should(res.result).equal(defaultUsers.length + 1),
          }),
          validateCreate: () => ({
            input: Object.assign({}, inputValidateCreate, {
              password: otherUser.password,
            }),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null(),
          }),
          validateUpdate: () => ({
            input: Object.assign({}, otherUser, { role: UserRole.Everyone }),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null(),
          }),
          saveCreate: () => ({
            input: Object.assign({}, inputSaveCreate, {
              password: otherUser.password,
            }),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).match(inputSaveCreate),
          }),
          saveUpdate: () => ({
            input: Object.assign({}, otherUser, {
              role: UserRole.Everyone,
              password: undefined,
            }),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => {
              const expected = Object.assign({}, otherUser, {
                _id: compareIds(otherUser._id),
                role: UserRole.Everyone,
              });
              delete expected.password;
              should(res.result).match(expected);
            },
          }),
        });
      });
    }
  });
}
