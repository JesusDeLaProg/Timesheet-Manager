import { Express, response } from "express";
import { Server } from "http";
import parseCookies from "set-cookie-parser";
import "reflect-metadata";
import should from "should";
import supertest, { Test } from "supertest";

import { AuthRouter } from "../";
import { SuperAgent } from "superagent";

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  let app: Express;
  let server: Server;
  let agent: SuperAgent<Test>;

  describe(AuthRouter.name, function() {
    this.beforeEach(function() {
      app = appFactory();
      server = app.listen(3000);
      agent = supertest.agent(app);
    });

    this.afterEach(function() {
      server.close();
    });

    it("should have POST /login", function(done) {
      agent
        .post(baseUrl + "/login")
        .set("Accept", "application/json")
        .send({ username: "username", password: "password" })
        .expect(500, /Method not implemented/, function(error: any) {
          if (error) throw error;
          done();
        });
    });

    it("should have GET /logout", function(done) {
      agent
        .get(baseUrl + "/logout")
        .set("Accept", "application/json")
        .send()
        .expect((response) => {
          const cookies = parseCookies(response.get("Set-Cookie"), {
            map: true
          });
          should(cookies["SESSIONID"].value).be.empty();
        })
        .expect(200, function(error: any) {
          if (error) throw error;
          done();
        });
    });
  });
}
