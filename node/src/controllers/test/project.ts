import { Container } from "inversify";
import "reflect-metadata";

import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { ProjectController } from "../project";
import { ProjectModel, ClientModel } from "../../interfaces/models";
import { IViewProject, IViewClient } from "../../../../types/viewmodels";
import {
  createClients,
  createProjects,
  setupDatabase,
  defaultUsers,
  createControllerTests,
  compareIds
} from "./abstract";
import { AllUserRoles, UserRole } from "../../constants/enums/user-role";
import should from "should";

export default function buildTestSuite() {
  describe(ProjectController.name, function() {
    let Client: ClientModel;
    let Project: ProjectModel;
    let controller: ProjectController;

    let clients: IViewClient[];
    let projects: IViewProject[];

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<ProjectController>(ProjectController).toSelf();
      controller = container.get(ProjectController);
      Client = container.get(Models.Client);
      Project = container.get(Models.Project);
    });

    this.beforeEach(async function() {
      clients = createClients(Array(3).fill({}));
      projects = createProjects(Array(6).fill({})).map((proj, i) => {
        proj.client = clients[Math.floor(i / 2)]._id;
        return proj;
      });
      await setupDatabase(
        {
          users: defaultUsers,
          clients,
          projects
        },
        false
      );
    });

    this.afterEach(async function() {
      await Project.deleteMany({});
      await Client.deleteMany({});
    });

    for (const user of defaultUsers) {
      describe(`Logged in as ${user.username}`, function() {
        const inputValidateCreate = createProjects([{}])[0];
        delete inputValidateCreate._id;
        const inputSaveCreate = createProjects([{}])[0];
        delete inputSaveCreate._id;

        createControllerTests(() => controller, user, {
          getById: () => ({
            id: projects[4]._id,
            allowedRoles: AllUserRoles,
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, projects[4], {
                  _id: compareIds(projects[4]._id),
                  client: compareIds(projects[4].client)
                })
              )
          }),
          getAll: () => ({
            options: {},
            allowedRoles: AllUserRoles,
            verify: (res) =>
              should(res.result).match(
                projects.map((p) =>
                  Object.assign({}, p, {
                    _id: compareIds(p._id),
                    client: compareIds(p.client)
                  })
                )
              )
          }),
          count: () => ({
            allowedRoles: AllUserRoles,
            verify: (res) => should(res.result).equal(projects.length)
          }),
          validateCreate: () => ({
            input: Object.assign({}, inputValidateCreate, {
              client: clients[0]._id
            }),
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin
            ],
            verify: (res) => should(res.result).be.null()
          }),
          validateUpdate: () => ({
            input: JSON.parse(JSON.stringify(projects[2])),
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin
            ],
            verify: (res) => should(res.result).be.null()
          }),
          saveCreate: () => ({
            input: Object.assign({}, inputSaveCreate, {
              client: clients[0]._id
            }),
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin
            ],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, inputSaveCreate, {
                  client: compareIds(clients[0]._id)
                })
              )
          }),
          saveUpdate: () => ({
            input: JSON.parse(JSON.stringify(projects[2])),
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin
            ],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, projects[2], {
                  _id: compareIds(projects[2]._id),
                  client: compareIds(projects[2].client)
                })
              )
          })
        });

        it("getAllByCode", async function() {
          await Project.deleteMany({});
          const tempProjects = createProjects(
            Array(21)
              .fill({})
              .map((_, i) => ({
                code: "Proj" + i,
                client: clients[0]._id,
                isActive: i % 2 === 0
              }))
          );
          for (const proj of tempProjects) {
            await new Project(proj).save();
          }
          const result = await controller.getAllByCode(user._id, "j1");
          should(result.success).be.true();
          should(result.result).have.lengthOf(5);
        });
      });
    }
  });
}
