import { Express } from "express";
import { Server } from "http";
import { Container } from "inversify";
import "reflect-metadata";
import parseCookies from "set-cookie-parser";
import should from "should";
import { SuperAgent } from "superagent";
import supertest, { Test } from "supertest";

import { AuthRouter } from "../";
import { IViewUser } from "../../../../../types/viewmodels";
import { ProjectType } from "../../../constants/enums/project-type";
import { UserRole } from "../../../constants/enums/user-role";
import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { UserModel } from "../../../interfaces/models";

function validUser(): IViewUser {
  return {
    _id: undefined,
    username: "test",
    firstName: "Test",
    lastName: "Test",
    email: "test@test.com",
    isActive: true,
    role: UserRole.Superadmin,
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

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  let app: Express;
  let server: Server;
  let agent: SuperAgent<Test>;
  let User: UserModel;

  describe(AuthRouter.name, function() {
    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      User = container.get(Models.User);
    });

    this.beforeEach(async function() {
      app = appFactory();
      server = app.listen(3000);
      agent = supertest.agent(app);
    });

    this.afterEach(async function() {
      server.close();
      await User.deleteMany({ username: { $ne: "admin" } });
    });

    it("should have POST /login", async function() {
      const user = new User(validUser());
      user.plainTextPassword = "password";
      await user.save();
      const response = await agent
        .post(baseUrl + "/login")
        .set("Accept", "application/json")
        .send({ username: "test", password: "password" })
        .expect(200);
      const tokenExpiration = response.get("X-Token-Expiration");
      const cookies = parseCookies(response.get("Set-Cookie"), {
        map: true
      });
      should(tokenExpiration).not.be.empty();
      should(cookies.SESSIONID).not.be.empty();
      should(response.body).match({ message: "", result: null, success: true });
    });

    it("should have GET /logout", async function() {
      const response = await agent
        .get(baseUrl + "/logout")
        .set("Accept", "application/json")
        .send()
        .expect(200);
      const cookies = parseCookies(response.get("Set-Cookie"), {
        map: true
      });
      should(cookies.SESSIONID.value).be.empty();
    });
  });
}
