import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { AuthController } from "../index";
import { UserModel } from "../../../interfaces/models";
import { AssertionError } from "assert";

export default function buildTestSuite() {
  describe(AuthController.name, function() {
    let controller: AuthController;
    let User: UserModel;

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<AuthController>(AuthController).toSelf();
      controller = container.get(AuthController);
      User = container.get(Models.User);
    });

    this.afterEach(async function() {
      await User.deleteMany({});
    });

    it("should log in a user with correct credentials.", async function() {
      const user = new User({
        username: "testuser",
        isActive: true
      });
      user.plainTextPassword = "password";
      await user.save({ validateBeforeSave: false });

      const result = await controller.login("testuser", "password");
      should(result.success).be.true();
    });

    it("should throw an error for incorrect credentials.", async function() {
      const user = new User({
        username: "testuser",
        isActive: true
      });
      user.plainTextPassword = "password";
      await user.save({ validateBeforeSave: false });

      try {
        await controller.login("testuser2", "password");
      } catch (err) {
        should(err).match({
          success: false,
          message: "Nom d'usager ou mot de passe invalide."
        });
        try {
          await controller.login("testuser", "wrong password");
        } catch (error) {
          should(error).match({
            success: false,
            message: "Nom d'usager ou mot de passe invalide."
          });
          return;
        }
      }
      throw new AssertionError({
        message: "Execution should not have continued."
      });
    });

    it("should throw an error for inactive accounts.", async function() {
      const user = new User({
        username: "testuser",
        isActive: false
      });
      user.plainTextPassword = "password";
      await user.save({ validateBeforeSave: false });
      try {
        await controller.login("testuser", "password");
      } catch (err) {
        should(err).match({
          success: false,
          message:
            "Ce compte utilisateur est désactivé. " +
            "Veuillez réactiver ce compte ou vous connecter avec un autre compte."
        });
        return;
      }
      throw new AssertionError({
        message: "Execution should not have continued."
      });
    });
  });
}
