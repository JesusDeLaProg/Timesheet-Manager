import { Container } from "inversify";
import moment from "moment";
import { Types } from "mongoose";
import "reflect-metadata";
import should from "should";

import Models from "../../constants/symbols/models";
import { ProjectType } from "../../constants/enums/project-type";
import { UserRole } from "../../constants/enums/user-role";
import { ModelModule } from "../../infrastructure/database/testing";
import { TimesheetController } from "../timesheet";
import {
  TimesheetModel,
  ProjectModel,
  ClientModel,
  PhaseModel,
  ActivityModel,
  UserModel
} from "../../interfaces/models";
import {
  IViewTimesheet,
  IViewUser,
  IViewProject,
  IViewPhase,
  IViewActivity
} from "../../../../types/viewmodels";
import { StringId, ITimesheetLine } from "../../../../types/datamodels";

function validUser(): IViewUser {
  return {
    _id: undefined,
    username: "test",
    firstName: "Test",
    lastName: "Test",
    email: "test@test.com",
    isActive: true,
    role: UserRole.Everyone,
    billingGroups: [
      {
        projectType: ProjectType.Public,
        timeline: [
          {
            begin: new Date(1970, 0, 1),
            end: new Date(2000, 0, 1),
            jobTitle: "Ingénieur junior",
            rate: 100
          },
          {
            begin: new Date(2000, 0, 2),
            end: undefined,
            jobTitle: "Ingénieur",
            rate: 125
          }
        ]
      },
      {
        projectType: ProjectType.Prive,
        timeline: [
          {
            begin: new Date(1970, 0, 1),
            end: new Date(2000, 0, 1),
            jobTitle: "Ingénieur junior",
            rate: 200
          },
          {
            begin: new Date(2000, 0, 2),
            end: undefined,
            jobTitle: "Ingénieur",
            rate: 250
          }
        ]
      }
    ]
  };
}

function validTimesheet(
  user: IViewUser,
  projects: IViewProject[],
  phases: IViewPhase[],
  activities: IViewActivity[],
  i: number
): IViewTimesheet {
  return {
    _id: undefined,
    user: user._id,
    begin: moment(new Date())
      .add(i * 7, "days")
      .toDate(),
    end: moment(new Date())
      .add(i * 7 + 6, "days")
      .toDate(),
    lines: [
      {
        project: projects[i]._id,
        phase: phases[i]._id,
        activity: activities[i]._id,
        entries: [
          {
            date: moment(new Date())
              .add(i * 7, "days")
              .toDate(),
            time: 1
          },
          {
            date: moment(new Date())
              .add(i * 7 + 1, "days")
              .toDate(),
            time: 1
          },
          {
            date: moment(new Date())
              .add(i * 7 + 2, "days")
              .toDate(),
            time: 1
          },
          {
            date: moment(new Date())
              .add(i * 7 + 3, "days")
              .toDate(),
            time: 1
          },
          {
            date: moment(new Date())
              .add(i * 7 + 4, "days")
              .toDate(),
            time: 1
          },
          {
            date: moment(new Date())
              .add(i * 7 + 5, "days")
              .toDate(),
            time: 1
          },
          {
            date: moment(new Date())
              .add(i * 7 + 6, "days")
              .toDate(),
            time: 1
          }
        ]
      }
    ],
    roadsheetLines: [
      {
        project: projects[i]._id,
        travels: [
          {
            date: moment(new Date())
              .add(i * 7, "days")
              .toDate(),
            distance: 1,
            from: "Bureau",
            to: "McDo",
            expenses: [
              {
                amount: 100,
                description: "Parking"
              }
            ]
          }
        ]
      }
    ]
  };
}

