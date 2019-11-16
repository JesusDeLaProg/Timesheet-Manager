import { inject, injectable } from "inversify";
import escapeRegExp from "lodash.escaperegexp";

import { ICrudResult, IViewClient, IViewUser } from "../../../types/viewmodels";
import { UserRole } from "../constants/enums/user-role";
import Models from "../constants/symbols/models";
import { CrudResult } from "../infrastructure/utils/crud-result";
import {
  IClientController,
  ObjectId,
  QueryOptions
} from "../interfaces/controllers";
import {
  ClientDocument,
  ClientModel,
  UserDocument,
  UserModel
} from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class ClientController extends AbstractController<IViewClient>
  implements IClientController {
  constructor(
    @inject(Models.Client) private Client: ClientModel,
    @inject(Models.User) User: UserModel
  ) {
    super(Client, User);
  }

  /**
   * Returns clients whose name contains the given string.
   * Clients names are compared without case sensitivity.
   * @param {ObjectId} authenticatedUser
   * @param {string} name
   * @param {QueryOptions} [options]
   * @returns {Promise<ICrudResult<IViewClient[]>>}
   * @memberof ClientController
   */
  public async getAllByName(
    authenticatedUser: ObjectId,
    name: string,
    options?: QueryOptions
  ): Promise<ICrudResult<IViewClient[]>> {
    if (
      this.validateReadPermissions(await this.getUser(authenticatedUser), null)
    ) {
      let query = this.Client.find({
        name: new RegExp(escapeRegExp(name), "i")
      });
      query = this.applyQueryOptions(query, options);
      const result = await query;
      return CrudResult.Success(result);
    } else {
      throw this.get403Error();
    }
  }

  /**
   * Clients don't have an owner.
   * @protected
   * @param {IViewClient} resource
   * @returns {Promise<null>}
   * @memberof ClientController
   */
  protected async getResourceOwner(
    resource: IViewClient
  ): Promise<UserDocument | null> {
    return null;
  }

  /**
   * Everyone can read all clients.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof ClientController
   */
  protected validateReadPermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ): boolean {
    return authenticatedUser.role >= UserRole.Everyone;
  }

  /**
   * Special users can update clients.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {IViewClient} input
   * @param {ClientDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof ClientController
   */
  protected validateUpdatePermissions(
    authenticatedUser: IViewUser,
    input: IViewClient,
    updatedDocument: ClientDocument,
    resourceOwner: IViewUser | null
  ): boolean {
    return authenticatedUser.role >= UserRole.Subadmin;
  }

  /**
   * Special users can create clients.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {ClientDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof ClientController
   */
  protected validateCreatePermissions(
    authenticatedUser: IViewUser,
    updatedDocument: ClientDocument,
    resourceOwner: IViewUser | null
  ): boolean {
    return authenticatedUser.role >= UserRole.Subadmin;
  }
}
