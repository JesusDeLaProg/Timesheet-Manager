import { Error, Types } from "mongoose";

import {
  IRoadsheetLine,
  ITimesheetLine,
  StringId,
} from "../../../types/datamodels";
import {
  ICrudResult,
  IViewActivity,
  IViewClient,
  IViewInterface,
  IViewPhase,
  IViewProject,
  IViewTimesheet,
  IViewUser,
} from "../../../types/viewmodels";
import { IJWTPayload } from "./routers";

export interface IQueryOptions {
  sort?: string;
  skip?: number;
  limit?: number;
}

declare type JwtSignedToken = string;
declare type ObjectId = StringId | Types.ObjectId;

export interface IAuthController {
  login(
    username: string,
    password: string
  ): Promise<ICrudResult<JwtSignedToken>>;
  createJWT(payload: IJWTPayload): JwtSignedToken;
}

export interface IController<T extends IViewInterface> {
  getById(authenticatedUserId: ObjectId, id: ObjectId): Promise<ICrudResult<T>>;
  getAll(
    authenticatedUserId: ObjectId,
    options?: IQueryOptions
  ): Promise<ICrudResult<T[]>>;
  count(authenticatedUserId: ObjectId): Promise<ICrudResult<number>>;
  validate(
    authenticatedUserId: ObjectId,
    input: T
  ): Promise<ICrudResult<Error.ValidationError>>;
  save(
    authenticatedUserId: ObjectId,
    input: T
  ): Promise<ICrudResult<T | Error.ValidationError>>;
}

export interface IActivityController extends IController<IViewActivity> {}

export interface IPhaseController extends IController<IViewPhase> {
  getAllPopulated(
    authenticatedUserId: ObjectId,
    options?: IQueryOptions
  ): Promise<ICrudResult<Array<IViewPhase<IViewActivity>>>>;
}

export interface IClientController extends IController<IViewClient> {
  getAllByName(
    authenticatedUserId: ObjectId,
    name: string,
    options?: IQueryOptions
  ): Promise<ICrudResult<IViewClient[]>>;
}

export interface IProjectController extends IController<IViewProject> {
  getAllByCode(
    authenticatedUserId: ObjectId,
    code: string,
    options?: IQueryOptions
  ): Promise<ICrudResult<IViewProject[]>>;
}

export interface ITimesheetController extends IController<IViewTimesheet> {
  getAllByUserId(
    authenticatedUserId: ObjectId,
    userId: ObjectId,
    options?: IQueryOptions
  ): Promise<ICrudResult<IViewTimesheet[]>>;
  getByIdPopulated(
    authenticatedUserId: ObjectId,
    id: ObjectId
  ): Promise<
    ICrudResult<IViewTimesheet<ObjectId, ITimesheetLine<IViewProject>>>
  >;
  countByUserId(
    authenticatedUserId: ObjectId,
    userId: ObjectId
  ): Promise<ICrudResult<number>>;
}

export interface IUserController extends IController<IViewUser> {
  save(
    authenticatedUserId: ObjectId,
    input: IViewUser
  ): Promise<ICrudResult<IViewUser | Error.ValidationError>>;
  validate(
    authenticatedUserId: ObjectId,
    input: IViewUser
  ): Promise<ICrudResult<Error.ValidationError>>;
}
