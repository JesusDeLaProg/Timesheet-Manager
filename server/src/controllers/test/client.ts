import { Container } from "inversify";
import { Types } from "mongoose";
import "reflect-metadata";
import should from "should";

import { IViewClient } from "../../../../types/viewmodels";
import { AllUserRoles, UserRole } from "../../constants/enums/user-role";
import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { ClientModel, UserModel } from "../../interfaces/models";
import { ClientController } from "../client";
import {
  compareIds,
  createClients,
  createControllerTests,
  defaultUsers,
  setupDatabase,
} from "./abstract";

export default function buildTestSuite() {
  describe(ClientController.name, function ClientControllerTest() {
    let User: UserModel;
    let Client: ClientModel;
    let controller: ClientController;

    let clients: IViewClient[];

    this.beforeAll(() => {
      const container = new Container();
      container.load(ModelModule);
      container.bind<ClientController>(ClientController).toSelf();
      controller = container.get(ClientController);
      User = container.get(Models.User);
      Client = container.get(Models.Client);
    });

    this.beforeEach(async () => {
      clients = createClients(Array(6).fill({}));
      clients = clients.map((act) => {
        act._id = new Types.ObjectId();
        return act;
      });
      await setupDatabase(
        {
          users: defaultUsers,
          clients,
        },
        false
      );
    });

    this.afterEach(async () => {
      await Client.deleteMany({});
      await User.deleteMany({});
    });

    for (const user of defaultUsers) {
      describe(`Logged in as ${user.username}`, () => {
        const inputValidateCreate = createClients([{}])[0];
        delete inputValidateCreate._id;
        const inputSaveCreate = createClients([{}])[0];
        delete inputSaveCreate._id;

        createControllerTests(() => controller, user, {
          getById: () => ({
            id: clients[1]._id,
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, clients[1], {
                  _id: compareIds(clients[1]._id),
                })
              ),
            allowedRoles: AllUserRoles,
          }),
          getAll: () => ({
            options: {},
            verify: (res) =>
              should(res.result).match(
                clients.map((c) =>
                  Object.assign({}, c, { _id: compareIds(c._id) })
                )
              ),
            allowedRoles: AllUserRoles,
          }),
          count: () => ({
            allowedRoles: AllUserRoles,
            verify: (res) => should(res.result).equal(clients.length),
          }),
          validateCreate: () => ({
            input: inputValidateCreate,
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin,
            ],
            verify: (res) => should(res.result).be.null(),
          }),
          validateUpdate: () => ({
            input: JSON.parse(JSON.stringify(clients[2])),
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin,
            ],
            verify: (res) => should(res.result).be.null(),
          }),
          saveCreate: () => ({
            input: inputSaveCreate,
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin,
            ],
            verify: (res) => should(res.result).match(inputSaveCreate),
          }),
          saveUpdate: () => ({
            input: JSON.parse(JSON.stringify(clients[2])),
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin,
            ],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, clients[2], {
                  _id: compareIds(clients[2]._id),
                })
              ),
          }),
        });

        /* Special read methods */
        it("getAllByName", async () => {
          await Client.deleteMany({});
          const tempClients = createClients(
            Array(20)
              .fill({})
              .map((v, i) => ({ name: "client" + i }))
          );
          for (const client of tempClients) {
            await new Client(client).save();
          }
          const result = await controller.getAllByName(user._id, "client1");
          should(result.success).true();
          should(result.result).have.lengthOf(11);
        });
      });
    }
  });
}
