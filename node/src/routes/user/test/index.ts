import { Express } from "express";
import { Server } from "http";
import { Container } from "inversify";
import "reflect-metadata";
import should from "should";
import { SuperAgent } from "superagent";
import supertest, { Test } from "supertest";

import { UserRouter } from "../";
import { IViewUser } from "../../../../../types/viewmodels";
import { ProjectType } from "../../../constants/enums/project-type";
import { UserRole } from "../../../constants/enums/user-role";
import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { UserModel } from "../../../interfaces/models";

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
      billingRates: [
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

    this.beforeEach(function() {
      app = appFactory();
      server = app.listen(3000);
      agent = supertest.agent(app);
    });

    this.afterEach(async function() {
      if (server) {
        server.close();
      }
      await User.deleteMany({});
    });

    it("should have GET /", async function() {
      const user = new User(validUser());
      user.plainTextPassword = "password";
      await user.save();
      const response = await agent
        .get(baseUrl + "/")
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: [JSON.parse(JSON.stringify(user))],
        success: true
      });
    });

    it("should have GET /:id", async function() {
      const user = new User(validUser());
      user.plainTextPassword = "password";
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
      const response = await agent
        .post(baseUrl + "/validate")
        .set("Accept", "application/json")
        .send(validUser())
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
      should(response.body).match({
        message: "",
        result: user,
        success: true
      });
      should(response.body.result.password).be.undefined();
    });
  });
}
