if (!Reflect.hasOwnMetadata) {
  require("reflect-metadata");
}
import "../../../infrastructure/database/testing";

import should from "should";
import { model, Schema } from "mongoose";

import { ProjectController } from "../index";
import { ProjectDocument } from "../../../interfaces/models";

// TODO : Inject ProjectController
const schema = new Schema({
  name: String
});
const Project = model<ProjectDocument>("Project", schema);

describe(ProjectController.name, function() {
  let controller: ProjectController;

  this.beforeAll(function() {
    controller = new ProjectController(Project);
  });

  it("should have a getById function.", function() {
    should.throws(() => controller.getById(""), "Method not implemented.");
  });

  it("should have a getAll function.", function() {
    should.throws(() => controller.getAll(), "Method not implemented.");
  });

  it("should have a getAllByCode function.", function() {
    should.throws(() => controller.getAllByCode(""), "Method not implemented.");
  });

  it("should have a count function.", function() {
    should.throws(() => controller.count(), "Method not implemented.");
  });

  it("should have a validate function.", function() {
    should.throws(
      () => controller.validate(new Project()),
      "Method not implemented."
    );
  });

  it("should have a save function.", function() {
    should.throws(
      () => controller.save(new Project()),
      "Method not implemented."
    );
  });

  it("should have a deleteById function.", function() {
    should.throws(() => controller.deleteById(""), "Method not implemented.");
  });
});
