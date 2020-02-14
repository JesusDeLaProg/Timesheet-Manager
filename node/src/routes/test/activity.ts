import { Express } from "express";
import { Server } from "http";
import { Container } from "inversify";
import "reflect-metadata";
import should from "should";
import { SuperAgent } from "superagent";
import supertest, { Test } from "supertest";

import { ActivityRouter } from "../activity";
import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { ActivityModel } from "../../interfaces/models";

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  let app: Express;
  let server: Server;
  let agent: SuperAgent<Test>;

  let Activity: ActivityModel;

  describe(ActivityRouter.name, function() {
    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      Activity = container.get(Models.Activity);
    });

    this.beforeEach(async function() {
      app = appFactory();
      server = app.listen(3000);
      agent = supertest.agent(app);
      const authResponse = await agent
        .post("/api/auth/login")
        .send({ username: "admin", password: "admin" });
      agent.jar.setCookies(authResponse.get("Set-Cookie"));
    });

    this.afterEach(async function() {
      if (server) {
        server.close();
      }
      await Activity.deleteMany({});
    });

    it("should have GET /", async function() {
      await new Activity({ code: "ACT1", name: "Activity1" }).save();
      const response = await agent
        .get(baseUrl + "/")
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: [
          {
            code: "ACT1",
            name: "Activity1"
          }
        ],
        success: true
      });
    });

    it("should have GET /:id", async function() {
      const activity = await new Activity({
        code: "ACT1",
        name: "Activity1"
      }).save();
      const response = await agent
        .get(baseUrl + `/${activity.id}`)
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: {
          _id: activity.id,
          code: "ACT1",
          name: "Activity1"
        },
        success: true
      });
    });

    it("should have POST /validate", async function() {
      const response = await agent
        .post(baseUrl + "/validate")
        .set("Accept", "application/json")
        .send({ code: "ACT1", name: "Activity1" })
        .expect(200);
      should(response.body).match({
        message: "",
        result: null,
        success: true
      });
    });

    it("should have POST /save", async function() {
      const response = await agent
        .post(baseUrl + "/save")
        .set("Accept", "application/json")
        .send({ code: "ACT1", name: "Activity1" })
        .expect(200);
      should(response.body).match({
        message: "",
        result: {
          code: "ACT1",
          name: "Activity1"
        },
        success: true
      });
    });
  });
}
