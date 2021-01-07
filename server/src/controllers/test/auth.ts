import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import { AssertionError } from "assert";
import { IViewUser } from "../../../../types/viewmodels";
import { UserRole } from "../../constants/enums/user-role";
import Models from "../../constants/symbols/models";
import { SERVER_KEY_OR_SECRET } from "../../constants/symbols/parameters";
import { ModelModule } from "../../infrastructure/database/testing";
import { UserModel } from "../../interfaces/models";
import { AuthController } from "../auth";
import { createUsers, setupDatabase } from "./abstract";

export default function buildTestSuite() {
  describe(AuthController.name, function AuthControllerTest() {
    let User: UserModel;
    let controller: AuthController;

    const users = createUsers([
      { username: "Active", isActive: true, role: UserRole.Everyone },
      { username: "Inactive", isActive: false, role: UserRole.Subadmin },
    ]);

    this.beforeAll(() => {
      const container = new Container();
      container.load(ModelModule);
      container.bind<AuthController>(AuthController).toSelf();
      container
        .bind(SERVER_KEY_OR_SECRET)
        .toConstantValue(process.env.JWTSECRET);
      controller = container.get(AuthController);
      User = container.get(Models.User);
    });

    this.beforeEach(async () => {
      const userDocs = [new User(users[0]), new User(users[1])];
      await userDocs[0].setPassword("password1");
      await userDocs[1].setPassword("password2");
      await setupDatabase(
        {
          users: userDocs.map((u) => u.toJSON() as IViewUser),
        },
        false
      );
    });

    this.afterEach(async () => {
      await User.deleteMany({});
    });

    it("should authenticate active user with correct credentials", async () => {
      const result = await controller.login(users[0].username, "password1");
      should(result.success).true();
    });

    it("should block active user with wrong credentials", async () => {
      try {
        await controller.login(users[0].username, "sdfadfsgdxcvbxcb");
      } catch (err) {
        should(err).match({
          success: false,
          message: "Nom d'usager ou mot de passe invalide.",
        });
        return;
      }
      throw new AssertionError({
        message:
          "Authentication should throw an exception on wrong credentials",
      });
    });

    it("should block inactive user", async () => {
      try {
        await controller.login(users[1].username, "password2");
      } catch (err) {
        should(err).match({
          success: false,
          message:
            "Ce compte utilisateur est désactivé. " +
            "Veuillez réactiver ce compte ou vous connecter avec un autre compte.",
        });
        return;
      }
      throw new AssertionError({
        message:
          "Authentication should throw an exception on wrong credentials",
      });
    });
  });
}
