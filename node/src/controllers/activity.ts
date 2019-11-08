import { inject, injectable } from "inversify";

import { IViewActivity, IViewUser } from "../../../types/viewmodels";
import Models from "../constants/symbols/models";
import { IActivityController } from "../interfaces/controllers";
import { ActivityModel, UserModel } from "../interfaces/models";
import { AbstractController } from "./abstract";
import { UserRole } from "../constants/enums/user-role";

@injectable()
export class ActivityController extends AbstractController<IViewActivity>
  implements IActivityController {
  constructor(
    @inject(Models.Activity) Activity: ActivityModel,
    @inject(Models.User) User: UserModel
  ) {
    super(Activity, User);
  }
  protected async getResourceOwner(resource: IViewActivity) {
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
    return authenticatedUser.role >= UserRole.Admin;
  }
  protected validateCreatePermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ): boolean {
    return authenticatedUser.role >= UserRole.Admin;
  }
}
