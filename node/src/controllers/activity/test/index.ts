import "reflect-metadata";
import "../../../infrastructure/database/testing";

import should from "should";
import { model, Schema } from "mongoose";

import { ActivityController } from "../index";
import { ActivityDocument } from "../../../interfaces/models";

// TODO : Inject ActivityController
const schema = new Schema({
  name: String
});
const Activity = model<ActivityDocument>("Activity", schema);

describe(ActivityController.name, function() {
  let controller: ActivityController;

  this.beforeAll(function() {
    controller = new ActivityController(Activity);
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
      () => controller.validate(new Activity()),
      "Method not implemented."
    );
  });

  it("should have a save function.", function() {
    should.throws(
      () => controller.save(new Activity()),
      "Method not implemented."
    );
  });

  it("should have a deleteById function.", function() {
    should.throws(() => controller.deleteById(""), "Method not implemented.");
  });
});
