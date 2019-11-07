import { Container } from "inversify";
import { Types } from "mongoose";
import "reflect-metadata";
import should from "should";

import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { ClientController } from "../client";
import { ClientModel, ClientDocument } from "../../interfaces/models";
import { IViewClient } from "../../../../types/viewmodels";

export default function buildTestSuite() {
  describe(ClientController.name, function() {
    let Client: ClientModel;
    let controller: ClientController;

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<ClientController>(ClientController).toSelf();
      controller = container.get(ClientController);
      Client = container.get(Models.Client);
    });

    this.afterEach(async function() {
      await Client.deleteMany({});
    });

    it("should have a getById function.", async function() {
      const id = new Types.ObjectId();
      await new Client({ _id: id, name: "first" }).save();
      const result = await controller.getById(id.toHexString());
      should(result.success).be.true();
      should(result.result).match({ name: "first" });
    });

    it("should have a getAll function.", async function() {
      let models = [
        new Client({ name: "first" }),
        new Client({ name: "second" }),
        new Client({ name: "third" })
      ];
      for (const m of models) {
        await m.save();
      }
      const result = await controller.getAll();
      should(result.success).be.true();
      const array = result.result as IViewClient[];
      should(array).have.length(3);
      for (const item of array) {
        should(models.length).not.equal(0);
        models = models.filter((m) => m.name !== item.name);
      }
      should(models).be.empty();
    });

    it("should have a count function.", async function() {
      const models = [
        new Client({ name: "first" }),
        new Client({ name: "second" }),
        new Client({ name: "third" })
      ];
      for (const m of models) {
        await m.save();
      }
      should((await controller.count()).result).equal(3);
    });

    it("should have a validate function.", async function() {
      const id = new Types.ObjectId();
      await new Client({ _id: id, name: "Test" }).save();
      should(
        (await controller.validate({ _id: undefined, name: "Testeee" })).success
      ).be.true();
      should(
        (await controller.validate({ _id: id, name: "Testeee" })).success
      ).be.true();
    });

    it("should have a save function.", async function() {
      const result = await controller.save({ _id: undefined, name: "Test" });
      should(result.success).be.true();
      should(result.result).match({ name: "Test" });
      should((await Client.find({}))[0].name).equal("Test");
    });

    it("should have a getAllByName function.", async function() {
      let models: ClientDocument[] = [];
      for (let i = 1; i <= 20; ++i) {
        models.push(new Client({ name: `CL${i}` }));
      }
      for (const m of models) {
        await m.save();
      }
      const result = await controller.getAllByName("L1");
      should(result.success).be.true();
      should(result.result).have.length(11);
    });
  });
}
