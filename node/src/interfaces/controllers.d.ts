import { Document, Error } from "mongoose";
import { IViewInterface, IViewActivity, IViewPhase, IViewClient, IViewProject, IViewTimesheet, IViewUser, ICrudResult } from "../../../types/viewmodels";
import { StringId, ITimesheetLine, IRoadsheetLine } from "../../../types/datamodels";

export interface QueryOptions {
    sort?: string;
    skip?: number;
    limit?: number;
}

declare type JwtSignedToken = string;

export interface IAuthController {
    login(username: string, password: string): Promise<ICrudResult<JwtSignedToken>>;
}

export interface IController<T extends IViewInterface> {
    getById(id: StringId): Promise<ICrudResult<T>>;
    getAll(options?: QueryOptions): Promise<ICrudResult<T[]>>;
    count(): Promise<ICrudResult<number>>;
    validate(input: T): Promise<ICrudResult<Error.ValidationError>>;
    save(input: T): Promise<ICrudResult<T | Error.ValidationError>>;
}

export interface IActivityController extends IController<IViewActivity> {}

export interface IPhaseController extends IController<IViewPhase> {
    getAllPopulated(options?: QueryOptions): Promise<ICrudResult<IViewPhase<IViewActivity>[]>>;
}

export interface IClientController extends IController<IViewClient> {
    getAllByName(name: string, options?: QueryOptions): Promise<ICrudResult<IViewClient[]>>;
}

export interface IProjectController extends IController<IViewProject> {
    getAllByCode(code: string, options?: QueryOptions): Promise<ICrudResult<IViewProject[]>>;
}

export interface ITimesheetController extends IController<IViewTimesheet> {
    getAllByUserId(userId: StringId, options?: QueryOptions): Promise<ICrudResult<IViewTimesheet[]>>;
    getByIdPopulated(id: StringId): Promise<ICrudResult<IViewTimesheet<StringId, ITimesheetLine<IViewProject>>>>;
    save(input: IViewTimesheet, authenticatedUserId?: StringId): Promise<ICrudResult<IViewTimesheet | Error.ValidationError>>;
    validate(input: IViewTimesheet, authenticatedUserId?: StringId): Promise<ICrudResult<Error.ValidationError>>;
}

export interface IUserController extends IController<IViewUser> {
    save(input: IViewUser, authenticatedUserId?: StringId): Promise<ICrudResult<IViewUser | Error.ValidationError>>;
    validate(input: IViewUser, authenticatedUserId?: StringId): Promise<ICrudResult<Error.ValidationError>>;
}
