import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import { IViewActivity, IViewPhase } from "../../../../types/viewmodels";
import { AllUserRoles, UserRole } from "../../constants/enums/user-role";
import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { ActivityModel, PhaseModel } from "../../interfaces/models";
import { PhaseController } from "../phase";
import {
  compareIds,
  createActivities,
  createControllerTests,
  createPhases,
  defaultUsers,
  setupDatabase,
} from "./abstract";

export default function buildTestSuite() {
  describe(PhaseController.name, function PhaseControllerTest() {
    let Activity: ActivityModel;
    let Phase: PhaseModel;
    let controller: PhaseController;

    let activities: IViewActivity[];
    let phases: IViewPhase[];

    this.beforeAll(() => {
      const container = new Container();
      container.load(ModelModule);
      container.bind<PhaseController>(PhaseController).toSelf();
      controller = container.get(PhaseController);
      Activity = container.get(Models.Activity);
      Phase = container.get(Models.Phase);
    });

    this.beforeEach(async () => {
      activities = createActivities(Array(6).fill({}));
      phases = createPhases(Array(6).fill({})).map((ph, i, arr) => {
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
          phases,
        },
        false
      );
    });

    this.afterEach(async () => {
      await Phase.deleteMany({});
      await Activity.deleteMany({});
    });

    for (const user of defaultUsers) {
      describe(`Logged in as ${user.username}`, () => {
        const inputValidateCreate = createPhases([{}])[0];
        delete inputValidateCreate._id;
        const inputSaveCreate = createPhases([{}])[0];
        delete inputSaveCreate._id;

        createControllerTests(() => controller, user, {
          getById: () => ({
            id: phases[4]._id,
            allowedRoles: AllUserRoles,
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, phases[4], {
                  _id: compareIds(phases[4]._id),
                  activities: phases[4].activities.map((a) => ({
                    _id: compareIds(a),
                  })),
                })
              ),
          }),
          getAll: () => ({
            options: {},
            allowedRoles: AllUserRoles,
            verify: (res) =>
              should(res.result).match(
                phases.map((p) =>
                  Object.assign({}, p, {
                    _id: compareIds(p._id),
                    activities: p.activities.map((a) => ({
                      _id: compareIds(a),
                    })),
                  })
                )
              ),
          }),
          count: () => ({
            allowedRoles: AllUserRoles,
            verify: (res) => should(res.result).equals(phases.length),
          }),
          validateCreate: () => ({
            input: inputValidateCreate,
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null(),
          }),
          validateUpdate: () => ({
            input: JSON.parse(JSON.stringify(phases[3])),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null(),
          }),
          saveCreate: () => ({
            input: inputSaveCreate,
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, inputSaveCreate, {
                  activities: inputSaveCreate.activities.map((a) => ({
                    _id: compareIds(a),
                  })),
                })
              ),
          }),
          saveUpdate: () => ({
            input: JSON.parse(JSON.stringify(phases[3])),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, phases[3], {
                  _id: compareIds(phases[3]._id),
                  activities: phases[3].activities.map((a) => ({
                    _id: compareIds(a),
                  })),
                })
              ),
          }),
        });

        it("getAllPopulated", async () => {
          const objectsToMatch = phases.map((ph) => {
            const phase: IViewPhase<IViewActivity> = Object.assign({}, ph, {
              activities: ph.activities.map((actId) =>
                activities.find((a) => a._id === actId)
              ),
            } as { activities: IViewActivity[] });
            return phase;
          });
          const result = await controller.getAllPopulated(user._id, {});
          should(result.success).be.true();
          should(result.result).match(
            objectsToMatch.map((p) =>
              Object.assign({}, p, {
                _id: compareIds(p._id),
                activities: p.activities.map((a) =>
                  Object.assign({}, a, { _id: compareIds(a._id) })
                ),
              })
            )
          );
        });
      });
    }
  });
}
