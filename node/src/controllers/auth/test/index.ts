import "reflect-metadata";
import "../../../infrastructure/database/testing";

import should from "should";
import { model, Schema } from "mongoose";

import { AuthController } from "../index";
import { UserDocument, UserModel } from "../../../interfaces/models";

// TODO : Inject AuthController
const schema = new Schema({
  name: String
});
let User: UserModel;
try {
  User = model<UserDocument>("User");
} catch (e) {
  User = model<UserDocument>("User", schema);
}

describe(AuthController.name, function() {
  let controller: AuthController;

  this.beforeAll(function() {
    controller = new AuthController(User);
  });

  it("should have a login function.", function() {
    should.throws(() => controller.login("", ""), "Method not implemented.");
  });
});
