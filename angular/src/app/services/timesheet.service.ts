import { Injectable } from '@angular/core';
import { BaseDataService, IQueryOptions } from './base-data.service';
import { HttpClient } from '@angular/common/http';
import {
  IViewTimesheet,
  ICrudResult,
  IViewProject,
} from '../../../../types/viewmodels';
import { ITimesheetLine } from '../../../../types/datamodels';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService extends BaseDataService {
  constructor(http: HttpClient) {
    super('timesheet', http);
  }

  getAllByUserId(userId: string, options?: IQueryOptions) {
    return this.get<ICrudResult<IViewTimesheet[]>>(
      '/byUserId/' + userId,
      options
    );
  }

  countByUserId(userId: string) {
    return this.get<ICrudResult<number>>('/countByUserId/' + userId);
  }

  getByIdPopulated(id: string) {
    return this.get<
      ICrudResult<IViewTimesheet<string, ITimesheetLine<IViewProject>>>
    >('/populated/' + id);
  }

  getById(id: string) {
    return this.get<ICrudResult<IViewTimesheet>>(id);
  }
}
