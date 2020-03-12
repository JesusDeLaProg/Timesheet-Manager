import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { PhaseController } from "../phase";
import { PhaseModel, ActivityModel } from "../../interfaces/models";
import { IViewPhase, IViewActivity } from "../../../../types/viewmodels";
import {
  createPhases,
  createActivities,
  defaultUsers,
  setupDatabase,
  createControllerTests,
  compareIds
} from "./abstract";
import { AllUserRoles, UserRole } from "../../constants/enums/user-role";

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
                    _id: compareIds(a)
                  }))
                })
              )
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
                      _id: compareIds(a)
                    }))
                  })
                )
              )
          }),
          count: () => ({
            allowedRoles: AllUserRoles,
            verify: (res) => should(res.result).equals(phases.length)
          }),
          validateCreate: () => ({
            input: inputValidateCreate,
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null()
          }),
          validateUpdate: () => ({
            input: JSON.parse(JSON.stringify(phases[3])),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null()
          }),
          saveCreate: () => ({
            input: inputSaveCreate,
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, inputSaveCreate, {
                  activities: inputSaveCreate.activities.map((a) => ({
                    _id: compareIds(a)
                  }))
                })
              )
          }),
          saveUpdate: () => ({
            input: JSON.parse(JSON.stringify(phases[3])),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, phases[3], {
                  _id: compareIds(phases[3]._id),
                  activities: phases[3].activities.map((a) => ({
                    _id: compareIds(a)
                  }))
                })
              )
          })
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
          should(result.result).match(
            objectsToMatch.map((p) =>
              Object.assign({}, p, {
                _id: compareIds(p._id),
                activities: p.activities.map((a) =>
                  Object.assign({}, a, { _id: compareIds(a._id) })
                )
              })
            )
          );
        });
      });
    }
  });
}
