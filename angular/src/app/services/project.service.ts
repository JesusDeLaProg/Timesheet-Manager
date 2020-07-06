import { Injectable } from '@angular/core';
import { join as joinPath } from 'path-browserify';
import { BaseDataService, IQueryOptions } from './base-data.service';
import { IViewProject, ICrudResult } from '../../../../types/viewmodels';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseDataService<IViewProject> {
  constructor(http: HttpClient) {
    super('project', http);
  }

  getAllByCode(code: string, options: IQueryOptions) {
    return this.get<ICrudResult<IViewProject>>(
      joinPath('byCode', code),
      options
    );
  }
}
