import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { ClientController } from "../index";
import { ClientModel } from "../../../interfaces/models";

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

    it("should have a getById function.", function() {
      should.throws(() => controller.getById(""), "Method not implemented.");
    });

    it("should have a getAll function.", function() {
      should.throws(() => controller.getAll(), "Method not implemented.");
    });

    it("should have a getAllByName function.", function() {
      should.throws(
        () => controller.getAllByName(""),
        "Method not implemented."
      );
    });

    it("should have a count function.", function() {
      should.throws(() => controller.count(), "Method not implemented.");
    });

    it("should have a validate function.", function() {
      should.throws(
        () => controller.validate(new Client()),
        "Method not implemented."
      );
    });

    it("should have a save function.", function() {
      should.throws(
        () => controller.save(new Client()),
        "Method not implemented."
      );
    });

    it("should have a deleteById function.", function() {
      should.throws(() => controller.deleteById(""), "Method not implemented.");
    });
  });
}
