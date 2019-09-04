import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { ActivityController } from "../index";
import { ActivityModel } from "../../../interfaces/models";

export default function buildTestSuite() {
  describe(ActivityController.name, function() {
    let Activity: ActivityModel;
    let controller: ActivityController;

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<ActivityController>(ActivityController).toSelf();
      controller = container.get(ActivityController);
      Activity = container.get(Models.Activity);
    });

    it("should have a getById function.", function() {
      should.throws(
        async () => await controller.getById(""),
        "Method not implemented."
      );
    });

    it("should have a getAll function.", function() {
      should.throws(
        async () => await controller.getAll(),
        "Method not implemented."
      );
    });

    it("should have a count function.", function() {
      should.throws(
        async () => await controller.count(),
        "Method not implemented."
      );
    });

    it("should have a validate function.", function() {
      should.throws(
        async () => await controller.validate(new Activity()),
        "Method not implemented."
      );
    });

    it("should have a save function.", function() {
      should.throws(
        async () => await controller.save(new Activity()),
        "Method not implemented."
      );
    });
  });
}
