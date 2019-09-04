import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { TimesheetController } from "../index";
import { TimesheetModel } from "../../../interfaces/models";

export default function buildTestSuite() {
  describe(TimesheetController.name, function() {
    let Timesheet: TimesheetModel;
    let controller: TimesheetController;

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<TimesheetController>(TimesheetController).toSelf();
      controller = container.get(TimesheetController);
      Timesheet = container.get(Models.Timesheet);
    });

    it("should have a getById function.", function() {
      should.throws(
        async () => await controller.getById(""),
        "Method not implemented."
      );
    });

    it("should have a getAll function.", function() {
      should.throws(
        async () => await controller.getAll(),
        "Method not implemented."
      );
    });

    it("should have a getAllByUserId function.", function() {
      should.throws(
        async () => await controller.getAllByUserId(""),
        "Method not implemented."
      );
    });

    it("should have a getByIdPopulated function.", function() {
      should.throws(
        async () => await controller.getByIdPopulated(""),
        "Method not implemented."
      );
    });

    it("should have a count function.", function() {
      should.throws(
        async () => await controller.count(),
        "Method not implemented."
      );
    });

    it("should have a validate function.", function() {
      should.throws(
        async () => await controller.validate(new Timesheet()),
        "Method not implemented."
      );
    });

    it("should have a save function.", function() {
      should.throws(
        async () => await controller.save(new Timesheet()),
        "Method not implemented."
      );
    });
  });
}
