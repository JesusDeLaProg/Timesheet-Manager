import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import { ProjectType } from "../../constants/enums/project-type";
import { UserRole } from "../../constants/enums/user-role";
import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { UserController } from "../user";
import { UserModel } from "../../interfaces/models";
import { Types } from "mongoose";
import { IViewUser } from "../../../../types/viewmodels";

function validUser(): IViewUser {
  return {
    _id: undefined,
    username: "test",
    firstName: "Test",
    lastName: "Test",
    email: "test@test.com",
    isActive: true,
    role: UserRole.Superadmin,
    billingGroups: [
      {
        projectType: ProjectType.Public,
        timeline: [
          {
            begin: new Date(1970, 0, 1),
            end: new Date(2000, 0, 1),
            jobTitle: "Ingénieur junior",
            rate: 100
          },
          {
            begin: new Date(2000, 0, 2),
            end: undefined,
            jobTitle: "Ingénieur",
            rate: 125
          }
        ]
      },
      {
        projectType: ProjectType.Prive,
        timeline: [
          {
            begin: new Date(1970, 0, 1),
            end: new Date(2000, 0, 1),
            jobTitle: "Ingénieur junior",
            rate: 200
          },
          {
            begin: new Date(2000, 0, 2),
            end: undefined,
            jobTitle: "Ingénieur",
            rate: 250
          }
        ]
      }
    ]
  };
}

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

    this.afterEach(async function() {
      await User.deleteMany({});
    });

    it("should have a getById function.", async function() {
      const id = new Types.ObjectId();
      const user = new User(validUser());
      user._id = id;
      user.plainTextPassword = "password";
      await user.save();
      const result = await controller.getById(id.toHexString());
      should(result.success).be.true();
      should(result.result).match({ username: "test" });
    });

    it("should have a getAll function.", async function() {
      let models = [
        new User(validUser()),
        new User(validUser()),
        new User(validUser())
      ];
      for (const m of models) {
        m.username = `user#${models.indexOf(m)}`;
        m.plainTextPassword = "password";
        await new User(m).save();
      }
      const result = await controller.getAll();
      should(result.success).be.true();
      const array = result.result as IViewUser[];
      should(array).have.length(3);
      for (const item of array) {
        should(models.length).not.equal(0);
        models = models.filter((m) => m.username !== item.username);
      }
      should(models).be.empty();
    });

    it("should have a count function.", async function() {
      let models = [
        new User(validUser()),
        new User(validUser()),
        new User(validUser())
      ];
      for (const m of models) {
        m.username = `user#${models.indexOf(m)}`;
        m.plainTextPassword = "password";
        await new User(m).save();
      }
      should((await controller.count()).result).equal(3);
    });

    it("should have a validate function.", async function() {
      let testUser = new User(validUser());
      testUser.username = "user1";
      testUser.plainTextPassword = "password";
      testUser = await testUser.save();
      const user1 = validUser();
      user1.password = "password";
      const result1 = await controller.validate(user1, testUser._id);
      should(result1.result).be.null();
      should(result1.success).be.true();
      const user2 = validUser();
      user2.password = "password";
      user2.firstName = "Testeeeeeee";
      user2._id = testUser._id;
      const result2 = await controller.validate(user2, testUser._id);
      should(result2.result).be.null();
      should(result2.success).be.true();
    });

    it("should have a save function.", async function() {
      let testUser = new User(validUser());
      testUser.username = "user1";
      testUser.plainTextPassword = "password";
      testUser = await testUser.save();
      const user1 = validUser();
      user1.password = "password";
      const result1 = await controller.save(user1, testUser._id);
      should(result1.result).match({ username: "test", password: undefined });
      should(result1.success).be.true();
      should((await User.find({ username: "test" }))[0].username).equal("test");
      const user2 = testUser.toObject() as IViewUser;
      user2.firstName = "NewFirstName";
      const result2 = await controller.save(user2, testUser._id);
      should(result2.result).match({
        firstName: "NewFirstName",
        password: undefined
      });
      should(result2.success).be.true();
      should((await User.find({ username: "user1" }))[0].firstName).equal(
        "NewFirstName"
      );
    });
  });
}
