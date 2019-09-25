import { Container } from "inversify";
import { Types } from "mongoose";
import "reflect-metadata";
import should from "should";

import Models from "../../../constants/symbols/models";
import { ModelModule } from "../../../infrastructure/database/testing";
import { PhaseController } from "../index";
import { PhaseModel, ActivityModel } from "../../../interfaces/models";
import { IViewPhase } from "../../../../../types/viewmodels";

export default function buildTestSuite() {
  describe(PhaseController.name, function() {
    let Activity: ActivityModel;
    let Phase: PhaseModel;
    let controller: PhaseController;

    async function createActivities(number: number) {
      const activities = [];
      for (let i = 1; i <= number; ++i) {
        activities.push(new Activity({ code: `ACT${i}`, name: `Test${i}` }));
      }
      for (const act of activities) {
        await act.save();
      }
      return activities;
    }

    async function createPhases(number: number) {
      const phases = [];
      for (let i = 1; i <= number; ++i) {
        phases.push(new Phase({ code: `PH${i}`, name: `Test${i}` }));
      }
      for (const ph of phases) {
        await ph.save();
      }
      return phases;
    }

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<PhaseController>(PhaseController).toSelf();
      controller = container.get(PhaseController);
      Activity = container.get(Models.Activity);
      Phase = container.get(Models.Phase);
    });

    this.afterEach(async function() {
      await Phase.deleteMany({});
      await Activity.deleteMany({});
    });

    it("should have a getById function.", async function() {
      const id = new Types.ObjectId();
      await new Phase({
        _id: id,
        code: "PH",
        name: "Test"
      }).save();
      const result = await controller.getById(id.toHexString());
      should(result.success).be.true();
      should(result.result).match({ code: "PH", name: "Test" });
    });

    it("should have a getAll function.", async function() {
      await createPhases(3);
      const result = await controller.getAll();
      should(result.success).be.true();
      should(result.result).have.length(3);
      should((result.result as IViewPhase[])[2]).match({
        code: "PH3",
        name: "Test3"
      });
    });

    it("should have a count function.", async function() {
      await createPhases(3);
      const result = await controller.count();
      should(result.success).be.true();
      should(result.result).equal(3);
    });

    it("should have a validate function.", async function() {
      const result = await controller.validate({
        _id: undefined,
        code: "PH",
        name: "Test",
        activities: []
      });
      should(result.success).be.true();
      should(result.result).be.null();
      const id = new Types.ObjectId();
      await new Phase({ _id: id, code: "PH1", name: "Test1" }).save();
      should(
        (await controller.validate({
          _id: id,
          code: "PH",
          name: "Test",
          activities: []
        })).success
      ).be.true();
    });

    it("should have a save function.", async function() {
      const results = [
        await controller.save({
          _id: undefined,
          code: "PH1",
          name: "Test1",
          activities: []
        }),
        await controller.save({
          _id: undefined,
          code: "PH2",
          name: "Test2",
          activities: []
        })
      ];
      should(results).match([{ success: true }, { success: true }]);
      should(await Phase.find({})).match([
        { code: "PH1", name: "Test1" },
        { code: "PH2", name: "Test2" }
      ]);
    });

    it("should have a getAllPopulated function.", async function() {
      const activities = await createActivities(3);
      const plainActivities = activities.map((act) => act.toObject());
      const activitiesIds = activities.map((act) => act._id);
      const phases = [
        new Phase({
          code: "PH1",
          name: "Test1",
          activities: activitiesIds
        }),
        new Phase({
          code: "PH2",
          name: "Test2",
          activities: activitiesIds
        })
      ];
      for (const phase of phases) {
        await phase.save();
      }
      const result = await controller.getAllPopulated();
      should(result).match({
        success: true,
        result: [
          { code: "PH1", name: "Test1", activities: plainActivities },
          { code: "PH2", name: "Test2", activities: plainActivities }
        ]
      });
    });
  });
}
