import { inject, injectable } from "inversify";

import { IViewPhase, IViewUser } from "../../../types/viewmodels";
import { UserRole } from "../constants/enums/user-role";
import Models from "../constants/symbols/models";
import { CrudResult } from "../infrastructure/utils/crud-result";
import {
  IPhaseController,
  ObjectId,
  QueryOptions
} from "../interfaces/controllers";
import {
  ActivityDocument,
  PhaseDocument,
  PhaseModel,
  UserModel
} from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class PhaseController extends AbstractController<IViewPhase>
  implements IPhaseController {
  constructor(
    @inject(Models.Phase) private Phase: PhaseModel,
    @inject(Models.User) User: UserModel
  ) {
    super(Phase, User);
  }

  /**
   * Returns all phases, with linked activities as documents instead of IDs.
   * @param {ObjectId} authenticatedUserId
   * @param {QueryOptions} [options]
   * @returns {Promise<CrudResult<PhaseDocument[]>>}
   * @memberof PhaseController
   */
  public async getAllPopulated(
    authenticatedUserId: ObjectId,
    options?: QueryOptions
  ) {
    if (
      this.validateReadPermissions(
        await this.getUser(authenticatedUserId),
        null
      )
    ) {
      let query = this.Phase.find();
      query = this.applyQueryOptions(query, options);
      query = query.populate("activities");
      const result = ((await query) as unknown) as Array<
        PhaseDocument<ActivityDocument>
      >;
      return CrudResult.Success(result.map((o) => o.toJSON()));
    } else {
      throw this.get403Error();
    }
  }

  /**
   * Phases don't have owners.
   * @protected
   * @param {IViewPhase<string>} resource
   * @returns {null}
   * @memberof PhaseController
   */
  protected async getResourceOwner(resource: IViewPhase<string>) {
    return null;
  }

  /**
   * Everyone can read Phases.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof PhaseController
   */
  protected validateReadPermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ) {
    return authenticatedUser.role >= UserRole.Everyone;
  }

  /**
   * Admins can update Phases.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {IViewPhase} input
   * @param {PhaseDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof PhaseController
   */
  protected validateUpdatePermissions(
    authenticatedUser: IViewUser,
    input: IViewPhase,
    updatedDocument: PhaseDocument,
    resourceOwner: IViewUser | null
  ) {
    return authenticatedUser.role >= UserRole.Admin;
  }

  /**
   * Admins can create Phases.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {PhaseDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof PhaseController
   */
  protected validateCreatePermissions(
    authenticatedUser: IViewUser,
    updatedDocument: PhaseDocument,
    resourceOwner: IViewUser | null
  ) {
    return authenticatedUser.role >= UserRole.Admin;
  }
}
