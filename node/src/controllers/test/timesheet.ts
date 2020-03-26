import { Container } from "inversify";
import "reflect-metadata";
import should from "should";

import Models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import { TimesheetController } from "../timesheet";
import {
  TimesheetModel,
  ProjectModel,
  ClientModel,
  PhaseModel,
  ActivityModel
} from "../../interfaces/models";
import {
  IViewTimesheet,
  IViewProject,
  IViewActivity,
  IViewPhase,
  IViewClient,
  IViewUser
} from "../../../../types/viewmodels";
import {
  createClients,
  createProjects,
  createActivities,
  createPhases,
  createTimesheets,
  defaultUsers,
  setupDatabase,
  createControllerTests,
  createUsers,
  compareIds
} from "./abstract";
import moment from "moment";
import { UserRole } from "../../constants/enums/user-role";

function moveTimesheet(
  timesheet: IViewTimesheet,
  amount: number,
  unit: "days" | "weeks"
) {
  timesheet.begin = moment(timesheet.begin)
    .add(amount, unit)
    .toDate();
  timesheet.end = moment(timesheet.end)
    .add(amount, unit)
    .toDate();
  timesheet.lines = timesheet.lines.map(
    (l) => (
      (l.entries = l.entries.map(
        (e) => (
          (e.date = moment(e.date)
            .add(amount, unit)
            .toDate()),
          e
        )
      )),
      l
    )
  );
}

