import { inject, injectable } from "inversify";

import { ITimesheetLine, StringId } from "../../../types/datamodels";
import {
  IViewProject,
  IViewTimesheet,
  IViewUser
} from "../../../types/viewmodels";
import { UserRole } from "../constants/enums/user-role";
import Models from "../constants/symbols/models";
import { CrudResult } from "../infrastructure/utils/crud-result";
import { HasHttpCode } from "../infrastructure/utils/has-http-code";
import {
  ITimesheetController,
  ObjectId,
  QueryOptions
} from "../interfaces/controllers";
import {
  TimesheetDocument,
  TimesheetModel,
  UserModel
} from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class TimesheetController extends AbstractController<IViewTimesheet>
  implements ITimesheetController {
  constructor(
    @inject(Models.Timesheet) private Timesheet: TimesheetModel,
    @inject(Models.User) User: UserModel
  ) {
    super(Timesheet, User);
  }

  /**
   * Returns all timesheets from owned by a given user.
   * @param {ObjectId} authenticatedUserId
   * @param {ObjectId} userId
   * @param {QueryOptions} [options]
   * @returns {Promise<CrudResult<TimesheetDocument[]>>}
   * @memberof TimesheetController
   */
  public async getAllByUserId(
    authenticatedUserId: ObjectId,
    userId: ObjectId,
    options?: QueryOptions
  ) {
    if (
      this.validateReadPermissions(
        await this.getUser(authenticatedUserId),
        await this.User.findById(userId)
      )
    ) {
      let query = this.Timesheet.find({
        user: userId
      });
      query = this.applyQueryOptions(query, options);
      const result = await query;
      return CrudResult.Success(result);
    } else {
      throw this.get403Error();
    }
  }

  /**
   * Returns a timesheet, but lines.project as documents instead of IDs.
   * @param {ObjectId} authenticatedUserId
   * @param {ObjectId} id
   * @returns {Promise<CrudResult<IViewTimesheet<string, ITimesheetLine<IViewProject>>>}
   * @memberof TimesheetController
   */
  public async getByIdPopulated(authenticatedUserId: ObjectId, id: ObjectId) {
    const query = this.Timesheet.findById(id);
    const result = ((await query.populate(
      "lines.project"
    )) as unknown) as IViewTimesheet<StringId, ITimesheetLine<IViewProject>>;
    if (!result) {
      const error = new Error(`Cannot find Timesheet with _id ${id}`);
      (error as HasHttpCode).code = 404;
      throw CrudResult.Failure(error);
    }

    if (
      this.validateReadPermissions(
        await this.getUser(authenticatedUserId),
        await this.getResourceOwner((result as unknown) as TimesheetDocument)
      )
    ) {
      return CrudResult.Success(result);
    } else {
      throw this.get403Error();
    }
  }

  /**
   * Returns the number of timesheets owned by a given user.
   * @param {ObjectId} authenticatedUserId
   * @param {StringId} userId
   * @returns {Promise<CrudResult<number>>}
   * @memberof TimesheetController
   */
  public async countByUserId(authenticatedUserId: ObjectId, userId: StringId) {
    if (
      this.validateReadPermissions(
        await this.getUser(authenticatedUserId),
        await this.User.findById(userId)
      )
    ) {
      return CrudResult.Success(
        await this.Timesheet.countDocuments({ user: userId })
      );
    } else {
      throw this.get403Error();
    }
  }

  /**
   * Returns {@link IViewTimesheet#user}.
   * @protected
   * @param {IViewTimesheet} resource
   * @returns {ObjectId}
   * @memberof TimesheetController
   */
  protected async getResourceOwner(resource: IViewTimesheet) {
    return !!resource.user ? await this.User.findById(resource.user) : null;
  }

  /**
   * Everyone can view their own timesheets.
   * Special users can view everyone's timesheets (Needed for report creation).
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof TimesheetController
   */
  protected validateReadPermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ) {
    return (
      authenticatedUser._id + "" ===
        (resourceOwner && resourceOwner._id) + "" ||
      authenticatedUser.role >= UserRole.Subadmin
    );
  }

  /**
   * Everyone can create their own timesheets.
   * Admins can update Special users' and normal users' timesheets.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {IViewTimesheet} input
   * @param {TimesheetDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof TimesheetController
   */
  protected validateUpdatePermissions(
    authenticatedUser: IViewUser,
    input: IViewTimesheet,
    updatedDocument: TimesheetDocument,
    resourceOwner: IViewUser | null
  ) {
    return (
      authenticatedUser._id + "" ===
        (resourceOwner && resourceOwner._id) + "" ||
      (authenticatedUser.role >= UserRole.Admin &&
        authenticatedUser.role > ((resourceOwner && resourceOwner.role) || 0))
    );
  }

  /**
   * Everyone can create their own timesheets.
   * Admins can create timesheets for Admins and less-privileged users.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {TimesheetDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof TimesheetController
   */
  protected validateCreatePermissions(
    authenticatedUser: IViewUser,
    updatedDocument: TimesheetDocument,
    resourceOwner: IViewUser | null
  ) {
    return !!resourceOwner
      ? authenticatedUser._id + "" === resourceOwner._id + "" ||
          (authenticatedUser.role >= UserRole.Admin &&
            authenticatedUser.role >= resourceOwner.role)
      : true;
  }
}
