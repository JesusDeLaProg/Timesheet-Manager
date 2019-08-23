if (!Reflect.hasOwnMetadata) {
  require("reflect-metadata");
}
import "../../../infrastructure/database/testing";

import should from "should";
import { model, Schema } from "mongoose";

import { TimesheetController } from "../index";
import { TimesheetDocument } from "../../../interfaces/models";

// TODO : Inject TimesheetController
const schema = new Schema({
  name: String
});
const Timesheet = model<TimesheetDocument>("Timesheet", schema);

describe(TimesheetController.name, function() {
  let controller: TimesheetController;

  this.beforeAll(function() {
    controller = new TimesheetController(Timesheet);
  });

  it("should have a getById function.", function() {
    should.throws(() => controller.getById(""), "Method not implemented.");
  });

  it("should have a getAll function.", function() {
    should.throws(() => controller.getAll(), "Method not implemented.");
  });

  it("should have a getAllByUserId function.", function() {
    should.throws(
      () => controller.getAllByUserId(""),
      "Method not implemented."
    );
  });

  it("should have a getByIdPopulated function.", function() {
    should.throws(
      () => controller.getByIdPopulated(""),
      "Method not implemented."
    );
  });

  it("should have a count function.", function() {
    should.throws(() => controller.count(), "Method not implemented.");
  });

  it("should have a validate function.", function() {
    should.throws(
      () => controller.validate(new Timesheet()),
      "Method not implemented."
    );
  });

  it("should have a save function.", function() {
    should.throws(
      () => controller.save(new Timesheet()),
      "Method not implemented."
    );
  });

  it("should have a deleteById function.", function() {
    should.throws(() => controller.deleteById(""), "Method not implemented.");
  });
});
