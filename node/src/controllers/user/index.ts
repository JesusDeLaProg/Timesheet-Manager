import { inject, injectable } from "inversify";
import moment from "moment";
import { Error as MongooseError } from "mongoose";

import { StringId } from "../../../../types/datamodels";
import { ICrudResult, IViewUser } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import { CrudResult } from "../../infrastructure/utils/crud-result";
import { IUserController } from "../../interfaces/controllers";
import { UserDocument, UserModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";

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
    if (!(await this.validatePrivileges(input, authenticatedUserId))) {
      const error = new MongooseError.ValidationError();
      error.message = "Privilèges utilisateurs insuffisants.";
      error.errors = {
        user: new MongooseError.ValidatorError({
          message:
            "Seulement les superutilisateurs peuvent créer un utilisateur " +
            "spécial ou modifier le rôle d'un utilisateur."
        })
      };
      return CrudResult.Failure(error);
    } else {
      return super.validate(input);
    }
  }

  public async save(
    input: IViewUser,
    authenticatedUserId?: StringId
  ): Promise<ICrudResult<IViewUser | MongooseError.ValidationError>> {
    if (!(await this.validatePrivileges(input, authenticatedUserId))) {
      const error = new MongooseError.ValidationError();
      error.message = "Privilèges utilisateurs insuffisants.";
      error.errors = {
        user: new MongooseError.ValidatorError({
          message:
            "Seulement les superutilisateurs peuvent créer ou " +
            "modifier la feuille de temps d'un autre employé."
        })
      };
      return CrudResult.Failure(error);
    } else {
      return super.save(input);
    }
  }

  protected async objectToDocument(input: IViewUser): Promise<UserDocument> {
    if (input.billingRates) {
      input.billingRates = input.billingRates.map((billingRate) => {
        if (billingRate.timeline) {
          billingRate.timeline = billingRate.timeline.map((rate) => {
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
        return billingRate;
      });
    }
    const newPassword = input.password;
    input.password = undefined;
    const result = (super.objectToDocument(input) as unknown) as UserDocument; // Missing IUserExt
    if (newPassword) {
      result.plainTextPassword = newPassword;
    }
    return result;
  }

  private async getAuthenticatedUser(
    authenticatedUserId: StringId
  ): Promise<UserDocument> {
    const result = await this.User.findById(authenticatedUserId);
    return result as UserDocument;
  }

  private async validatePrivileges(
    input: IViewUser,
    authenticatedUserId?: StringId
  ): Promise<boolean> {
    if (!authenticatedUserId) {
      throw CrudResult.Failure(new Error("No user is authenticated."));
    }
    const authenticatedUser = await this.getAuthenticatedUser(
      authenticatedUserId
    );
    if (input._id) {
      const originaldocument = await this.User.findById(input._id);

      if (!originaldocument) {
        throw CrudResult.Failure(
          new Error(`Cannot find user with _id "${input._id}"`)
        );
      }

      return this.checkUpdatePrivileges(
        originaldocument,
        input,
        authenticatedUser
      );
    } else {
      return this.checkCreatePrivileges(input, authenticatedUser);
    }
  }

  private checkUpdatePrivileges(
    originalTimesheet: UserDocument,
    newTimesheet: IViewUser,
    authenticatedUser: UserDocument
  ) {
    // Only superusers can modify another user's role (Only if other user is less privileged).
    return true;
  }

  private checkCreatePrivileges(
    newTimesheet: IViewUser,
    authenticatedUser: UserDocument
  ) {
    // Only superadmins can create a special user.
    return true;
  }
}
