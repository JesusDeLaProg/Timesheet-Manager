import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { ProjectController } from "../index";
import { ProjectModel } from "../../../interfaces/models";

export default function buildTestSuite() {
  describe(ProjectController.name, function() {
    let Project: ProjectModel;
    let controller: ProjectController;

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<ProjectController>(ProjectController).toSelf();
      controller = container.get(ProjectController);
      Project = container.get(Models.Project);
    });

    it("should have a getById function.", function() {
      should.throws(() => controller.getById(""), "Method not implemented.");
    });

    it("should have a getAll function.", function() {
      should.throws(() => controller.getAll(), "Method not implemented.");
    });

    it("should have a getAllByCode function.", function() {
      should.throws(
        () => controller.getAllByCode(""),
        "Method not implemented."
      );
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
}
