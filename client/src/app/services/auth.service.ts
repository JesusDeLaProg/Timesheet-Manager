import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from './base-data.service';

import { ICrudResult, IViewUser } from '../../../../types/viewmodels';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { shareReplay, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseDataService<null> {
  private loginModalObs: Observable<boolean> = null;
  private loginModalRef: MatDialogRef<LoginComponent, boolean> = null;
  private whoami$: Observable<IViewUser> = null;

  constructor(http: HttpClient, private dialogService: MatDialog) {
    super('auth', http);
  }

  public requestLogin(): Promise<boolean> {
    if (this.loginModalObs === null) {
      this.loginModalRef = this.dialogService.open(LoginComponent, {
        width: '30%',
        minWidth: '500px',
        disableClose: true,
        restoreFocus: true,
        hasBackdrop: true,
        autoFocus: true,
        data: {
          login: (usr: string, pwd: string) => this.login(usr, pwd),
        },
      });
      this.loginModalObs = this.loginModalRef.afterClosed();
    }
    return this.loginModalObs.toPromise();
  }

  public login(username: string, password: string) {
    return this.post<ICrudResult<null>>('login', { username, password }).pipe(
      tap((res) => (this.whoami$ = res.success ? null : this.whoami$))
    );
  }

  public logout() {
    this.whoami$ = null;
    return this.get<ICrudResult<null>>('logout');
  }

  public whoami() {
    if (this.whoami$ === null) {
      this.whoami$ = this.get<ICrudResult<IViewUser>>('whoami').pipe(
        map((res) => res.result),
        shareReplay(1)
      );
    }
    return this.whoami$;
  }
}
