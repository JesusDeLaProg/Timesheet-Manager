import { Express } from "express";
import { Server } from "http";
import { Container } from "inversify";
import "reflect-metadata";
import should from "should";
import { SuperAgent } from "superagent";
import supertest, { Test } from "supertest";

import { ProjectRouter } from "../";
import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { ClientModel, ProjectModel } from "../../../interfaces/models";
import { ProjectType } from "../../../constants/enums/project-type";

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  let app: Express;
  let server: Server;
  let agent: SuperAgent<Test>;
  let Project: ProjectModel;
  let Client: ClientModel;

  describe(ProjectRouter.name, function() {
    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      Project = container.get(Models.Project);
      Client = container.get(Models.Client);
    });

    this.beforeEach(function() {
      app = appFactory();
      server = app.listen(3000);
      agent = supertest.agent(app);
    });

    this.afterEach(async function() {
      if (server) {
        server.close();
      }
      await Project.deleteMany({});
      await Client.deleteMany({});
    });

    it("should have GET /", async function() {
      const client = await new Client({ name: "Client1" }).save();
      const project = await new Project({
        code: "PROJ1",
        name: "Project1",
        client: client.id,
        type: ProjectType.Public,
        isActive: true
      }).save();
      const response = await agent
        .get(baseUrl + "/")
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: [JSON.parse(JSON.stringify(project))],
        success: true
      });
    });

    it("should have GET /:id", async function() {
      const client = await new Client({ name: "Client1" }).save();
      const project = await new Project({
        code: "PROJ1",
        name: "Project1",
        client: client.id,
        type: ProjectType.Public,
        isActive: true
      }).save();
      const response = await agent
        .get(baseUrl + `/${project.id}`)
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: JSON.parse(JSON.stringify(project)),
        success: true
      });
    });

    it("should have GET /byCode/:code", async function() {
      const client = await new Client({ name: "Client1" }).save();
      for (let i = 1; i <= 20; ++i) {
        await new Project({
          code: `PROJ${i}`,
          name: `Project${i}`,
          client: client.id,
          type: ProjectType.Public,
          isActive: true
        }).save();
      }
      const response = await agent
        .get(baseUrl + "/byCode/" + encodeURIComponent("J1"))
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body.message).be.empty();
      should(response.body.result).matchEach({ code: /J1/i });
      should(response.body.success).be.true();
    });

    it("should have POST /validate", async function() {
      const client = await new Client({ name: "Client1" }).save();
      const response = await agent
        .post(baseUrl + "/validate")
        .set("Accept", "application/json")
        .send({
          code: "PROJ1",
          name: "Project1",
          client: client.id,
          type: ProjectType.Public,
          isActive: true
        })
        .expect(200);
      should(response.body).match({
        message: "",
        result: null,
        success: true
      });
    });

    it("should have POST /save", async function() {
      const client = await new Client({ name: "Client1" }).save();
      const response = await agent
        .post(baseUrl + "/save")
        .set("Accept", "application/json")
        .send({
          code: "PROJ1",
          name: "Project1",
          client: client.id,
          type: ProjectType.Public,
          isActive: true
        })
        .expect(200);
      should(response.body).match({
        message: "",
        result: {
          code: "PROJ1",
          name: "Project1",
          client: client.id,
          type: ProjectType.Public,
          isActive: true
        },
        success: true
      });
    });
  });
}
