import { Injectable } from '@angular/core';
import { BaseDataService } from './base-data.service';
import { HttpClient } from '@angular/common/http';
import { IViewUser } from '../../../../types/viewmodels';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseDataService<IViewUser> {
  constructor(http: HttpClient) {
    super('user', http);
  }
}
