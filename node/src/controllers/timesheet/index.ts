import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import {
  QueryOptions,
  ITimesheetController
} from "../../interfaces/controllers";
import { TimesheetModel, ProjectDocument } from "../../interfaces/models";
import Models from "../../constants/symbols/models";
import { ITimesheetLine, StringId } from "../../../../types/datamodels";
import { IViewTimesheet, CrudResult } from "../../../../types/viewmodels";

@injectable()
export class TimesheetController extends AbstractController<IViewTimesheet>
  implements ITimesheetController {
  constructor(@inject(Models.Timesheet) private Timesheet: TimesheetModel) {
    super(Timesheet);
  }

  getAllByUserId(
    userId: string,
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewTimesheet[]>> {
    throw new Error("Method not implemented.");
  }
  getByIdPopulated(
    id: string
  ): Promise<
    CrudResult<IViewTimesheet<StringId, ITimesheetLine<ProjectDocument>>[]>
  > {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<CrudResult<IViewTimesheet>> {
    throw new Error("Method not implemented.");
  }
  getAll(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewTimesheet[]>> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }
  validate(
    document: IViewTimesheet
  ): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  save(
    document: IViewTimesheet
  ): Promise<CrudResult<IViewTimesheet | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<CrudResult<any>> {
    throw new Error("Method not implemented.");
  }
}
