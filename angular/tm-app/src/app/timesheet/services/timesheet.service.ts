import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {
  BaseDataService,
  IQueryOptions
} from "src/app/common/services/base-data.service";
import {
  IViewTimesheet,
  IViewProject,
  ICrudResult
} from "../../../../../../types/viewmodels";
import { ITimesheetLine } from "../../../../../../types/datamodels";

@Injectable({
  providedIn: "root"
})
export class TimesheetService extends BaseDataService {
  constructor(http: HttpClient) {
    super("timesheet", http);
  }

  getAll(options?: IQueryOptions) {
    return this.get<ICrudResult<IViewTimesheet[]>>("/", options, () => false);
  }

  getById(id: string) {
    return this.get<ICrudResult<IViewTimesheet>>(
      `/${id}`,
      undefined,
      () => false
    );
  }

  getByIdPopulated(id: string) {
    return this.get<
      ICrudResult<IViewTimesheet<string, ITimesheetLine<IViewProject>>>
    >(`/populated/${id}`, undefined, () => false);
  }

  getAllByUserId(userId: string, options?: IQueryOptions) {
    return this.get<ICrudResult<IViewTimesheet[]>>(
      `/byUserId/${userId}`,
      options,
      () => false
    );
  }

  countByUserId(userId: string) {
    return this.get<ICrudResult<number>>(
      `/countByUserId/${userId}`,
      undefined,
      () => false
    );
  }

  save(timesheet: IViewTimesheet) {
    return this.post<ICrudResult<IViewTimesheet>>("/save", timesheet);
  }

  validate(timesheet: IViewTimesheet) {
    return this.post<ICrudResult<IViewTimesheet>>("/validate", timesheet);
  }
}
