import { ObjectId } from "bson";
import { Express } from "express";
import { Server } from "http";
import { Container } from "inversify";
import moment from "moment";
import "reflect-metadata";
import should from "should";
import { SuperAgent } from "superagent";
import supertest, { Test } from "supertest";

import { TimesheetRouter } from "../timesheet";
import {
  IViewActivity,
  IViewPhase,
  IViewProject,
  IViewTimesheet,
  IViewUser
} from "../../../../types/viewmodels";
import { ProjectType } from "../../constants/enums/project-type";
import { UserRole } from "../../constants/enums/user-role";
import models from "../../constants/symbols/models";
import { ModelModule } from "../../infrastructure/database/testing";
import {
  ActivityModel,
  ClientModel,
  PhaseModel,
  ProjectModel,
  TimesheetModel,
  UserModel
} from "../../interfaces/models";

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

export default function buildTestSuite(
  appFactory: () => Express,
  baseUrl: string
) {
  let app: Express;
  let server: Server;
  let agent: SuperAgent<Test>;
  let Activity: ActivityModel;
  let Phase: PhaseModel;
  let Client: ClientModel;
  let Project: ProjectModel;
  let Timesheet: TimesheetModel;
  let User: UserModel;

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
    const id = new ObjectId();
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
        new Timesheet(validTimesheet(testUser, projects, phases, activities, i))
      );
    }
    for (const timesheet of timesheets) {
      await timesheet.save();
    }
    return timesheets;
  }

  describe(TimesheetRouter.name, function() {
    this.beforeAll(function() {
      const container = new Container();
      container.load(ModelModule);
      Activity = container.get(models.Activity);
      Phase = container.get(models.Phase);
      Client = container.get(models.Client);
      Project = container.get(models.Project);
      Timesheet = container.get(models.Timesheet);
      User = container.get(models.User);
    });

    this.beforeEach(async function() {
      app = appFactory();
      server = app.listen(3000);
      agent = supertest.agent(app);
      const authResponse = await agent
        .post("/api/auth/login")
        .send({ username: "admin", password: "admin" });
      agent.jar.setCookies(authResponse.get("Set-Cookie"));
    });

    this.afterEach(async function() {
      if (server) {
        server.close();
      }
      await Promise.all([
        Timesheet.deleteMany({}),
        Project.deleteMany({}),
        Client.deleteMany({}),
        Phase.deleteMany({}),
        Activity.deleteMany({}),
        User.deleteMany({ username: { $ne: "admin" } })
      ]);
    });

    it("should have GET /", async function() {
      const timesheet = (await createTimesheets(1))[0];
      const response = await agent
        .get(baseUrl + "/")
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: [JSON.parse(JSON.stringify(timesheet))],
        success: true
      });
    });

    it("should have GET /:id", async function() {
      const timesheet = (await createTimesheets(1))[0];
      const response = await agent
        .get(baseUrl + `/${timesheet.id}`)
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: JSON.parse(JSON.stringify(timesheet)),
        success: true
      });
    });

    it("should have GET /byUserId/:id", async function() {
      const timesheet = (await createTimesheets(1))[0];
      const response = await agent
        .get(baseUrl + `/byUserId/${timesheet.user}`)
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: [JSON.parse(JSON.stringify(timesheet))],
        success: true
      });
    });

    it("should have GET /populated/:id", async function() {
      const timesheet = (await createTimesheets(1))[0];
      const expectedTimesheet = JSON.parse(
        JSON.stringify(timesheet)
      ) as IViewTimesheet;
      expectedTimesheet.lines = await Promise.all(
        expectedTimesheet.lines.map(async (line) => {
          line.project = JSON.parse(
            JSON.stringify(await Project.findById(line.project))
          );
          return line;
        })
      );
      const response = await agent
        .get(baseUrl + `/populated/${timesheet.id}`)
        .set("Accept", "application/json")
        .send()
        .expect(200);
      should(response.body).match({
        message: "",
        result: expectedTimesheet,
        success: true
      });
    });

    it("should have POST /validate", async function() {
      const activities = await createActivities(3);
      const phases = await createPhases(3);
      for (const ph of phases) {
        ph.activities = activities.map((act) => act.id);
        await ph.save();
      }
      const projects = await createProjects(3);
      const user = new User(validUser());
      user.plainTextPassword = "password";
      await user.save();
      const timesheet = validTimesheet(user, projects, phases, activities, 0);
      const response = await agent
        .post(baseUrl + "/validate")
        .set("Accept", "application/json")
        .send(timesheet)
        .expect(200);
      should(response.body).match({
        message: "",
        result: null,
        success: true
      });
    });

    it("should have POST /save", async function() {
      const activities = await createActivities(3);
      const phases = await createPhases(3);
      for (const ph of phases) {
        ph.activities = activities.map((act) => act.id);
        await ph.save();
      }
      const projects = await createProjects(3);
      const user = new User(validUser());
      user.plainTextPassword = "password";
      await user.save();
      const timesheet = validTimesheet(user, projects, phases, activities, 0);
      const response = await agent
        .post(baseUrl + "/save")
        .set("Accept", "application/json")
        .send(timesheet)
        .expect(200);
      timesheet.begin = moment(timesheet.begin)
        .startOf("day")
        .toDate();
      timesheet.end = moment(timesheet.end)
        .startOf("day")
        .toDate();
      timesheet.lines = timesheet.lines.map((line) => {
        line.entries = line.entries.map((entry) => {
          entry.date = moment(entry.date)
            .startOf("day")
            .toDate();
          return entry;
        });
        return line;
      });
      timesheet.roadsheetLines = timesheet.roadsheetLines.map((line) => {
        line.travels = line.travels.map((travel) => {
          travel.date = moment(travel.date)
            .startOf("day")
            .toDate();
          return travel;
        });
        return line;
      });
      const expectedTimesheet = JSON.parse(
        JSON.stringify(timesheet)
      ) as IViewTimesheet;
      should(response.body).match({
        message: "",
        success: true
      });
      const resultTimesheet = response.body.result as IViewTimesheet;
      should(resultTimesheet).match(expectedTimesheet);
    });
  });
}
