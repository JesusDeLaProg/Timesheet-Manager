// Type definitions for Timesheet Manager's Data Models
// Project : Timesheet Manager
// Definitions by : Maxime Charland

declare type StringId = string;

export interface IUser {
    nomUsager: string;
    prenom: string;
    nom: string;
    role: number;
    courriel: string;
    motDePasse?: string;
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
    fees: number;
    method: string;
    isActive: boolean;
}

export interface ITimesheet<
TUser = StringId,
TTimesheetLine = ITimesheetLine,
TRoadsheetLine = StringId> {
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
