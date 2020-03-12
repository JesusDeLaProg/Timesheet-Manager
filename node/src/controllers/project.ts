import { inject, injectable } from "inversify";
import escapeRegExp from "lodash.escaperegexp";

import { IViewProject, IViewUser } from "../../../types/viewmodels";
import { UserRole } from "../constants/enums/user-role";
import Models from "../constants/symbols/models";
import { CrudResult } from "../infrastructure/utils/crud-result";
import {
  IProjectController,
  ObjectId,
  QueryOptions
} from "../interfaces/controllers";
import { ProjectDocument, ProjectModel, UserModel } from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class ProjectController extends AbstractController<IViewProject>
  implements IProjectController {
  constructor(
    @inject(Models.Project) private Project: ProjectModel,
    @inject(Models.User) User: UserModel
  ) {
    super(Project, User);
  }

  /**
   * Returns all projects with a code that matches a given string.
   * Codes are matches without case sensitivity.
   * @param {ObjectId} authenticatedUserId
   * @param {string} code
   * @param {QueryOptions} [options]
   * @returns {Promise<CrudResult<ProjectDocument[]>>}
   * @memberof ProjectController
   */
  public async getAllByCode(
    authenticatedUserId: ObjectId,
    code: string,
    options?: QueryOptions
  ) {
    if (
      this.validateReadPermissions(
        await this.getUser(authenticatedUserId),
        null
      )
    ) {
      let query = this.Project.find({
        code: new RegExp(escapeRegExp(code), "i"),
        isActive: true
      });
      query = this.applyQueryOptions(query, options);
      const result = await query;
      return CrudResult.Success(result.map((o) => o.toJSON()));
    } else {
      throw this.get403Error();
    }
  }

  /**
   * Projects don't have owners.
   * @protected
   * @param {IViewProject<string>} resource
   * @returns {null}
   * @memberof ProjectController
   */
  protected async getResourceOwner(resource: IViewProject<string>) {
    return null;
  }

  /**
   * Everyone
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof ProjectController
   */
  protected validateReadPermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ) {
    return authenticatedUser.role >= UserRole.Everyone;
  }

  /**
   * Special users can update Projects.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {IViewProject} input
   * @param {ProjectDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns {boolean}
   * @memberof ProjectController
   */
  protected validateUpdatePermissions(
    authenticatedUser: IViewUser,
    input: IViewProject,
    updatedDocument: ProjectDocument,
    resourceOwner: IViewUser | null
  ) {
    return authenticatedUser.role >= UserRole.Subadmin;
  }

  /**
   * Special users can create Projects.
   * NOTE : See {@link ActivityController#getResourceOwner}
   * @protected
   * @param {IViewUser} authenticatedUser
   * @param {ProjectDocument} updatedDocument
   * @param {(IViewUser | null)} resourceOwner
   * @returns
   * @memberof ProjectController
   */
  protected validateCreatePermissions(
    authenticatedUser: IViewUser,
    updatedDocument: ProjectDocument,
    resourceOwner: IViewUser | null
  ) {
    return authenticatedUser.role >= UserRole.Subadmin;
  }
}
