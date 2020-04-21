import { Injectable } from '@angular/core';
import { BaseDataService, IQueryOptions } from './base-data.service';
import { HttpClient } from '@angular/common/http';
import { IViewUser, ICrudResult } from '../../../../types/viewmodels';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseDataService {

  constructor(http: HttpClient) {
    super('user', http);
  }

  getById(id: string) {
    return this.get<ICrudResult<IViewUser>>(id);
  }

  getAll(options?: IQueryOptions) {
    return this.get<ICrudResult<IViewUser[]>>('', options);
  }
}
