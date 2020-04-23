import { Injectable } from '@angular/core';
import { BaseDataService, IQueryOptions } from './base-data.service';
import { HttpClient } from '@angular/common/http';
import { IViewTimesheet, ICrudResult } from '../../../../types/viewmodels';

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
}
