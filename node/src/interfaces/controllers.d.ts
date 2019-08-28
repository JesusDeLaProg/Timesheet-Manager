import { Document, Error } from "mongoose";
import { IViewInterface, IViewActivity, IViewPhase, IViewClient, IViewProject, IViewTimesheet, IViewUser, CrudResult } from "../../../types/viewmodels";
import { StringId, ITimesheetLine, IRoadsheetLine } from "../../../types/datamodels";

export interface QueryOptions {
    sort?: string;
    skip?: number;
    limit?: number;
}

declare type JwtSignedToken = string;

export interface IAuthController {
    login(username: string, password: string): Promise<CrudResult<JwtSignedToken>>;
}

export interface IController<T extends IViewInterface> {
    getById(id: StringId): Promise<CrudResult<T>>;
    getAll(options?: QueryOptions): Promise<CrudResult<T[]>>;
    count(): Promise<CrudResult<number>>;
    validate(document: T): Promise<CrudResult<Error.ValidationError>>;
    save(document: T): Promise<CrudResult<T | Error.ValidationError>>;
    deleteById(id: StringId): Promise<CrudResult>;
}

export interface IActivityController extends IController<IViewActivity> {}

export interface IPhaseController extends IController<IViewPhase> {
    getAllPopulated(options?: QueryOptions): Promise<CrudResult<IViewPhase<IViewActivity>[]>>;
}

export interface IClientController extends IController<IViewClient> {
    getAllByName(name: string, options?: QueryOptions): Promise<CrudResult<IViewClient[]>>;
}

export interface IProjectController extends IController<IViewProject> {
    getAllByCode(code: string, options?: QueryOptions): Promise<CrudResult<IViewProject[]>>;
}

export interface ITimesheetController extends IController<IViewTimesheet> {
    getAllByUserId(userId: StringId, options?: QueryOptions): Promise<CrudResult<IViewTimesheet[]>>;
    getByIdPopulated(id: StringId): Promise<CrudResult<IViewTimesheet<StringId, ITimesheetLine<IViewProject>>[]>>;
}

export interface IUserController extends IController<IViewUser> {
    validate(document: IViewUser, authenticatedUserId?: StringId): Promise<CrudResult<Error.ValidationError>>;
}
