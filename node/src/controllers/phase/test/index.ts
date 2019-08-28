import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { PhaseController } from "../index";
import { PhaseModel } from "../../../interfaces/models";

export default function buildTestSuite() {
  describe(PhaseController.name, function() {
    let Phase: PhaseModel;
    let controller: PhaseController;

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<PhaseController>(PhaseController).toSelf();
      controller = container.get(PhaseController);
      Phase = container.get(Models.Phase);
    });

    it("should have a getById function.", function() {
      should.throws(() => controller.getById(""), "Method not implemented.");
    });

    it("should have a getAll function.", function() {
      should.throws(() => controller.getAll(), "Method not implemented.");
    });

    it("should have a getAllPopulated function.", function() {
      should.throws(
        () => controller.getAllPopulated(),
        "Method not implemented."
      );
    });

    it("should have a count function.", function() {
      should.throws(() => controller.count(), "Method not implemented.");
    });

    it("should have a validate function.", function() {
      should.throws(
        () => controller.validate(new Phase()),
        "Method not implemented."
      );
    });

    it("should have a save function.", function() {
      should.throws(
        () => controller.save(new Phase()),
        "Method not implemented."
      );
    });

    it("should have a deleteById function.", function() {
      should.throws(() => controller.deleteById(""), "Method not implemented.");
    });
  });
}
