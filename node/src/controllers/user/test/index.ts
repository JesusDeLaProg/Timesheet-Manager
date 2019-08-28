import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { UserController } from "../index";
import { UserModel } from "../../../interfaces/models";

export default function buildTestSuite() {
  describe(UserController.name, function() {
    let User: UserModel;
    let controller: UserController;

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<UserController>(UserController).toSelf();
      controller = container.get(UserController);
      User = container.get(Models.User);
    });

    it("should have a getById function.", function() {
      should.throws(() => controller.getById(""), "Method not implemented.");
    });

    it("should have a getAll function.", function() {
      should.throws(() => controller.getAll(), "Method not implemented.");
    });

    it("should have a count function.", function() {
      should.throws(() => controller.count(), "Method not implemented.");
    });

    it("should have a validate function.", function() {
      should.throws(
        () => controller.validate(new User()),
        "Method not implemented."
      );
    });

    it("should have a save function.", function() {
      should.throws(
        () => controller.save(new User()),
        "Method not implemented."
      );
    });

    it("should have a deleteById function.", function() {
      should.throws(() => controller.deleteById(""), "Method not implemented.");
    });
  });
}
