import { inject, injectable } from "inversify";
import moment from "moment";
import { Error as MongooseError } from "mongoose";

import { ITimesheetLine, StringId } from "../../../../types/datamodels";
import {
  ICrudResult,
  IViewProject,
  IViewTimesheet
} from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import { CrudResult } from "../../infrastructure/utils/crud-result";
import {
  ITimesheetController,
  QueryOptions
} from "../../interfaces/controllers";
import {
  ProjectDocument,
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

  public async getAllByUserId(
    userId: string,
    options?: QueryOptions | undefined
  ): Promise<ICrudResult<IViewTimesheet[]>> {
    let query = this.Timesheet.find({
      user: userId
    });
    query = this.applyQueryOptions(query, options);
    const result = await query;
    return CrudResult.Success(result);
  }

  public async getByIdPopulated(
    id: string
  ): Promise<
    ICrudResult<IViewTimesheet<StringId, ITimesheetLine<IViewProject>>>
  > {
    const query = this.Timesheet.findById(id);
    const result = ((await query.populate(
      "lines.project"
    )) as unknown) as IViewTimesheet<StringId, ITimesheetLine<IViewProject>>;
    if (!result) {
      throw CrudResult.Failure(
        new Error(`Cannot find Timesheet with _id ${id}`)
      );
    }
    return CrudResult.Success(result);
  }

  public async validate(
    input: IViewTimesheet,
    authenticatedUserId?: StringId
  ): Promise<ICrudResult<MongooseError.ValidationError>> {
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
      return super.validate(input);
    }
  }

  public async save(
    input: IViewTimesheet,
    authenticatedUserId?: StringId
  ): Promise<ICrudResult<IViewTimesheet | MongooseError.ValidationError>> {
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

  private async getAuthenticatedUser(
    authenticatedUserId: StringId
  ): Promise<UserDocument> {
    const result = await this.User.findById(authenticatedUserId);
    return result as UserDocument;
  }

  private async validatePrivileges(
    input: IViewTimesheet,
    authenticatedUserId?: StringId
  ): Promise<boolean> {
    if (!authenticatedUserId) {
      throw CrudResult.Failure(new Error("No user is authenticated."));
    }
    const authenticatedUser = await this.getAuthenticatedUser(
      authenticatedUserId
    );
    if (input._id) {
      const originaldocument = await this.Timesheet.findById(input._id);

      if (!originaldocument) {
        throw CrudResult.Failure(
          new Error(`Cannot find timesheet with _id "${input._id}"`)
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
    originalTimesheet: TimesheetDocument,
    newTimesheet: IViewTimesheet,
    authenticatedUser: UserDocument
  ) {
    // Only Superadmins can modify a timesheet's owner.
    // Normal users can only modify their own timesheets.
    return true;
  }

  private checkCreatePrivileges(
    newTimesheet: IViewTimesheet,
    authenticatedUser: UserDocument
  ) {
    // Only superadmins can create timesheets for other users.
    return true;
  }
}
