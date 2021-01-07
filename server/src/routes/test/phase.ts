import { Express } from "express";
import { Server } from "http";
import { Container } from "inversify";
import "reflect-metadata";
import should from "should";
import { SuperAgent } from "superagent";
import supertest, { Test } from "supertest";

import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { ActivityModel, PhaseModel } from "../../interfaces/models";
import { PhaseRouter } from "../phase";

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  let app: Express;
  let server: Server;
  let agent: SuperAgent<Test>;
  let Activity: ActivityModel;
  let Phase: PhaseModel;

  describe(PhaseRouter.name, function PhaseRouterTest() {
    this.beforeAll(() => {
      const container = new Container();
      container.load(ModelModule);
      Activity = container.get(Models.Activity);
      Phase = container.get(Models.Phase);
    });

    this.beforeEach(async () => {
      app = appFactory();
      server = app.listen(3000);
      agent = supertest.agent(app);
      const authResponse = await agent
        .post("/api/auth/login")
        .send({ username: "admin", password: "admin" });
      agent.jar.setCookies(authResponse.get("Set-Cookie"));
    });

    this.afterEach(async () => {
      if (server) {
        server.close();
      }
      await Phase.deleteMany({});
      await Activity.deleteMany({});
    });

    it("should have GET /", async () => {
      const activities = [
        await new Activity({
          code: "ACT1",
          name: "Activity1",
        }).save(),
        await new Activity({
          code: "ACT2",
          name: "Activity2",
        }).save(),
      ];
      const phases = [
        await new Phase({
          code: "PH1",
          name: "Phase1",
          activities: activities.map((act) => act.id),
        }).save(),
        await new Phase({
          code: "PH2",
          name: "Phase2",
          activities: activities.map((act) => act.id),
        }).save(),
      ];
      const response = await agent
        .get(baseUrl + "/")
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: phases.map((ph) => JSON.parse(JSON.stringify(ph))),
        success: true,
      });
    });

    it("should have GET /:id", async () => {
      const phase = await new Phase({ code: "PH1", name: "Phase1" }).save();
      const response = await agent
        .get(baseUrl + `/${phase.id}`)
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: JSON.parse(JSON.stringify(phase)),
        success: true,
      });
    });

    it("should have GET /populated", async () => {
      const activities = [
        await new Activity({
          code: "ACT1",
          name: "Activity1",
        }).save(),
        await new Activity({
          code: "ACT2",
          name: "Activity2",
        }).save(),
      ];
      const phases = [
        await new Phase({
          code: "PH1",
          name: "Phase1",
          activities: activities.map((act) => act.id),
        }).save(),
        await new Phase({
          code: "PH2",
          name: "Phase2",
          activities: activities.map((act) => act.id),
        }).save(),
      ];
      const response = await agent
        .get(baseUrl + "/populated")
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: phases.map((ph) => {
          ph = JSON.parse(JSON.stringify(ph));
          ph.activities = activities.map((act) =>
            JSON.parse(JSON.stringify(act))
          );
          return ph;
        }),
        success: true,
      });
    });

    it("should have POST /validate", async () => {
      const response = await agent
        .post(baseUrl + "/validate")
        .set("Accept", "application/json")
        .send({
          code: "PH1",
          name: "Phase1",
          activities: [],
        })
        .expect(200);
      should(response.body).match({
        message: "",
        result: null,
        success: true,
      });
    });

    it("should have POST /save", async () => {
      const response = await agent
        .post(baseUrl + "/save")
        .set("Accept", "application/json")
        .send({
          code: "PH1",
          name: "Phase1",
          activities: [],
        })
        .expect(200);
      should(response.body).match({
        message: "",
        result: {
          code: "PH1",
          name: "Phase1",
          activities: [],
        },
        success: true,
      });
    });
  });
}
