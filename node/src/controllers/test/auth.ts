import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { AuthController } from "../auth";
import { UserModel } from "../../interfaces/models";
import { AssertionError } from "assert";
import { createUsers, setupDatabase } from "./abstract";
import { UserRole } from "node/src/constants/enums/user-role";
import { IViewUser } from "types/viewmodels";

export default function buildTestSuite() {
  describe(AuthController.name, function() {
    let User: UserModel;
    let controller: AuthController;

    const users = createUsers([
      { username: "Active", isActive: true, role: UserRole.Everyone },
      { username: "Inactive", isActive: false, role: UserRole.Subadmin }
    ]);

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<AuthController>(AuthController).toSelf();
      controller = container.get(AuthController);
      User = container.get(Models.Activity);
    });

    this.beforeEach(async function() {
      const userDocs = [new User(users[0]), new User(users[1])];
      await userDocs[0].setPassword("password1");
      await userDocs[1].setPassword("password2");
      await setupDatabase(
        {
          users: userDocs.map((u) => u.toJSON() as IViewUser)
        },
        false
      );
    });

    this.afterEach(async function() {
      await User.deleteMany({});
    });

    it("should authenticate active user with correct credentials", async function() {
      const result = await controller.login(users[0].username, "password1");
      should(result.success).true();
    });

    it("should block active user with wrong credentials", async function() {
      try {
        const result = await controller.login(
          users[0].username,
          "sdfadfsgdxcvbxcb"
        );
      } catch (err) {
        should(err).match({
          success: false,
          message: "Nom d'usager ou mot de passe invalide."
        });
      }
      throw new AssertionError({
        message: "Authentication should throw an exception on wrong credentials"
      });
    });

    it("should block inactive user", async function() {
      try {
        const result = await controller.login(users[1].username, "password2");
      } catch (err) {
        should(err).match({
          success: false,
          message:
            "Ce compte utilisateur est désactivé. " +
            "Veuillez réactiver ce compte ou vous connecter avec un autre compte."
        });
      }
      throw new AssertionError({
        message: "Authentication should throw an exception on wrong credentials"
      });
    });
  });
}
