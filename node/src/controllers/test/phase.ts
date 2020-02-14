import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { PhaseController } from "../phase";
import { PhaseModel, ActivityModel } from "../../interfaces/models";
import {
  IViewPhase,
  IViewActivity,
  ICrudResult
} from "../../../../types/viewmodels";
import {
  createPhases,
  createActivities,
  defaultUsers,
  setupDatabase,
  createControllerTests
} from "./abstract";
import { AllUserRoles, UserRole } from "node/src/constants/enums/user-role";

export default function buildTestSuite() {
  describe(PhaseController.name, function() {
    let Activity: ActivityModel;
    let Phase: PhaseModel;
    let controller: PhaseController;

    let activities: IViewActivity[];
    let phases: IViewPhase[];

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<PhaseController>(PhaseController).toSelf();
      controller = container.get(PhaseController);
      Activity = container.get(Models.Activity);
      Phase = container.get(Models.Phase);
    });

    this.beforeEach(async function() {
      activities = createActivities(Array(6));
      phases = createPhases(Array(6)).map((ph, i, arr) => {
        const j = i <= arr.length / 2 ? 0 : 3;
        ph.activities = activities
          .slice(j, j + 3)
          .map((act) => act._id.toString());
        return ph;
      });
      await setupDatabase(
        {
          users: defaultUsers,
          activities,
          phases
        },
        false
      );
    });

    this.afterEach(async function() {
      await Phase.deleteMany({});
      await Activity.deleteMany({});
    });

    for (const user of defaultUsers) {
      describe(`Logged in as ${user.username}`, function() {
        const inputValidateCreate = JSON.parse(JSON.stringify(phases[2]));
        const inputSaveCreate = JSON.parse(JSON.stringify(phases[2]));

        createControllerTests(controller, user, {
          getById: {
            id: phases[4]._id,
            allowedRoles: AllUserRoles,
            verify: (res) => should(res.result).match(phases[4])
          },
          getAll: {
            options: {},
            allowedRoles: AllUserRoles,
            verify: (res) => should(res.result).match(phases)
          },
          count: {
            allowedRoles: AllUserRoles,
            verify: (res) => should(res.result).match(phases)
          },
          validateCreate: {
            input: inputValidateCreate,
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null(),
            verifyFail: (res: ICrudResult<any>) =>
              should(res.result!.code).equal(403)
          },
          validateUpdate: {
            input: JSON.parse(JSON.stringify(phases[3])),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null(),
            verifyFail: (res: ICrudResult<any>) =>
              should(res.result!.code).equal(403)
          },
          saveCreate: {
            input: inputSaveCreate,
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).match(inputSaveCreate),
            verifyFail: (res: ICrudResult<any>) =>
              should(res.result!.code).equal(403)
          },
          saveUpdate: {
            input: JSON.parse(JSON.stringify(phases[3])),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).match(phases[3]),
            verifyFail: (res: ICrudResult<any>) =>
              should(res.result!.code).equal(403)
          }
        });

        it("getAllPopulated", async function() {
          const objectsToMatch = phases.map((ph) => {
            const phase: IViewPhase<IViewActivity> = Object.assign({}, ph, {
              activities: ph.activities.map((actId) =>
                activities.find((a) => a._id === actId)
              )
            } as { activities: IViewActivity[] });
            return phase;
          });
          const result = await controller.getAllPopulated(user._id, {});
          should(result.success).be.true();
          should(result.result).match(objectsToMatch);
        });
      });
    }
  });
}
