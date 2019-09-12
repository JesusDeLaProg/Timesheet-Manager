import { Document, model, Schema, Types } from "mongoose";
import should from "should";

import { AbstractController } from "../index";

interface IAbstractObject {
  name: string;
}

const schema = new Schema({
  name: String
});
const Model = model<IAbstractObject & Document>("Model", schema);

class TestAbstractController extends AbstractController<
  { _id: any } & IAbstractObject
> {
  constructor() {
    super(Model);
  }
}

export default function buildTestSuite() {
  describe(AbstractController.name, function() {
    let controller: TestAbstractController;

    this.beforeEach(async function() {
      controller = new TestAbstractController();
      await Model.deleteMany({});
    });

    it("should have a getById function.", async function() {
      const id = new Types.ObjectId();
      await new Model({ _id: id, name: "first" }).save();
      const result = await controller.getById(id.toHexString());
      should(result.success).be.true();
      should(result.result).match({ name: "first" });
    });

    it("should have a getAll function.", async function() {
      let models = [
        new Model({ name: "first" }),
        new Model({ name: "second" }),
        new Model({ name: "third" })
      ];
      for (const m of models) {
        await m.save();
      }
      const result = await controller.getAll();
      should(result.success).be.true();
      const array = result.result as IAbstractObject[];
      should(array).have.length(3);
      for (const item of array) {
        should(models.length).not.equal(0);
        models = models.filter((m) => m.name !== item.name);
      }
      should(models).be.empty();
    });

    it("should have a count function.", async function() {
      const models = [
        new Model({ name: "first" }),
        new Model({ name: "second" }),
        new Model({ name: "third" })
      ];
      for (const m of models) {
        await m.save();
      }
      should((await controller.count()).result).equal(3);
    });

    it("should have a validate function.", async function() {
      const id = new Types.ObjectId();
      await new Model({ _id: id, name: "Test" }).save();
      should(
        (await controller.validate({ _id: undefined, name: "Testeee" })).success
      ).be.true();
      should(
        (await controller.validate({ _id: id, name: "Testeee" })).success
      ).be.true();
    });

    it("should have a save function.", async function() {
      const result = await controller.save({ _id: undefined, name: "Test" });
      should(result.success).be.true();
      should(result.result).match({ name: "Test" });
      should((await Model.find({}))[0].name).equal("Test");
    });
  });
}
