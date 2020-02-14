import { inject, injectable } from "inversify";

import { IViewActivity, IViewUser } from "../../../types/viewmodels";
import { UserRole } from "../constants/enums/user-role";
import Models from "../constants/symbols/models";
import { IActivityController } from "../interfaces/controllers";
import {
  ActivityDocument,
  ActivityModel,
  UserModel
} from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class ActivityController extends AbstractController<IViewActivity>
  implements IActivityController {
  constructor(
    @inject(Models.Activity) Activity: ActivityModel,
    @inject(Models.User) User: UserModel
  ) {
    super(Activity, User);
  }

  /**
   * Activities don't have owners.
   * @protected
   * @param {IViewActivity} resource
   * @returns {Promise<null>}
   * @memberof ActivityController
   */
  protected async getResourceOwner(resource: IViewActivity) {
    return null;
  }

  /**
   * Everyone can read all activities.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof ActivityController
   */
  protected validateReadPermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ): boolean {
    return authenticatedUser.role >= UserRole.Everyone;
  }

  /**
   * Admins and Superadmins can update activities.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {IViewActivity} input
   * @param {ActivityDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof ActivityController
   */
  protected validateUpdatePermissions(
    authenticatedUser: IViewUser,
    input: IViewActivity,
    updatedDocument: ActivityDocument,
    resourceOwner: IViewUser | null
  ): boolean {
    return authenticatedUser.role >= UserRole.Admin;
  }

  /**
   * Admins and Superadmins can create activities.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {ActivityDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof ActivityController
   */
  protected validateCreatePermissions(
    authenticatedUser: IViewUser,
    updatedDocument: ActivityDocument,
    resourceOwner: IViewUser | null
  ): boolean {
    return authenticatedUser.role >= UserRole.Admin;
  }
}
