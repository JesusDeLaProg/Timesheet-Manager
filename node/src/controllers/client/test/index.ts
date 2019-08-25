import "reflect-metadata";
import "../../../infrastructure/database/testing";

import should from "should";
import { model, Schema } from "mongoose";

import { ClientController } from "../index";
import { ClientDocument } from "../../../interfaces/models";

// TODO : Inject ClientController
const schema = new Schema({
  name: String
});
const Client = model<ClientDocument>("Client", schema);

describe(ClientController.name, function() {
  let controller: ClientController;

  this.beforeAll(function() {
    controller = new ClientController(Client);
  });

  it("should have a getById function.", function() {
    should.throws(() => controller.getById(""), "Method not implemented.");
  });

  it("should have a getAll function.", function() {
    should.throws(() => controller.getAll(), "Method not implemented.");
  });

  it("should have a getAllByName function.", function() {
    should.throws(() => controller.getAllByName(""), "Method not implemented.");
  });

  it("should have a count function.", function() {
    should.throws(() => controller.count(), "Method not implemented.");
  });

  it("should have a validate function.", function() {
    should.throws(
      () => controller.validate(new Client()),
      "Method not implemented."
    );
  });

  it("should have a save function.", function() {
    should.throws(
      () => controller.save(new Client()),
      "Method not implemented."
    );
  });

  it("should have a deleteById function.", function() {
    should.throws(() => controller.deleteById(""), "Method not implemented.");
  });
});
