import { Document, Error } from "mongoose";
import { StringId, ITimesheetLine, IRoadsheetLine } from "../../../types/datamodels";
import { ClientDocument, ActivityDocument, PhaseDocument, ProjectDocument, TimesheetDocument, UserDocument } from "./models";

export interface QueryOptions {
    sort?: string;
    skip?: number;
    limit?: number;
}

export interface CrudResult<T = any> {
    success: boolean;
    message?: string;
    result?: T;
}

declare type JwtSignedToken = string;

export interface IAuthController {
    login(username: string, password: string): CrudResult<JwtSignedToken>;
}

export interface IController<T extends Document> {
    getById(id: StringId): CrudResult<T>;
    getAll(options?: QueryOptions): CrudResult<T[]>;
    count(): CrudResult<number>;
    validate(document: T): CrudResult<Error.ValidationError>;
    save(document: T): CrudResult<T | Error.ValidationError>;
    deleteById(id: StringId): CrudResult;
}

export interface IActivityController extends IController<ActivityDocument> {}

export interface IPhaseController extends IController<PhaseDocument> {
    getAllPopulated(options?: QueryOptions): CrudResult<PhaseDocument<ActivityDocument>[]>;
}

export interface IClientController extends IController<ClientDocument> {
    getAllByName(name: string, options?: QueryOptions): CrudResult<ClientDocument[]>;
}

export interface IProjectController extends IController<ProjectDocument> {
    getAllByCode(code: string, options?: QueryOptions): CrudResult<ProjectDocument[]>;
}

export interface ITimesheetController extends IController<TimesheetDocument> {
    getAllByUserId(userId: StringId, options?: QueryOptions): CrudResult<TimesheetDocument[]>;
    getByIdPopulated(id: StringId): CrudResult<TimesheetDocument<StringId, ITimesheetLine<ProjectDocument>>[]>;
}

export interface IUserController extends IController<UserDocument> {}
