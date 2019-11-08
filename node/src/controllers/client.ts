import { inject, injectable } from "inversify";
import escapeRegExp from "lodash.escaperegexp";

import { ICrudResult, IViewClient, IViewUser } from "../../../types/viewmodels";
import Models from "../constants/symbols/models";
import { CrudResult } from "../infrastructure/utils/crud-result";
import {
  IClientController,
  QueryOptions,
  ObjectId
} from "../interfaces/controllers";
import { ClientModel, UserModel, UserDocument } from "../interfaces/models";
import { AbstractController } from "./abstract";
import { UserRole } from "../constants/enums/user-role";

@injectable()
export class ClientController extends AbstractController<IViewClient>
  implements IClientController {
  constructor(
    @inject(Models.Client) private Client: ClientModel,
    @inject(Models.User) User: UserModel
  ) {
    super(Client, User);
  }

  public async getAllByName(
    authenticatedUser: ObjectId,
    name: string,
    options?: QueryOptions | undefined
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

  protected async getResourceOwner(
    resource: IViewClient
  ): Promise<UserDocument | null> {
    return null;
  }
  protected validateReadPermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ): boolean {
    return authenticatedUser.role >= UserRole.Everyone;
  }
  protected validateUpdatePermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ): boolean {
    return authenticatedUser.role >= UserRole.Subadmin;
  }
  protected validateCreatePermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ): boolean {
    return authenticatedUser.role >= UserRole.Subadmin;
  }
}
