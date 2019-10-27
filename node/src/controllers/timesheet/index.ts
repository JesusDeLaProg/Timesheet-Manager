import { inject, injectable } from "inversify";
import moment from "moment";
import { Error as MongooseError, Types } from "mongoose";

import { ObjectId } from "bson";
import { ITimesheetLine, StringId } from "../../../../types/datamodels";
import {
  ICrudResult,
  IViewProject,
  IViewTimesheet
} from "../../../../types/viewmodels";
import { UserRole } from "../../constants/enums/user-role";
import Models from "../../constants/symbols/models";
import { CrudResult } from "../../infrastructure/utils/crud-result";
import { HasHttpCode } from "../../infrastructure/utils/has-http-code";
import {
  ITimesheetController,
  QueryOptions
} from "../../interfaces/controllers";
import {
  TimesheetDocument,
  TimesheetModel,
  UserDocument,
  UserModel
} from "../../interfaces/models";
import { AbstractController } from "../abstract";

@injectable()
export class TimesheetController extends AbstractController<IViewTimesheet>
  implements ITimesheetController {
  constructor(
    @inject(Models.Timesheet) private Timesheet: TimesheetModel,
    @inject(Models.User) private User: UserModel
  ) {
    super(Timesheet);
  }

  public async getById(
    id: StringId,
    authenticatedUserId?: StringId | Types.ObjectId
  ): Promise<ICrudResult<IViewTimesheet>> {
    const result = await super.getById(id);
    if (!result.result) {
      const error = new Error("getById returned no object.");
      (error as HasHttpCode).code = 400;
      throw error;
    }
    await this._validatePrivileges(
      "read",
      authenticatedUserId,
      result.result.user
    );
    return result;
  }

  public async getAllByUserId(
    userId: StringId,
    authenticatedUserId?: StringId,
    options?: QueryOptions | undefined
  ): Promise<ICrudResult<IViewTimesheet[]>> {
    await this._validatePrivileges("read", authenticatedUserId, userId);

    let query = this.Timesheet.find({
      user: userId
    });
    query = this.applyQueryOptions(query, options);
    const result = await query;
    return CrudResult.Success(result);
  }

  public async getByIdPopulated(
    id: string,
    authenticatedUserId?: StringId | Types.ObjectId
  ): Promise<
    ICrudResult<IViewTimesheet<StringId, ITimesheetLine<IViewProject>>>
  > {
    const query = this.Timesheet.findById(id);
    const result = ((await query.populate(
      "lines.project"
    )) as unknown) as IViewTimesheet<StringId, ITimesheetLine<IViewProject>>;
    if (!result) {
      const error = new Error(`Cannot find Timesheet with _id ${id}`);
      (error as HasHttpCode).code = 400;
      throw error;
    }

    await this._validatePrivileges("read", authenticatedUserId, result.user);

    return CrudResult.Success(result);
  }

  public async countByUserId(
    userId: StringId,
    authenticatedUserId?: StringId | Types.ObjectId
  ): Promise<ICrudResult<number>> {
    await this._validatePrivileges("read", authenticatedUserId, userId);

    return CrudResult.Success(
      await this.Timesheet.countDocuments({ user: userId })
    );
  }

  public async validate(
    input: IViewTimesheet,
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
    input: IViewTimesheet,
    authenticatedUserId?: StringId
  ): Promise<ICrudResult<IViewTimesheet | MongooseError.ValidationError>> {
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
      return super.save(input);
    }
  }

  protected async objectToDocument(
    input: IViewTimesheet
  ): Promise<TimesheetDocument> {
    input.begin = moment(input.begin)
      .startOf("day")
      .toDate();
    input.end = moment(input.end)
      .endOf("day")
      .toDate();
    input.lines = input.lines.map((line) => {
      line.entries = line.entries.map((entry) => {
        entry.date = moment(entry.date)
          .startOf("day")
          .toDate();
        return entry;
      });
      return line;
    });
    input.roadsheetLines = input.roadsheetLines.map((rline) => {
      rline.travels = rline.travels.map((travel) => {
        travel.date = moment(travel.date)
          .startOf("day")
          .toDate();
        return travel;
      });
      return rline;
    });
    return super.objectToDocument(input);
  }

  private async _getUser(
    userId: StringId | Types.ObjectId
  ): Promise<UserDocument> {
    const result = await this.User.findById(userId);
    return result as UserDocument;
  }

  private _validatePrivileges(
    operation: "read",
    authenticatedUserId: StringId | Types.ObjectId | undefined,
    requestedUserId: StringId | Types.ObjectId
  ): Promise<void>;
  private _validatePrivileges(
    operation: "update" | "create",
    authenticatedUserId: StringId | Types.ObjectId | undefined,
    input: IViewTimesheet
  ): Promise<MongooseError.ValidationError | null>;

  private async _validatePrivileges(
    operation: "read" | "update" | "create",
    authenticatedUserId: StringId | Types.ObjectId | undefined,
    inputOrRequestedUserId: IViewTimesheet | StringId | Types.ObjectId
  ): Promise<MongooseError.ValidationError | null | void> {
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
      user: new MongooseError.ValidatorError({
        message:
          "Seulement les superutilisateurs peuvent créer ou " +
          "modifier la feuille de temps d'un autre employé."
      })
    };

    switch (operation) {
      case "read":
        const userId = inputOrRequestedUserId as StringId | Types.ObjectId;
        const requestedUser = await this._getUser(userId);
        if (!this._checkReadPrivileges(requestedUser, authenticatedUser)) {
          const error = new Error(
            "Privilèges utilisateurs insuffisants. " +
              "Les utilisateurs ordinaires peuvent seulement voir leurs propres feuilles de temps."
          );
          (error as HasHttpCode).code = 403;
          throw error;
        } else {
          return;
        }

      case "update":
        const updateInput = inputOrRequestedUserId as IViewTimesheet;
        const originalTimesheet = await this.Timesheet.findById(
          updateInput._id
        );
        if (!originalTimesheet) {
          const error = new Error(
            `Cannot find timesheet with _id "${updateInput._id}"`
          );
          (error as HasHttpCode).code = 400;
          throw error;
        }
        if (
          !this._checkUpdatePrivileges(originalTimesheet, authenticatedUser)
        ) {
          return updateOrCreateError;
        } else {
          return null;
        }

      case "create":
        const createInput = inputOrRequestedUserId as IViewTimesheet;
        if (!this._checkCreatePrivileges(createInput, authenticatedUser)) {
          return updateOrCreateError;
        } else {
          return null;
        }
    }
  }

  private _checkReadPrivileges(
    requestedUser: UserDocument,
    authenticatedUser: UserDocument
  ) {
    // Normal users can only request their own timesheets
    return (
      (authenticatedUser._id as Types.ObjectId).equals(requestedUser._id) ||
      authenticatedUser.role > UserRole.Everyone
    );
  }

  private _checkUpdatePrivileges(
    originalTimesheet: TimesheetDocument,
    authenticatedUser: UserDocument
  ) {
    const originalTimesheetOwner = new ObjectId(originalTimesheet.user);
    // Only Superadmins can modify others' timesheets.
    return (
      originalTimesheetOwner.equals(authenticatedUser._id) ||
      authenticatedUser.role === UserRole.Superadmin
    );
  }

  private _checkCreatePrivileges(
    newTimesheet: IViewTimesheet,
    authenticatedUser: UserDocument
  ) {
    const newTimesheetOwner = new ObjectId(newTimesheet.user);
    // Only superadmins can create timesheets for other users.
    return (
      newTimesheetOwner.equals(authenticatedUser._id) ||
      authenticatedUser.role === UserRole.Superadmin
    );
  }
}