export default function buildTestSuite() {
  describe(TimesheetController.name, function() {
    let Timesheet: TimesheetModel;
    let Project: ProjectModel;
    let Client: ClientModel;
    let Phase: PhaseModel;
    let Activity: ActivityModel;
    let User: UserModel;
    let controller: TimesheetController;

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
      User = container.get(Models.User);
    });

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

    async function createProjects(number: number) {
      const id = new Types.ObjectId();
      const testClient = await new Client({
        _id: id,
        name: "TestClient"
      }).save();
      const projects = [];
      for (let i = 1; i <= number; ++i) {
        projects.push(
          new Project({
            code: `PROJ${i}`,
            name: `Test${i}`,
            client: testClient._id,
            type: ProjectType.Public,
            isActive: true
          })
        );
      }
      for (const proj of projects) {
        await proj.save();
      }
      return projects;
    }

    async function createTimesheets(number: number) {
      const activities = await createActivities(number);
      const phases = await createPhases(number);
      for (const ph of phases) {
        ph.activities = activities.map((act) => act._id);
        await ph.save();
      }
      const projects = await createProjects(number);
      const testUser = new User(validUser());
      testUser.plainTextPassword = "password";
      await testUser.save();
      const timesheets = [];
      for (let i = 0; i < number; ++i) {
        timesheets.push(
          new Timesheet(
            validTimesheet(testUser, projects, phases, activities, i)
          )
        );
      }
      for (const timesheet of timesheets) {
        await timesheet.save();
      }
      return timesheets;
    }

    this.afterEach(async function() {
      await Timesheet.deleteMany({});
      await Project.deleteMany({});
      await Client.deleteMany({});
      await Phase.deleteMany({});
      await Activity.deleteMany({});
      await User.deleteMany({});
    });

    it("should have a getById function.", async function() {
      const timesheets = await createTimesheets(1);
      const user = await User.findById(timesheets[0].user);
      const result = await controller.getById(timesheets[0]._id, user!._id);
      should(result.success).be.true();
      should(result.result).match({ _id: timesheets[0]._id });
    });

    it("should have a getAll function.", async function() {
      const timesheets = await createTimesheets(3);
      const result = await controller.getAll();
      should(result.success).be.true();
      should(result.result).have.length(3);
      should((result.result as IViewTimesheet[])[2]).match({
        _id: timesheets[2]._id
      });
    });

    it("should have a count function.", async function() {
      await createTimesheets(3);
      const result = await controller.count();
      should(result.success).be.true();
      should(result.result).equal(3);
    });

    it("should have a validate function.", async function() {
      const projects = await createProjects(3);
      const phases = await createPhases(3);
      const activities = await createActivities(3);
      for (const ph of phases) {
        ph.activities = activities.map((act) => act._id);
        await ph.save();
      }
      const testUser = new User(validUser());
      testUser.plainTextPassword = "password";
      await testUser.save();
      const result = await controller.validate(
        validTimesheet(testUser, projects, phases, activities, 0),
        testUser._id
      );
      should(result.success).be.true();
      should(result.result).be.null();
      const originalTimesheet = (await new Timesheet(
        validTimesheet(testUser, projects, phases, activities, 0)
      ).save()).toObject() as IViewTimesheet;
      originalTimesheet.lines[0].project = projects[1]._id;
      originalTimesheet.lines[0].phase = phases[1]._id;
      originalTimesheet.lines[0].activity = activities[1]._id;
      should(
        (await controller.validate(originalTimesheet, testUser._id)).success
      ).be.true();
    });

    it("should have a save function.", async function() {
      const projects = await createProjects(3);
      const phases = await createPhases(3);
      const activities = await createActivities(3);
      for (const ph of phases) {
        ph.activities = activities.map((act) => act._id);
        await ph.save();
      }
      const testUser = new User(validUser());
      testUser.plainTextPassword = "password";
      await testUser.save();
      const results = [
        await controller.save(
          validTimesheet(testUser, projects, phases, activities, 0),
          testUser._id
        ),
        await controller.save(
          validTimesheet(testUser, projects, phases, activities, 1),
          testUser._id
        )
      ];
      should(results).match([{ success: true }, { success: true }]);
      should(await Timesheet.find({})).match([
        {
          lines: [
            {
              project: projects[0]._id,
              phase: phases[0]._id,
              activity: activities[0]._id
            }
          ]
        },
        {
          lines: [
            {
              project: projects[1]._id,
              phase: phases[1]._id,
              activity: activities[1]._id
            }
          ]
        }
      ]);
    });

    it("should have a getAllByUserId function.", async function() {
      const timesheets = await createTimesheets(3);
      const user = await User.findById(timesheets[0].user);
      const otherUser = new User(validUser());
      otherUser.username = "otheruser";
      otherUser.plainTextPassword = "password";
      await otherUser.save();
      const results = [
        await controller.getAllByUserId(timesheets[0].user, user!._id),
        await controller.getAllByUserId(otherUser._id, otherUser._id)
      ];
      should(results).match([{ success: true }, { success: true }]);
      should(results[0].result).have.length(3);
      should(results[1].result).have.length(0);
    });

    it("should have a getByIdPopulated function.", async function() {
      const projects = await createProjects(1);
      const phases = await createPhases(1);
      const activities = await createActivities(1);
      for (const ph of phases) {
        ph.activities = activities.map((act) => act._id);
        await ph.save();
      }
      const testUser = new User(validUser());
      testUser.plainTextPassword = "password";
      await testUser.save();
      const timesheet = await new Timesheet(
        validTimesheet(testUser, projects, phases, activities, 0)
      ).save();
      const expectedTimesheet = timesheet.toObject() as IViewTimesheet<
        StringId,
        ITimesheetLine<IViewProject>
      >;
      expectedTimesheet.lines[0].project = projects[0].toObject();
      const result = await controller.getByIdPopulated(
        expectedTimesheet._id,
        testUser._id
      );
      should(result).match({
        success: true,
        result: expectedTimesheet
      });
    });
  });
}
