import { Injectable } from '@angular/core';
import joinPath from 'join-path';
import { BaseDataService, IQueryOptions } from './base-data.service';
import { IViewClient, ICrudResult } from '../../../../types/viewmodels';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends BaseDataService<IViewClient> {
  constructor(http: HttpClient) {
    super('client', http);
  }

  getAllByName(name: string, options?: IQueryOptions) {
    return this.get<ICrudResult<IViewClient[]>>(
      joinPath('getAllByName', name),
      options
    );
  }
}
