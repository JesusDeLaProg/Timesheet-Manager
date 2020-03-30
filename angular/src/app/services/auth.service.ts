import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from './base-data.service';

import { ICrudResult, IViewUser } from '../../../../types/viewmodels';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseDataService {
  constructor(http: HttpClient) {
    super('/auth', http);
  }

  public login(username: string, password: string) {
    return this.post<ICrudResult<null>>('/login', { username, password });
  }

  public logout() {
    return this.get<ICrudResult<null>>('/logout');
  }

  public whoami() {
    return this.get<ICrudResult<IViewUser>>('/whoami');
  }
}
