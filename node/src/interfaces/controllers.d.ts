import { Document, Error, Types } from "mongoose";

import { JWTPayload } from "./routers";
import { IViewInterface, IViewActivity, IViewPhase, IViewClient, IViewProject, IViewTimesheet, IViewUser, ICrudResult } from "../../../types/viewmodels";
import { StringId, ITimesheetLine, IRoadsheetLine } from "../../../types/datamodels";

export interface QueryOptions {
    sort?: string;
    skip?: number;
    limit?: number;
}

declare type JwtSignedToken = string;
declare type ObjectId = StringId | Types.ObjectId;

export interface IAuthController {
    login(username: string, password: string): Promise<ICrudResult<JwtSignedToken>>;
    createJWT(payload: JWTPayload): JwtSignedToken;
}

export interface IController<T extends IViewInterface> {
    getById(authenticatedUserId: ObjectId, id: ObjectId): Promise<ICrudResult<T>>;
    getAll(authenticatedUserId: ObjectId, options?: QueryOptions): Promise<ICrudResult<T[]>>;
    count(authenticatedUserId: ObjectId): Promise<ICrudResult<number>>;
    validate(authenticatedUserId: ObjectId, input: T): Promise<ICrudResult<Error.ValidationError>>;
    save(authenticatedUserId: ObjectId, input: T): Promise<ICrudResult<T | Error.ValidationError>>;
}

export interface IActivityController extends IController<IViewActivity> {}

export interface IPhaseController extends IController<IViewPhase> {
    getAllPopulated(authenticatedUserId: ObjectId, options?: QueryOptions): Promise<ICrudResult<IViewPhase<IViewActivity>[]>>;
}

export interface IClientController extends IController<IViewClient> {
    getAllByName(authenticatedUserId: ObjectId, name: string, options?: QueryOptions): Promise<ICrudResult<IViewClient[]>>;
}

export interface IProjectController extends IController<IViewProject> {
    getAllByCode(authenticatedUserId: ObjectId, code: string, options?: QueryOptions): Promise<ICrudResult<IViewProject[]>>;
}

export interface ITimesheetController extends IController<IViewTimesheet> {
    getAllByUserId(authenticatedUserId: ObjectId, options?: QueryOptions): Promise<ICrudResult<IViewTimesheet[]>>;
    getByIdPopulated(authenticatedUserId: ObjectId, id: ObjectId): Promise<ICrudResult<IViewTimesheet<ObjectId, ITimesheetLine<IViewProject>>>>;
    countByUserId(authenticatedUserId: ObjectId, userId: ObjectId): Promise<ICrudResult<number>>;
}

export interface IUserController extends IController<IViewUser> {
    save(authenticatedUserId: ObjectId, input: IViewUser): Promise<ICrudResult<IViewUser | Error.ValidationError>>;
    validate(authenticatedUserId: ObjectId, input: IViewUser): Promise<ICrudResult<Error.ValidationError>>;
}
