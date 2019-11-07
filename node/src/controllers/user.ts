import { inject, injectable } from "inversify";
import moment from "moment";
import { Error as MongooseError, Types } from "mongoose";

import { StringId } from "../../../types/datamodels";
import { ICrudResult, IViewUser } from "../../../types/viewmodels";
import { UserRole } from "../constants/enums/user-role";
import Models from "../constants/symbols/models";
import { CrudResult } from "../infrastructure/utils/crud-result";
import { HasHttpCode } from "../infrastructure/utils/has-http-code";
import { IUserController } from "../interfaces/controllers";
import { UserDocument, UserModel } from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class UserController extends AbstractController<IViewUser>
  implements IUserController {
  constructor(@inject(Models.User) private User: UserModel) {
    super(User);
  }

  public async validate(
    input: IViewUser,
    authenticatedUserId?: StringId
  ): Promise<ICrudResult<MongooseError.ValidationError>> {
    let privilegesError: MongooseError.ValidationError | null;
    if (input._id) {
      privilegesError = await this._validatePrivileges(
        "update",
        authenticatedUserId,
        input
      );
    } else {
      privilegesError = await this._validatePrivileges(
        "create",
        authenticatedUserId,
        input
      );
    }

    if (privilegesError) {
      return CrudResult.Failure(privilegesError);
    } else {
      return super.validate(input);
    }
  }

  public async save(
    input: IViewUser,
    authenticatedUserId?: StringId
  ): Promise<ICrudResult<IViewUser | MongooseError.ValidationError>> {
    let privilegesError: MongooseError.ValidationError | null;
    if (input._id) {
      privilegesError = await this._validatePrivileges(
        "update",
        authenticatedUserId,
        input
      );
    } else {
      privilegesError = await this._validatePrivileges(
        "create",
        authenticatedUserId,
        input
      );
    }

    if (privilegesError) {
      return CrudResult.Failure(privilegesError);
    } else {
      const result = await super.save(input);
      (result.result as IViewUser).password = undefined;
      return result;
    }
  }

  protected async objectToDocument(input: IViewUser): Promise<UserDocument> {
    if (input.billingGroups) {
      input.billingGroups = input.billingGroups.map((group) => {
        if (group.timeline) {
          group.timeline = group.timeline.map((rate) => {
            if (rate.begin) {
              rate.begin = moment(rate.begin)
                .startOf("day")
                .toDate();
            }
            if (rate.end) {
              rate.end = moment(rate.end)
                .endOf("day")
                .toDate();
            }
            return rate;
          });
        }
        return group;
      });
    }
    const newPassword = input.password;
    input.password = undefined;
    const result = (await (super.objectToDocument(
      input
    ) as unknown)) as UserDocument; // Missing IUserExt
    if (newPassword) {
      result.plainTextPassword = newPassword;
    }
    return result;
  }

  private async _getUser(
    authenticatedUserId?: StringId | Types.ObjectId
  ): Promise<UserDocument> {
    const result = await this.User.findById(authenticatedUserId);
    return result as UserDocument;
  }

  private async _validatePrivileges(
    operation: "create" | "update",
    authenticatedUserId: StringId | Types.ObjectId | undefined,
    input: IViewUser
  ): Promise<MongooseError.ValidationError | null> {
    if (!authenticatedUserId) {
      const error = new Error("No user is authenticated.");
      (error as HasHttpCode).code = 401;
      throw error;
    }
    const authenticatedUser = await this._getUser(authenticatedUserId);

    const updateOrCreateError = new MongooseError.ValidationError();
    (updateOrCreateError as HasHttpCode).code = 400;
    updateOrCreateError.message = "Privilèges utilisateurs insuffisants.";
    updateOrCreateError.errors = {
      role: new MongooseError.ValidatorError({
        message:
          "Seulement les superutilisateurs peuvent créer ou " +
          "modifier la feuille de temps d'un autre employé."
      })
    };

    if (operation === "create") {
      return this._checkCreatePrivileges(input, authenticatedUser)
        ? null
        : updateOrCreateError;
    } else {
      const originaldocument = await this.User.findById(input._id);

      if (!originaldocument) {
        const error = new Error(`Cannot find user with _id "${input._id}"`);
        (error as HasHttpCode).code = 401;
        throw error;
      }

      return this._checkUpdatePrivileges(
        originaldocument,
        input,
        authenticatedUser
      )
        ? null
        : updateOrCreateError;
    }
  }

  private _checkUpdatePrivileges(
    originalUser: UserDocument,
    newUser: IViewUser,
    authenticatedUser: UserDocument
  ) {
    // Only superadmins can modify another user's role (Only if other user is less privileged).
    return (
      originalUser.role === newUser.role ||
      (authenticatedUser.role === UserRole.Superadmin &&
        originalUser.role < UserRole.Superadmin)
    );
  }

  private _checkCreatePrivileges(
    newUser: IViewUser,
    authenticatedUser: UserDocument
  ) {
    // Only superadmins can create a special user.
    return (
      newUser.role === UserRole.Everyone ||
      authenticatedUser.role === UserRole.Superadmin
    );
  }
}
