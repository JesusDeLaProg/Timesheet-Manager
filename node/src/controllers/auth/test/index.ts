import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import { ModelModule } from "../../../infrastructure/database/testing";
import { AuthController } from "../index";

export default function buildTestSuite() {
  describe(AuthController.name, function() {
    let controller: AuthController;

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<AuthController>(AuthController).toSelf();
      controller = container.get(AuthController);
    });

    it("should have a login function.", function() {
      should.throws(() => controller.login("", ""), "Method not implemented.");
    });
  });
}
