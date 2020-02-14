import {
  IViewUser,
  IViewActivity,
  IViewPhase,
  IViewProject,
  IViewTimesheet,
  IViewClient,
  IViewInterface,
  ICrudResult
} from "types/viewmodels";
import { Container } from "inversify";
import { ModelModule } from "../../infrastructure/database/models";
import Models from "../../constants/symbols/models";
import {
  ActivityModel,
  ClientModel,
  PhaseModel,
  ProjectModel,
  TimesheetModel,
  UserModel,
  UserDocument
} from "../../interfaces/models";
import { UserRole } from "../../constants/enums/user-role";
import { ProjectType } from "../../constants/enums/project-type";
import moment from "moment";
import { Error as MongooseError } from "mongoose";
import { ITimesheetLine, IRoadsheetLine, IUserRole } from "types/datamodels";
import { IController, QueryOptions } from "node/src/interfaces/controllers";
import should from "should";

const container = new Container();
container.load(ModelModule);
const Activity = container.get<ActivityModel>(Models.Activity);
const Client = container.get<ClientModel>(Models.Client);
const Phase = container.get<PhaseModel>(Models.Phase);
const Project = container.get<ProjectModel>(Models.Project);
const Timesheet = container.get<TimesheetModel>(Models.Timesheet);
const User = container.get<UserModel>(Models.User);

export interface IDatabaseState {
  activities: IViewActivity[];
  clients: IViewClient[];
  phases: IViewPhase[];
  projects: IViewProject[];
  timesheets: IViewTimesheet[];
  users: IViewUser[];
}

export async function clearDatabase() {
  await Promise.all([
    Activity.deleteMany({}),
    Client.deleteMany({}),
    Phase.deleteMany({}),
    Project.deleteMany({}),
    Timesheet.deleteMany({}),
    User.deleteMany({})
  ]);
}

export function setupDatabase(
  databaseState: Partial<IDatabaseState>
): Promise<UserDocument>;
export function setupDatabase(
  databaseState: Partial<IDatabaseState>,
  createAdmin: false
): Promise<undefined>;
export async function setupDatabase(
  databaseState: Partial<IDatabaseState>,
  createAdmin = true
) {
  await clearDatabase();

  if (databaseState.activities) {
    for (const act of databaseState.activities) {
      await new Activity(act).save();
    }
  }
  if (databaseState.phases) {
    for (const phase of databaseState.phases) {
      await new Phase(phase).save();
    }
  }
  if (databaseState.clients) {
    for (const client of databaseState.clients) {
      await new Client(client).save();
    }
  }
  if (databaseState.projects) {
    for (const project of databaseState.projects) {
      await new Project(project).save();
    }
  }
  if (databaseState.users) {
    for (const user of databaseState.users) {
      const userDoc = new User(user);
      if (!userDoc.password) {
        await userDoc.setPassword(generateRandomString(10));
      }
      await userDoc.save();
    }
  }
  if (databaseState.timesheets) {
    for (const timesheet of databaseState.timesheets) {
      await new Timesheet(timesheet).save();
    }
  }

  if (createAdmin) {
    const admin = new User({
      username: "admin",
      firstName: "admin",
      lastName: "admin",
      email: "admin@timesheet-manager.com",
      role: UserRole.Superadmin,
      isActive: true,
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
    });
    await admin.save();
    return admin;
  }
  return undefined;
}

