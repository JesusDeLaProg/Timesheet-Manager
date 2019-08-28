// Type definitions for Timesheet Manager's Data Models
// Project : Timesheet Manager
// Definitions by : Maxime Charland

import * as DataModels from "./datamodels";

export interface CrudResult<T = any> {
    success: boolean;
    message?: string;
    result?: T;
}

interface IViewInterface {
    _id: DataModels.StringId;
}

export type IViewActivity = DataModels.IActivity & IViewInterface;

export type IViewPhase<TActivity = any> = DataModels.IPhase<TActivity> & IViewInterface;

export type IViewClient = DataModels.IClient & IViewInterface;

export type IViewProject<TClient = any> = DataModels.IProject<TClient> & IViewInterface;

export type IViewTimesheet<
TUser = any,
TTimesheetLine = DataModels.ITimesheetLine,
TRoadsheetLine = DataModels.IRoadsheetLine> = DataModels.ITimesheet<TUser, TTimesheetLine, TRoadsheetLine> & IViewInterface;

export type IViewUser = DataModels.IUser & IViewInterface;
