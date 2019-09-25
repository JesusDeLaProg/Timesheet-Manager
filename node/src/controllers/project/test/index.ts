import { Container } from "inversify";
import { Types } from "mongoose";
import "reflect-metadata";
import should from "should";

import Models from "../../../constants/symbols/models";
import { ProjectType } from "../../../constants/enums/project-type";
import { ModelModule } from "../../../infrastructure/database/testing";
import { ProjectController } from "../index";
import { ProjectModel, ClientModel } from "../../../interfaces/models";
import { IViewProject } from "../../../../../types/viewmodels";

export default function buildTestSuite() {
  describe(ProjectController.name, function() {
    let Client: ClientModel;
    let Project: ProjectModel;
    let controller: ProjectController;

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<ProjectController>(ProjectController).toSelf();
      controller = container.get(ProjectController);
      Client = container.get(Models.Client);
      Project = container.get(Models.Project);
    });

    async function createProjects(number: number) {
      const id = new Types.ObjectId();
      const testClient = await new Client({
        _id: id,
        name: "TestClient"
      }).save();
      const projects = [];
      for (let i = 1; i <= number; ++i) {
        projects.push(
          new Project({
            code: `PROJ${i}`,
            name: `Test${i}`,
            client: testClient._id,
            type: ProjectType.Public,
            isActive: true
          })
        );
      }
      for (const proj of projects) {
        await proj.save();
      }
      return projects;
    }

    this.afterEach(async function() {
      await Project.deleteMany({});
      await Client.deleteMany({});
    });

    it("should have a getById function.", async function() {
      const projects = await createProjects(1);
      const result = await controller.getById(projects[0]._id);
      should(result.success).be.true();
      should(result.result).match({ code: "PROJ1", name: "Test1" });
    });

    it("should have a getAll function.", async function() {
      await createProjects(3);
      const result = await controller.getAll();
      should(result.success).be.true();
      should(result.result).have.length(3);
      should((result.result as IViewProject[])[2]).match({
        code: "PROJ3",
        name: "Test3"
      });
    });

    it("should have a count function.", async function() {
      await createProjects(3);
      const result = await controller.count();
      should(result.success).be.true();
      should(result.result).equal(3);
    });

    it("should have a validate function.", async function() {
      const testClient = await new Client({ name: "Test" }).save();
      const result = await controller.validate({
        _id: undefined,
        code: "PROJ",
        name: "Test",
        client: testClient._id,
        isActive: true,
        type: ProjectType.Public
      });
      should(result.success).be.true();
      should(result.result).be.null();
      const id = new Types.ObjectId();
      await new Project({
        _id: id,
        code: "PROJ1",
        name: "Test1",
        isActive: true,
        client: testClient._id,
        type: ProjectType.Public
      }).save();
      should(
        (await controller.validate({
          _id: id,
          code: "PROJ",
          name: "Test",
          client: testClient._id,
          isActive: true,
          type: ProjectType.Public
        })).success
      ).be.true();
    });

    it("should have a save function.", async function() {
      const testClient = await new Client({ name: "Test" }).save();
      const results = [
        await controller.save({
          _id: undefined,
          code: "PROJ1",
          name: "Test1",
          client: testClient._id,
          isActive: true,
          type: ProjectType.Public
        }),
        await controller.save({
          _id: undefined,
          code: "PROJ2",
          name: "Test2",
          client: testClient._id,
          isActive: true,
          type: ProjectType.Public
        })
      ];
      should(results).match([{ success: true }, { success: true }]);
      should(await Project.find({})).match([
        {
          code: "PROJ1",
          name: "Test1",
          client: testClient._id,
          isActive: true,
          type: ProjectType.Public
        },
        {
          code: "PROJ2",
          name: "Test2",
          client: testClient._id,
          isActive: true,
          type: ProjectType.Public
        }
      ]);
    });

    it("should have a getAllByCode function.", async function() {
      const projects = await createProjects(20);
      const expectedProjects = projects
        .filter((proj) => proj.code.match(/J1/g))
        .map((proj) => proj.toObject());
      const result = await controller.getAllByCode("J1");
      should(result.result).have.length(11);
      should(result).match({
        success: true,
        result: expectedProjects
      });
    });
  });
}
