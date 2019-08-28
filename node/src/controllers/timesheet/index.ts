import { inject, injectable } from "inversify";
import { Error } from "mongoose";

import { ITimesheetLine, StringId } from "../../../../types/datamodels";
import { CrudResult, IViewTimesheet } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import {
  ITimesheetController,
  QueryOptions
} from "../../interfaces/controllers";
import { ProjectDocument, TimesheetModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";

@injectable()
export class TimesheetController extends AbstractController<IViewTimesheet>
  implements ITimesheetController {
  constructor(@inject(Models.Timesheet) private Timesheet: TimesheetModel) {
    super(Timesheet);
  }

  public getAllByUserId(
    userId: string,
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewTimesheet[]>> {
    throw new Error("Method not implemented.");
  }
  public getByIdPopulated(
    id: string
  ): Promise<
    CrudResult<Array<IViewTimesheet<StringId, ITimesheetLine<ProjectDocument>>>>
  > {
    throw new Error("Method not implemented.");
  }
  public getById(id: string): Promise<CrudResult<IViewTimesheet>> {
    throw new Error("Method not implemented.");
  }
  public getAll(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewTimesheet[]>> {
    throw new Error("Method not implemented.");
  }
  public count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }
  public validate(
    document: IViewTimesheet
  ): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  public save(
    document: IViewTimesheet
  ): Promise<CrudResult<IViewTimesheet | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  public deleteById(id: string): Promise<CrudResult<any>> {
    throw new Error("Method not implemented.");
  }
}