function generateRandomString(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  return Array(length)
    .map((_) => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}

export function createActivities(activities: Partial<IViewActivity>[]) {
  return activities.map((act) => {
    const base = {} as IViewActivity;
    if (act._id) base._id = act._id;
    base.code = act.code === undefined ? generateRandomString(4) : act.code;
    base.name = act.name === undefined ? generateRandomString(8) : act.name;
    return new Activity(base).toJSON() as IViewActivity;
  });
}

export function createClients(clients: Partial<IViewClient>[]) {
  return clients.map((client) => {
    const base = {} as IViewClient;
    if (client._id) base._id = client._id;
    base.name =
      client.name === undefined ? generateRandomString(8) : client.name;
    return new Client(base).toJSON() as IViewClient;
  });
}

export function createPhases(phases: Partial<IViewPhase>[]) {
  return phases.map((phase) => {
    const base = {} as IViewPhase;
    if (phase._id) base._id = phase._id;
    base.code = phase.code === undefined ? generateRandomString(4) : phase.code;
    base.name = phase.name === undefined ? generateRandomString(8) : phase.name;
    base.activities = [];
    return new Phase(base).toJSON() as IViewPhase;
  });
}

export function createProjects(projects: Partial<IViewProject>[]) {
  return projects.map((project) => {
    const base = {} as IViewProject;
    if (project._id) base._id = project._id;
    base.code =
      project.code === undefined ? generateRandomString(4) : project.code;
    base.client = project.client as string;
    base.isActive =
      project.isActive === undefined
        ? Math.random() * 2 > 1
          ? true
          : false
        : project.isActive;
    base.name =
      project.name === undefined ? generateRandomString(8) : project.name;
    base.type =
      project.type === undefined
        ? Math.random() * 2 > 1
          ? ProjectType.Prive
          : ProjectType.Public
        : project.type;
    return new Project(base).toJSON() as IViewProject;
  });
}

export function createTimesheets(timesheets: Partial<IViewTimesheet>[]) {
  return timesheets.map((timesheet) => {
    const base = {} as IViewTimesheet;
    if (timesheet._id) base._id = timesheet._id;
    base.begin =
      timesheet.begin === undefined
        ? moment(new Date())
            .startOf("week")
            .toDate()
        : timesheet.begin;
    base.end =
      timesheet.end === undefined
        ? moment(new Date())
            .endOf("week")
            .toDate()
        : timesheet.end;
    base.user = timesheet.user as string;
    base.lines = timesheet.lines as ITimesheetLine[];
    base.roadsheetLines = timesheet.roadsheetLines as IRoadsheetLine[];
    return new Timesheet(base).toJSON() as IViewTimesheet;
  });
}

export function createUsers(users: Partial<IViewUser>[]) {
  return users.map((user) => {
    const base = {} as IViewUser;
    if (user._id) base._id = user._id;
    base.username =
      user.username === undefined ? generateRandomString(10) : user.username;
    base.firstName =
      user.firstName === undefined ? generateRandomString(10) : user.firstName;
    base.lastName =
      user.lastName === undefined ? generateRandomString(10) : user.lastName;
    base.isActive =
      user.isActive === undefined
        ? Math.random() * 2 > 1
          ? true
          : false
        : user.isActive;
    base.email =
      user.email === undefined
        ? generateRandomString(10) + "@" + generateRandomString(10) + ".com"
        : user.email;
    base.role =
      user.role === undefined
        ? (Math.ceil(Math.random() * 4) as IUserRole)
        : user.role;
    if (user.billingGroups) {
      base.billingGroups = user.billingGroups;
    } else {
      base.billingGroups = [
        {
          projectType: ProjectType.Prive,
          timeline: [
            {
              begin: new Date(1970, 1, 1),
              jobTitle: generateRandomString(10),
              rate: +(Math.random() * 100).toFixed(2)
            }
          ]
        }
      ];
    }
    return new User(base).toJSON() as IViewUser;
  });
}

export const defaultUsers = createUsers([
  { username: "Everyone", role: UserRole.Everyone },
  { username: "Subadmin", role: UserRole.Subadmin },
  { username: "Admin", role: UserRole.Admin },
  { username: "Superadmin", role: UserRole.Superadmin }
]);

interface Authorization {
  allowedRoles: UserRole[];
}

export interface ControllerTestOptions<T> {
  getById?: {
    // ID to get
    id: string;
    verify: (res: ICrudResult<T>) => void;
    verifyFail?: (failRes: ICrudResult<null>) => void;
  } & Authorization;
  getAll?: {
    // Options to give to getAll
    options: QueryOptions;
    verify: (res: ICrudResult<T[]>) => void;
    verifyFail?: (failRes: ICrudResult<null>) => void;
  } & Authorization;
  count?: {
    verify: (res: ICrudResult<number>) => void;
    verifyFail?: (failRes: ICrudResult<null>) => void;
  } & Authorization;
  validateUpdate?: {
    input: T;
    verify: (res: ICrudResult<MongooseError.ValidationError>) => void;
    verifyFail?: (failRes: ICrudResult<null>) => void;
  } & Authorization;
  validateCreate?: {
    input: T;
    verify: (res: ICrudResult<MongooseError.ValidationError>) => void;
    verifyFail?: (failRes: ICrudResult<null>) => void;
  } & Authorization;
  saveUpdate?: {
    input: T;
    verify: (res: ICrudResult<T | MongooseError.ValidationError>) => void;
    verifyFail?: (failRes: ICrudResult<null>) => void;
  } & Authorization;
  saveCreate?: {
    input: T;
    verify: (res: ICrudResult<T | MongooseError.ValidationError>) => void;
    verifyFail?: (failRes: ICrudResult<null>) => void;
  } & Authorization;
}

export function createControllerTests<T extends IViewInterface>(
  controller: IController<T>,
  user: IViewUser,
  options: ControllerTestOptions<T>
) {
  describe("Controllers tests", function() {
    if (options.getById) {
      it("getById", async function() {
        try {
          const result = await controller.getById(
            user._id,
            options.getById!.id
          );
          should(result.success).be.true();
          options.getById!.verify(result);
        } catch (err) {
          should(options.getById!.verifyFail).not.be.null();
          should(err.success).be.false();
          options.getById!.verifyFail!(err);
        }
      });
    }

    if (options.getAll) {
      it("getAll", async function() {
        try {
          const result = await controller.getAll(
            user._id,
            options.getAll!.options
          );
          should(result.success).be.true();
          options.getAll!.verify(result);
        } catch (err) {
          should(options.getAll!.verifyFail).not.be.null();
          should(err.success).be.false();
          options.getAll!.verifyFail!(err);
        }
      });
    }

    if (options.count) {
      it("count", async function() {
        try {
          const result = await controller.count(user._id);
          should(result.success).be.true();
          options.count!.verify(result);
        } catch (err) {
          should(options.count!.verifyFail).not.be.null();
          should(err.success).be.false();
          options.count!.verifyFail!(err);
        }
      });
    }

    if (options.validateCreate) {
      it("validate create", async function() {
        try {
          const result = await controller.validate(
            user._id,
            options.validateCreate!.input
          );
          should(user.role).equalOneOf(options.validateCreate!.allowedRoles);
          should(result.success).be.true();
          options.validateCreate!.verify(result);
        } catch (err) {
          should(err.success).be.false();
          should(user.role).not.equalOneOf(
            options.validateCreate!.allowedRoles
          );
          options.validateCreate!.verifyFail!(err);
        }
      });
    }

    if (options.validateUpdate) {
      it("validate update", async function() {
        try {
          const result = await controller.validate(
            user._id,
            options.validateUpdate!.input
          );
          should(result.success).be.true();
          should(user.role).equalOneOf(options.validateUpdate!.allowedRoles);
          options.validateUpdate!.verify(result);
        } catch (err) {
          should(err.success).be.false();
          should(user.role).not.equalOneOf(
            options.validateUpdate!.allowedRoles
          );
          options.validateUpdate!.verifyFail!(err);
        }
      });
    }

    if (options.saveCreate) {
      it("save create", async function() {
        try {
          const result = await controller.save(
            user._id,
            options.saveCreate!.input
          );
          should(result.success).be.true();
          should(user.role).equalOneOf(options.saveCreate!.allowedRoles);
          options.saveCreate!.verify(result);
        } catch (err) {
          should(err.success).be.false();
          should(user.role).not.equalOneOf(options.saveCreate!.allowedRoles);
          options.saveCreate!.verifyFail!(err);
        }
      });
    }

    if (options.saveUpdate) {
      it("save update", async function() {
        try {
          const result = await controller.save(
            user._id,
            options.saveUpdate!.input
          );
          should(result.success).be.true();
          should(user.role).equalOneOf(options.saveUpdate!.allowedRoles);
          options.saveUpdate!.verify(result);
        } catch (err) {
          should(err.success).be.false();
          should(user.role).not.equalOneOf(options.saveUpdate!.allowedRoles);
          options.saveUpdate!.verifyFail!(err);
        }
      });
    }
  });
}
