import { Express } from "express";
import { Server } from "http";
import { Container } from "inversify";
import "reflect-metadata";
import should from "should";
import { SuperAgent } from "superagent";
import supertest, { Test } from "supertest";

import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { ClientModel } from "../../interfaces/models";
import { ClientRouter } from "../client";

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  let app: Express;
  let server: Server;
  let agent: SuperAgent<Test>;
  let Client: ClientModel;

  describe(ClientRouter.name, function ClientRouterTest() {
    this.beforeAll(() => {
      const container = new Container();
      container.load(ModelModule);
      Client = container.get(Models.Client);
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
      await Client.deleteMany({});
    });

    it("should have GET /", async () => {
      await new Client({ name: "Client1" }).save();
      const response = await agent
        .get(baseUrl + "/")
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: [{ name: "Client1" }],
        success: true,
      });
    });

    it("should have GET /:id", async () => {
      const client = await new Client({ name: "Client1" }).save();
      const response = await agent
        .get(baseUrl + `/${client.id}`)
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: { name: "Client1", _id: client.id },
        success: true,
      });
    });

    it("should have GET /byName/:name", async () => {
      for (let i = 1; i <= 20; ++i) {
        await new Client({ name: `Client${i}` }).save();
      }
      const response = await agent
        .get(baseUrl + "/byName/" + encodeURIComponent("client1"))
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body.message).be.empty();
      should(response.body.result).matchEach({ name: /client1/i });
      should(response.body.success).be.true();
    });

    it("should have POST /validate", async () => {
      const response1 = await agent
        .post(baseUrl + "/validate")
        .set("Accept", "application/json")
        .send({ name: "Client1" })
        .expect(200);
      should(response1.body.message).be.empty();
      should(response1.body.result).be.null();
      should(response1.body.success).be.true();
      const client = await new Client({ name: "Client1" }).save();
      const modifiedClient = client.toJSON();
      modifiedClient.name = "Client2";
      const response2 = await agent
        .post(baseUrl + "/validate")
        .set("Accept", "application/json")
        .send(modifiedClient)
        .expect(200);
      should(response2.body.message).be.empty();
      should(response2.body.result).be.null();
      should(response2.body.success).be.true();
    });

    it("should have POST /save", async () => {
      const response1 = await agent
        .post(baseUrl + "/save")
        .set("Accept", "application/json")
        .send({ name: "Client1" })
        .expect(200);
      should(response1.body.message).be.empty();
      should(response1.body.result).match({ name: "Client1" });
      should(response1.body.success).be.true();
      const client = (await Client.find({ name: "Client1" }))[0];
      const modifiedClient = client.toJSON();
      modifiedClient.name = "Client2";
      const response2 = await agent
        .post(baseUrl + "/save")
        .set("Accept", "application/json")
        .send(modifiedClient)
        .expect(200);
      should(response2.body.message).be.empty();
      should(response2.body.result).match({ name: "Client2" });
      should(response2.body.success).be.true();
    });
  });
}
