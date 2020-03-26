// Type definitions for Timesheet Manager's Data Models
// Project : Timesheet Manager
// Definitions by : Maxime Charland

import * as DataModels from "./datamodels";

export interface ICrudResult<T = any> {
    success: boolean;
    message: string;
    result: T | null;
}

interface IViewInterface {
    _id: any;
}

export type IViewActivity = DataModels.IActivity & IViewInterface;

export type IViewPhase<TActivity = DataModels.StringId> = DataModels.IPhase<TActivity> & IViewInterface;

export type IViewClient = DataModels.IClient & IViewInterface;

export type IViewProject<TClient = DataModels.StringId> = DataModels.IProject<TClient> & IViewInterface;

export type IViewTimesheet<
TUser = DataModels.StringId,
TTimesheetLine = DataModels.ITimesheetLine,
TRoadsheetLine = DataModels.IRoadsheetLine> = DataModels.ITimesheet<TUser, TTimesheetLine, TRoadsheetLine> & IViewInterface;

export type IViewUser = DataModels.IUser & IViewInterface;
