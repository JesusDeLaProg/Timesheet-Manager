// Type definitions for Timesheet Manager's Data Models
// Project : Timesheet Manager
// Definitions by : Maxime Charland

export type IProjectType = "Public" | "Privé";
export type IUserRole = 1 | 2 | 3 | 4;

export type StringId = string;

export interface IBillingRate {
    begin: Date;
    end?: Date;
    rate: number;
    jobTitle: string;
}

export interface IBillingGroup {
    projectType: IProjectType;
    timeline: IBillingRate[];
}

export interface IUser {
    username: string;
    firstName: string;
    lastName: string;
    role: IUserRole;
    email: string;
    password?: string;
    billingGroups: IBillingGroup[];
    isActive: boolean;
}

export interface IActivity {
    code: string;
    name: string;
}

export interface IPhase<TActivity = StringId> {
    code: string;
    name: string;
    activities: TActivity[];
}

export interface IClient {
    name: string;
}

export interface IProject<TClient = StringId> {
    code: string;
    name: string;
    client: TClient;
    type: IProjectType;
    isActive: boolean;
}

export interface ITimesheet<
TUser = StringId,
TTimesheetLine = ITimesheetLine,
TRoadsheetLine = IRoadsheetLine> {
    user: TUser;
    begin: Date;
    end: Date;
    lines: TTimesheetLine[];
    roadsheetLines: TRoadsheetLine[];
}

export interface ITimesheetLine<
TProject = StringId,
TPhase = StringId,
TActivity = StringId> {
    project: TProject;
    phase: TPhase;
    activity: TActivity;
    divers?: string;
    entries: ITimesheetEntry[];
}

export interface ITimesheetEntry {
    date: Date;
    time: number;
}

export interface IRoadsheetLine<TProject = StringId> {
    project: TProject;
    travels: ITravel[];
}

export interface ITravel {
    date: Date;
    from: string;
    to: string;
    distance: number;
    expenses: IExpense[];
}

export interface IExpense {
    description: string;
    amount: number;
}
