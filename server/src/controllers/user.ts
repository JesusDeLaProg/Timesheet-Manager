import { inject, injectable } from "inversify";
import { Document, Error as MongooseError } from "mongoose";

import { ICrudResult, IViewUser } from "../../../types/viewmodels";
import { UserRole } from "../constants/enums/user-role";
import Models from "../constants/symbols/models";
import {
  IQueryOptions,
  IUserController,
  ObjectId,
} from "../interfaces/controllers";
import { UserDocument, UserModel } from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class UserController extends AbstractController<IViewUser>
  implements IUserController {
  constructor(
    @inject(Models.User) User: UserModel,
    @inject(Models.User) User2: UserModel
  ) {
    super(User, User2);
  }

  public async getById(
    authenticatedUserId: ObjectId,
    id: string
  ): Promise<ICrudResult<IViewUser>> {
    const result = await super.getById(authenticatedUserId, id);
    delete result.result?.password;
    return result;
  }

  public async getAll(
    authenticatedUserId: ObjectId,
    options?: IQueryOptions
  ): Promise<ICrudResult<IViewUser[]>> {
    const result = await super.getAll(authenticatedUserId, options);
    result.result = result.result!.map((u) => {
      delete u.password;
      return u;
    });
    return result;
  }

  public async save(
    authenticatedUserId: ObjectId,
    input: IViewUser
  ): Promise<ICrudResult<IViewUser | MongooseError.ValidationError>> {
    const res = await super.save(authenticatedUserId, input);
    if (res.success) {
      const user = res.result as IViewUser;
      delete user.password;
    }
    return res;
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

  protected async objectToDocument(
    input: IViewUser
  ): Promise<{
    resourceOwner: UserDocument | null;
    originalObject: IViewUser | null;
    document: IViewUser & Document;
  }> {
    let newPassord;
    if (input.password) {
      newPassord = input.password;
    }
    delete input.password;
    const result = await super.objectToDocument(input);
    if (newPassord) {
      await (result.document as UserDocument).setPassword(newPassord);
    }
    return result;
  }
}
