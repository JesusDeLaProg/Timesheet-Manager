if (!Reflect.hasOwnMetadata) {
  require("reflect-metadata");
}
import "../../../infrastructure/database/testing";

import should from "should";
import { model, Schema } from "mongoose";

import { UserController } from "../index";
import { UserDocument, UserModel } from "../../../interfaces/models";

// TODO : Inject UserController
const schema = new Schema({
  name: String
});
let User: UserModel;
try {
  User = model<UserDocument>("User");
} catch (e) {
  User = model<UserDocument>("User", schema);
}

describe(UserController.name, function() {
  let controller: UserController;

  this.beforeAll(function() {
    controller = new UserController(User);
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
    should.throws(() => controller.save(new User()), "Method not implemented.");
  });

  it("should have a deleteById function.", function() {
    should.throws(() => controller.deleteById(""), "Method not implemented.");
  });
});
