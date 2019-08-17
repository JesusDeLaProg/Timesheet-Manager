// Type definitions for Timesheet Manager's Data Models
// Project : Timesheet Manager
// Definitions by : Maxime Charland

import * as DataModels from "./datamodels";

interface IViewInterface {
    _id: StringId;
}

export type IViewActivity =  DataModels.IActivity & IViewInterface;
export type IViewPhase =     DataModels.IPhase & IViewInterface;
export type IViewClient =    DataModels.IClient & IViewInterface;
export type IViewProject =   DataModels.IProject & IViewInterface;
export type IViewTimesheet = DataModels.ITimesheet & IViewInterface;
export type IViewUser =      DataModels.IUser & IViewInterface;