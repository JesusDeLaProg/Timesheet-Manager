if (!Reflect.hasOwnMetadata) {
  require("reflect-metadata");
}
import "../../../infrastructure/database/testing";

import should from "should";
import { model, Schema } from "mongoose";

import { PhaseController } from "../index";
import { PhaseDocument } from "../../../interfaces/models";

// TODO : Inject PhaseController
const schema = new Schema({
  name: String
});
const Phase = model<PhaseDocument>("Phase", schema);

describe(PhaseController.name, function() {
  let controller: PhaseController;

  this.beforeAll(function() {
    controller = new PhaseController(Phase);
  });

  it("should have a getById function.", function() {
    should.throws(() => controller.getById(""), "Method not implemented.");
  });

  it("should have a getAll function.", function() {
    should.throws(() => controller.getAll(), "Method not implemented.");
  });

  it("should have a getAllPopulated function.", function() {
    should.throws(
      () => controller.getAllPopulated(),
      "Method not implemented."
    );
  });

  it("should have a count function.", function() {
    should.throws(() => controller.count(), "Method not implemented.");
  });

  it("should have a validate function.", function() {
    should.throws(
      () => controller.validate(new Phase()),
      "Method not implemented."
    );
  });

  it("should have a save function.", function() {
    should.throws(
      () => controller.save(new Phase()),
      "Method not implemented."
    );
  });

  it("should have a deleteById function.", function() {
    should.throws(() => controller.deleteById(""), "Method not implemented.");
  });
});
