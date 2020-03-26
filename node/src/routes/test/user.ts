import { Express } from "express";
import { Server } from "http";
import { Container } from "inversify";
import "reflect-metadata";
import should from "should";
import { SuperAgent } from "superagent";
import supertest, { Test } from "supertest";

import moment from "moment";
import { UserRouter } from "../user";
import { IViewUser } from "../../../../types/viewmodels";
import { ProjectType } from "../../constants/enums/project-type";
import { UserRole } from "../../constants/enums/user-role";
import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { UserModel } from "../../interfaces/models";

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  let app: Express;
  let server: Server;
  let agent: SuperAgent<Test>;
  let User: UserModel;

  function validUser(): IViewUser {
    return {
      _id: undefined,
      username: "test",
      firstName: "Test",
      lastName: "Test",
      email: "test@test.com",
      isActive: true,
      role: UserRole.Everyone,
      billingGroups: [
        {
          projectType: ProjectType.Public,
          timeline: [
            {
              begin: new Date(1970, 0, 1),
              end: new Date(2000, 0, 1),
              jobTitle: "Ingénieur junior",
              rate: 100
            },
            {
              begin: new Date(2000, 0, 2),
              end: undefined,
              jobTitle: "Ingénieur",
              rate: 125
            }
          ]
        },
        {
          projectType: ProjectType.Prive,
          timeline: [
            {
              begin: new Date(1970, 0, 1),
              end: new Date(2000, 0, 1),
              jobTitle: "Ingénieur junior",
              rate: 200
            },
            {
              begin: new Date(2000, 0, 2),
              end: undefined,
              jobTitle: "Ingénieur",
              rate: 250
            }
          ]
        }
      ]
    };
  }

  describe(UserRouter.name, function() {
    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      User = container.get(Models.User);
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
      await User.deleteMany({ username: { $ne: "admin" } });
    });

    it("should have GET /", async function() {
      const user = new User(validUser());
      await user.setPassword("password");
      await user.save();
      const response = await agent
        .get(baseUrl + "/")
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: [
          { username: "admin", isActive: true, role: UserRole.Superadmin },
          JSON.parse(JSON.stringify(user))
        ],
        success: true
      });
    });

    it("should have GET /:id", async function() {
      const user = new User(validUser());
      await user.setPassword("password");
      await user.save();
      const response = await agent
        .get(baseUrl + `/${user.id}`)
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: JSON.parse(JSON.stringify(user)),
        success: true
      });
    });

    it("should have POST /validate", async function() {
      const user = validUser();
      user.password = "password";
      const response = await agent
        .post(baseUrl + "/validate")
        .set("Accept", "application/json")
        .send(user)
        .expect(200);
      should(response.body).match({
        message: "",
        result: null,
        success: true
      });
    });

    it("should have POST /save", async function() {
      const user = validUser();
      user.password = "password";
      const response = await agent
        .post(baseUrl + "/save")
        .set("Accept", "application/json")
        .send(user)
        .expect(200);
      user.password = undefined;
      user.billingGroups = user.billingGroups.map((group) => {
        group.timeline = group.timeline.map((rate) => {
          rate.begin =
            rate.begin &&
            moment(rate.begin)
              .startOf("day")
              .toDate();
          rate.end =
            rate.end &&
            moment(rate.end)
              .startOf("day")
              .toDate();
          return rate;
        });
        return group;
      });
      const expectedUser = JSON.parse(JSON.stringify(user));
      delete expectedUser.password;
      should(response.body).match({
        message: "",
        result: expectedUser,
        success: true
      });
      should(response.body.result.password).be.undefined();
    });
  });
}
