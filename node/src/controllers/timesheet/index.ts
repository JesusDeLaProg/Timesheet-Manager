import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import {
  CrudResult,
  QueryOptions,
  ITimesheetController
} from "../../interfaces/controllers";
import {
  TimesheetModel,
  TimesheetDocument,
  ProjectDocument
} from "../../interfaces/models";
import Models from "../../constants/symbols/models";
import { ITimesheetLine, StringId } from "../../../../types/datamodels";

@injectable()
export class TimesheetController extends AbstractController<TimesheetDocument>
  implements ITimesheetController {
  constructor(@inject(Models.Timesheet) private Timesheet: TimesheetModel) {
    super(Timesheet);
  }

  getAllByUserId(
    userId: string,
    options?: QueryOptions | undefined
  ): CrudResult<TimesheetDocument[]> {
    throw new Error("Method not implemented.");
  }
  getByIdPopulated(
    id: string
  ): CrudResult<
    TimesheetDocument<StringId, ITimesheetLine<ProjectDocument>>[]
  > {
    throw new Error("Method not implemented.");
  }
  getById(id: string): CrudResult<TimesheetDocument> {
    throw new Error("Method not implemented.");
  }
  getAll(options?: QueryOptions | undefined): CrudResult<TimesheetDocument[]> {
    throw new Error("Method not implemented.");
  }
  count(): CrudResult<number> {
    throw new Error("Method not implemented.");
  }
  validate(document: TimesheetDocument): CrudResult<Error.ValidationError> {
    throw new Error("Method not implemented.");
  }
  save(
    document: TimesheetDocument
  ): CrudResult<TimesheetDocument | Error.ValidationError> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): CrudResult<any> {
    throw new Error("Method not implemented.");
  }
}
