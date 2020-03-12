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
      const actDoc = new Activity(act);
      await actDoc.save();
      act._id = actDoc._id + "";
    }
  }
  if (databaseState.phases) {
    for (const phase of databaseState.phases) {
      const phaseDoc = new Phase(phase);
      await phaseDoc.save();
      phase._id = phaseDoc._id + "";
    }
  }
  if (databaseState.clients) {
    for (const client of databaseState.clients) {
      const clientDoc = new Client(client);
      await clientDoc.save();
      client._id = clientDoc._id + "";
    }
  }
  if (databaseState.projects) {
    for (const project of databaseState.projects) {
      const projDoc = new Project(project);
      await projDoc.save();
      project._id = projDoc._id + "";
    }
  }
  if (databaseState.users) {
    for (const user of databaseState.users) {
      const userDoc = new User(user);
      if (!userDoc.password) {
        await userDoc.setPassword(generateRandomString(10));
        user.password = userDoc.password;
      }
      await userDoc.save();
      user._id = userDoc._id + "";
    }
  }
  if (databaseState.timesheets) {
    for (const timesheet of databaseState.timesheets) {
      const timesheetDoc = new Timesheet(timesheet);
      await timesheetDoc.save();
      timesheet._id = timesheetDoc._id + "";
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
    .fill(null)
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
    base.activities = phase.activities || [];
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
            .startOf("week")
            .add(6, "days")
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
              begin: new Date(1970, 0, 1),
              jobTitle: generateRandomString(10),
              rate: +(Math.random() * 100).toFixed(2)
            }
          ]
        },
        {
          projectType: ProjectType.Public,
          timeline: [
            {
              begin: new Date(1970, 0, 1),
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

interface VerifyCallbacks<T> {
  verify: (res: ICrudResult<T>) => void;
  verifyFail?: (res: ICrudResult<Error>) => void;
}

export interface ControllerTestOptions<T> {
  getById: () => {
    // ID to get
    id: string;
  } & VerifyCallbacks<T> &
    Authorization;
  getAll: () => {
    // Options to give to getAll
    options: QueryOptions;
  } & VerifyCallbacks<T[]> &
    Authorization;
  count: () => VerifyCallbacks<number> & Authorization;
  validateUpdate: () => {
    input: T;
  } & VerifyCallbacks<MongooseError.ValidationError> &
    Authorization;
  validateCreate: () => {
    input: T;
  } & VerifyCallbacks<MongooseError.ValidationError> &
    Authorization;
  saveUpdate: () => {
    input: T;
  } & VerifyCallbacks<T | MongooseError.ValidationError> &
    Authorization;
  saveCreate: () => {
    input: T;
  } & VerifyCallbacks<T | MongooseError.ValidationError> &
    Authorization;
}

export function createControllerTests<T extends IViewInterface>(
  controller: () => IController<T>,
  user: IViewUser,
  options: Partial<ControllerTestOptions<T>>
) {
  describe("Controllers tests", function() {
    if (options.getById) {
      it("getById", async function() {
        const opt = options.getById!();
        let result;
        try {
          result = await controller().getById(user._id, opt.id);
          should(user.role).equalOneOf(opt.allowedRoles);
          should(result.success).be.true();
          opt!.verify(result);
        } catch (err) {
          handleTestError(user, opt, err);
        }
      });
    }

    if (options.getAll) {
      it("getAll", async function() {
        const opt = options.getAll!();
        try {
          const result = await controller().getAll(user._id, opt.options);
          should(user.role).equalOneOf(opt.allowedRoles);
          should(result.success).be.true();
          opt.verify(result);
        } catch (err) {
          handleTestError(user, opt, err);
        }
      });
    }

    if (options.count) {
      it("count", async function() {
        const opt = options.count!();
        try {
          const result = await controller().count(user._id);
          should(user.role).equalOneOf(opt.allowedRoles);
          should(result.success).be.true();
          opt.verify(result);
        } catch (err) {
          handleTestError(user, opt, err);
        }
      });
    }

    if (options.validateCreate) {
      it("validate create", async function() {
        const opt = options.validateCreate!();
        try {
          const result = await controller().validate(user._id, opt.input);
          should(user.role).equalOneOf(opt.allowedRoles);
          should(result.success).be.true();
          opt.verify(result);
        } catch (err) {
          handleTestError(user, opt, err);
        }
      });
    }

    if (options.validateUpdate) {
      it("validate update", async function() {
        const opt = options.validateUpdate!();
        try {
          const result = await controller().validate(user._id, opt.input);
          should(result.success).be.true();
          should(user.role).equalOneOf(opt.allowedRoles);
          opt.verify(result);
        } catch (err) {
          handleTestError(user, opt, err);
        }
      });
    }

    if (options.saveCreate) {
      it("save create", async function() {
        const opt = options.saveCreate!();
        try {
          const result = await controller().save(user._id, opt.input);
          should(result.success).be.true();
          should(user.role).equalOneOf(opt.allowedRoles);
          opt.verify(result);
        } catch (err) {
          handleTestError(user, opt, err);
        }
      });
    }

    if (options.saveUpdate) {
      it("save update", async function() {
        const opt = options.saveUpdate!();
        try {
          const result = await controller().save(user._id, opt.input);
          should(result.success).be.true();
          should(user.role).equalOneOf(opt.allowedRoles);
          opt.verify(result);
        } catch (err) {
          handleTestError(user, opt, err);
        }
      });
    }
  });
}

function handleTestError<T>(
  user: IViewUser,
  testOptions: Authorization & VerifyCallbacks<T>,
  error: any
) {
  // Unexpected error
  if (error.success === undefined) throw error;

  should(error.success).be.false();
  if (testOptions.allowedRoles.indexOf(user.role) === -1) {
    // Should be 403 error
    should(error.result).match({ code: 403 });
  } else {
    if (testOptions.verifyFail) {
      testOptions.verifyFail(error);
    } else {
      // No error is acceptable
      throw error;
    }
  }
}

export function compareIds(compareTo: any) {
  return (id: any) => id + "" === compareTo + "";
}