export default function buildTestSuite() {
  describe(TimesheetController.name, function() {
    let Timesheet: TimesheetModel;
    let Project: ProjectModel;
    let Client: ClientModel;
    let Phase: PhaseModel;
    let Activity: ActivityModel;
    let controller: TimesheetController;

    let activities: IViewActivity[];
    let phases: IViewPhase[];
    let clients: IViewClient[];
    let projects: IViewProject[];
    let timesheets: IViewTimesheet[];
    let otherUser: IViewUser;

    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      container.bind<TimesheetController>(TimesheetController).toSelf();
      controller = container.get(TimesheetController);
      Timesheet = container.get(Models.Timesheet);
      Project = container.get(Models.Project);
      Client = container.get(Models.Client);
      Phase = container.get(Models.Phase);
      Activity = container.get(Models.Activity);
    });

    this.beforeEach(async function() {
      clients = createClients(Array(5).fill({}));
      projects = createProjects(
        Array(5)
          .fill({})
          .map((_, i) => ({ client: clients[i]._id }))
      );
      activities = createActivities(Array(10).fill({}));
      phases = createPhases(
        Array(5)
          .fill({})
          .map((_, i) => ({
            activities: activities
              .slice(Math.floor(i / 2), Math.floor(i / 2) + 2)
              .map((a) => a._id)
          }))
      );
      otherUser = createUsers([{ role: UserRole.Everyone }])[0];
      const users = [...defaultUsers, otherUser];
      timesheets = createTimesheets(
        Array(users.length)
          .fill({})
          .map((_, i) => ({
            user: users[i]._id,
            lines: [
              {
                project: projects[i]._id,
                phase: phases[i]._id,
                activity: phases[i].activities[0],
                entries: Array(7)
                  .fill({})
                  .map((_, i) => ({
                    date: moment(new Date())
                      .startOf("week")
                      .add(i, "days")
                      .toDate(),
                    time: 1
                  }))
              }
            ]
          }))
      );
      await setupDatabase(
        {
          activities,
          phases,
          clients,
          projects,
          timesheets,
          users
        },
        false
      );
    });

    this.afterEach(async function() {
      await Timesheet.deleteMany({});
      await Project.deleteMany({});
      await Client.deleteMany({});
      await Phase.deleteMany({});
      await Activity.deleteMany({});
    });

    for (const user of defaultUsers) {
      describe(`Logged in as ${user.username}`, function() {
        let inputSaveCreate: IViewTimesheet;

        createControllerTests(() => controller, user, {
          getById: () => ({
            id: timesheets.slice(-1)[0]._id,
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin
            ],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, timesheets.slice(-1)[0], {
                  _id: compareIds(timesheets.slice(-1)[0]._id)
                })
              )
          }),
          getAll: () => ({
            options: {},
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin
            ],
            verify: (res) => should(res.result!.length).equal(timesheets.length)
          }),
          count: () => ({
            allowedRoles: [
              UserRole.Subadmin,
              UserRole.Admin,
              UserRole.Superadmin
            ],
            verify: (res) => should(res.result).equal(timesheets.length)
          }),
          validateCreate: () => {
            const input = JSON.parse(
              JSON.stringify(timesheets.slice(-1)[0])
            ) as IViewTimesheet;
            moveTimesheet(input, 1, "weeks");
            input._id = undefined;
            return {
              input,
              allowedRoles: [UserRole.Admin, UserRole.Superadmin],
              verify: (res) => should(res.result).be.null()
            };
          },
          validateUpdate: () => ({
            input: JSON.parse(JSON.stringify(timesheets.slice(-1)[0])),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) => should(res.result).be.null()
          }),
          saveCreate: () => {
            inputSaveCreate = JSON.parse(
              JSON.stringify(timesheets.slice(-1)[0])
            ) as IViewTimesheet;
            moveTimesheet(inputSaveCreate, 1, "weeks");
            delete inputSaveCreate._id;
            return {
              input: inputSaveCreate,
              allowedRoles: [UserRole.Admin, UserRole.Superadmin],
              verify: (res) =>
                should(res.result).match(
                  Object.assign({}, inputSaveCreate, {
                    user: compareIds(inputSaveCreate.user),
                    lines: inputSaveCreate.lines.map((l) =>
                      Object.assign({}, l, {
                        _id: compareIds((l as any)._id),
                        activity: compareIds(l.activity),
                        phase: compareIds(l.phase),
                        project: compareIds(l.project),
                        entries: l.entries.map((e) =>
                          Object.assign({}, e, {
                            _id: compareIds((e as any)._id)
                          })
                        )
                      })
                    )
                  })
                )
            };
          },
          saveUpdate: () => ({
            input: JSON.parse(JSON.stringify(timesheets.slice(-1)[0])),
            allowedRoles: [UserRole.Admin, UserRole.Superadmin],
            verify: (res) =>
              should(res.result).match(
                Object.assign({}, timesheets.slice(-1)[0], {
                  _id: compareIds(timesheets.slice(-1)[0]._id)
                })
              )
          })
        });

        it("getAllByUserId", async function() {
          try {
            const res = await controller.getAllByUserId(
              user._id,
              timesheets.slice(-1)[0].user
            );
            should(res.result).match([
              Object.assign({}, timesheets.slice(-1)[0], {
                _id: compareIds(timesheets.slice(-1)[0]._id),
                user: compareIds(timesheets.slice(-1)[0].user),
                lines: timesheets.slice(-1)[0].lines.map((l) =>
                  Object.assign({}, l, {
                    _id: compareIds((l as any)._id),
                    activity: compareIds(l.activity),
                    phase: compareIds(l.phase),
                    project: compareIds(l.project),
                    entries: l.entries.map((e) =>
                      Object.assign({}, e, { _id: compareIds((e as any)._id) })
                    )
                  })
                )
              })
            ]);
            should(res.success).be.true();
          } catch (err) {
            if (err.success === undefined) throw err;
            should(user.role).equals(UserRole.Everyone);
            should(err.success).be.false();
            should(err.result).match({ code: 403 });
          }
        });

        it("countByUserId", async function() {
          try {
            const res = await controller.countByUserId(
              user._id,
              timesheets.slice(-1)[0].user
            );
            should(res.result).equals(1);
            should(res.success).be.true();
          } catch (err) {
            if (err.success === undefined) throw err;
            should(user.role).equals(UserRole.Everyone);
            should(err.success).be.false();
            should(err.result).match({ code: 403 });
          }
        });
      });
    }
  });
}
