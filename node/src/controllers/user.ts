import { inject, injectable } from "inversify";

import { IViewUser } from "../../../types/viewmodels";
import { UserRole } from "../constants/enums/user-role";
import Models from "../constants/symbols/models";
import { IUserController } from "../interfaces/controllers";
import { UserDocument, UserModel } from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class UserController extends AbstractController<IViewUser>
  implements IUserController {
  constructor(@inject(Models.User) User: UserModel) {
    super(User, User);
  }

  /**
   * Returns the in-database version of the requested or update user.
   * @protected
   * @param {UserDocument} resource
   * @returns {Promise<(UserDocument | null)>}
   * @memberof UserController
   */
  protected async getResourceOwner(resource: UserDocument) {
    return await this.User.findById(resource.id);
  }

  /**
   * Everyone can view their own account's informations.
   * Special users can view other account informations of other users.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof UserController
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
   * Special users can modify other users' account.
   * However, a user can only give another user a role that is less privileged than themself.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {IViewUser} originalObject
   * @param {UserDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof UserController
   */
  protected validateUpdatePermissions(
    authenticatedUser: IViewUser,
    originalObject: IViewUser,
    updatedDocument: UserDocument,
    resourceOwner: IViewUser | null
  ) {
    return originalObject.role === updatedDocument.role
      ? authenticatedUser.role >= UserRole.Subadmin
      : (authenticatedUser.role > updatedDocument.role &&
          authenticatedUser.role > originalObject.role) ||
          authenticatedUser.role === UserRole.Superadmin;
  }

  /**
   * Special users can create normal user accounts.
   * Admins can create Special user accounts.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {UserDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof UserController
   */
  protected validateCreatePermissions(
    authenticatedUser: IViewUser,
    updatedDocument: UserDocument,
    resourceOwner: IViewUser | null
  ) {
    return (
      (authenticatedUser.role >= UserRole.Subadmin &&
        authenticatedUser.role > updatedDocument.role) ||
      authenticatedUser.role === UserRole.Superadmin
    );
  }
}
