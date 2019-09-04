import "../../../infrastructure/database/testing";

import { ContainerModule } from "inversify";
import { Document, model, Schema } from "mongoose";
import should from "should";

import { AbstractController } from "../index";

const schema = new Schema({
  name: String
});
const Model = model("Model", schema);

class TestAbstractController extends AbstractController<Document> {
  constructor() {
    super(Model);
  }
}

export default function buildTestSuite() {
  describe(AbstractController.name, function() {
    let controller: TestAbstractController;

    this.beforeAll(function() {
      controller = new TestAbstractController();
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

    it("should have a count function.", function() {
      should.throws(
        async () => await controller.count(),
        "Method not implemented."
      );
    });

    it("should have a validate function.", function() {
      should.throws(
        async () => await controller.validate(new Model()),
        "Method not implemented."
      );
    });

    it("should have a save function.", function() {
      should.throws(
        async () => await controller.save(new Model()),
        "Method not implemented."
      );
    });
  });
}