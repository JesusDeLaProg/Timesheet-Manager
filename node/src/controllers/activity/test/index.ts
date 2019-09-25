import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { ActivityController } from "../index";
import { ActivityModel } from "../../../interfaces/models";
import { Types } from "mongoose";
import { IViewActivity } from "../../../../../types/viewmodels";

export default function buildTestSuite() {
  describe(ActivityController.name, function() {
    let Activity: ActivityModel;
    let controller: ActivityController;

    async function createActivities(number: number) {
      const activities = [];
      for (let i = 1; i <= number; ++i) {
        activities.push(new Activity({ code: `ACT${i}`, name: `Test${i}` }));
      }
      for (const act of activities) {
        await act.save();
      }
    }

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<ActivityController>(ActivityController).toSelf();
      controller = container.get(ActivityController);
      Activity = container.get(Models.Activity);
    });

    this.afterEach(async function() {
      await Activity.deleteMany({});
    });

    it("should have a getById function.", async function() {
      const id = new Types.ObjectId();
      await new Activity({
        _id: id,
        code: "AA",
        name: "Test"
      }).save();
      const result = await controller.getById(id.toHexString());
      should(result.success).be.true();
      should(result.result).match({ code: "AA", name: "Test" });
    });

    it("should have a getAll function.", async function() {
      await createActivities(3);
      const result = await controller.getAll();
      should(result.success).be.true();
      should(result.result).have.length(3);
      should((result.result as IViewActivity[])[2]).match({
        code: "ACT3",
        name: "Test3"
      });
    });

    it("should have a count function.", async function() {
      await createActivities(3);
      const result = await controller.count();
      should(result.success).be.true();
      should(result.result).equal(3);
    });

    it("should have a validate function.", async function() {
      const result = await controller.validate({
        _id: undefined,
        code: "ACT",
        name: "Test"
      });
      should(result.success).be.true();
      should(result.result).be.null();
      const id = new Types.ObjectId();
      await new Activity({ _id: id, code: "ACT1", name: "Test1" }).save();
      should(
        (await controller.validate({ _id: id, code: "ACT", name: "Test" }))
          .success
      ).be.true();
    });

    it("should have a save function.", async function() {
      const results = [
        await controller.save({ _id: undefined, code: "ACT1", name: "Test1" }),
        await controller.save({ _id: undefined, code: "ACT2", name: "Test2" })
      ];
      should(results).match([{ success: true }, { success: true }]);
      should(await Activity.find({})).match([
        { code: "ACT1", name: "Test1" },
        { code: "ACT2", name: "Test2" }
      ]);
    });
  });
}
