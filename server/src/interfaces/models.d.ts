import { Document, Model } from "mongoose";
import DataModels from "../../../types/datamodels";

export interface IUserExt {
  // Instance methods
  setPassword(plainTextPassword: string): Promise<void>;
  checkPassword(password: string): Promise<boolean>;
}

export type UserDocument = DataModels.IUser & IUserExt & Document;

export type ActivityDocument = DataModels.IActivity & Document;

export type PhaseDocument<TActivity = DataModels.StringId> = DataModels.IPhase<
  TActivity
> &
  Document;

export type ProjectDocument<
  TClient = DataModels.StringId
> = DataModels.IProject<TClient> & Document;

export type ClientDocument = DataModels.IClient & Document;

export type TimesheetDocument<
  TUser = DataModels.StringId,
  TTimesheetLine = DataModels.ITimesheetLine,
  TRoadsheetLine = DataModels.IRoadsheetLine
> = DataModels.ITimesheet<TUser, TTimesheetLine, TRoadsheetLine> & Document;

export type UserModel = Model<UserDocument>;

export type ActivityModel = Model<ActivityDocument>;

export type PhaseModel<TActivity = DataModels.StringId> = Model<
  PhaseDocument<TActivity>
>;

export type ProjectModel<TClient = DataModels.StringId> = Model<
  ProjectDocument<TClient>
>;

export type ClientModel = Model<ClientDocument>;

export type TimesheetModel<
  TUser = DataModels.StringId,
  TTimesheetLine = DataModels.ITimesheetLine,
  TRoadsheetLine = DataModels.IRoadsheetLine
> = Model<TimesheetDocument<TUser, TTimesheetLine, TRoadsheetLine>>;
