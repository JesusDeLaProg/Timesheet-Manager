import { Express } from "express";
import { Server } from "http";
import "reflect-metadata";
import supertest, { Test } from "supertest";

import { ActivityRouter } from "../";
import { SuperAgent } from "superagent";

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  let app: Express;
  let server: Server;
  let agent: SuperAgent<Test>;

  describe(ActivityRouter.name, function() {
    this.beforeEach(function() {
      app = appFactory();
      server = app.listen(3000);
      agent = supertest.agent(app);
    });

    this.afterEach(function() {
      if (server) server.close();
    });

    it("should have GET /", function(done) {
      agent
        .get(baseUrl + "/")
        .set("Accept", "application/json")
        .send()
        .expect(500, /Method not implemented/, function(error: any) {
          if (error) throw error;
          done();
        });
    });

    it("should have GET /:id", function(done) {
      agent
        .get(baseUrl + "/1")
        .set("Accept", "application/json")
        .send()
        .expect(500, /Method not implemented/, function(error: any) {
          if (error) throw error;
          done();
        });
    });

    it("should have POST /validate", function(done) {
      agent
        .post(baseUrl + "/validate")
        .set("Accept", "application/json")
        .send({})
        .expect(500, /Method not implemented/, function(error: any) {
          if (error) throw error;
          done();
        });
    });

    it("should have POST /save", function(done) {
      agent
        .get(baseUrl + "/save")
        .set("Accept", "application/json")
        .send({})
        .expect(500, /Method not implemented/, function(error: any) {
          if (error) throw error;
          done();
        });
    });

    it("should have DELETE /:id", function(done) {
      agent
        .delete(baseUrl + "/1")
        .set("Accept", "application/json")
        .send()
        .expect(500, /Method not implemented/, function(error: any) {
          if (error) throw error;
          done();
        });
    });
  });
}
