import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ICrudResult } from '../../../../types/viewmodels';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'tm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private login: (
    usr: string,
    pwd: string
  ) => Observable<ICrudResult<null>> = null;

  public loginForm: FormGroup;
  public error = false;
  public errorMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: {
      login: (usr: string, pwd: string) => Observable<ICrudResult<null>>;
    },
    private dialogRef: MatDialogRef<LoginComponent, boolean>,
    fb: FormBuilder
  ) {
    this.login = data.login;
    this.loginForm = fb.group({
      username: '',
      password: '',
    });
  }

  ngOnInit(): void {}

  async submit() {
    const { username, password } = this.loginForm.value;
    try {
      const result = await this.login(username, password).toPromise();
      this.error = !result.success;
      this.errorMessage = result.message;
      if (!this.error) {
        this.dialogRef.close(true);
      }
    } catch (err) {
      alert(err.stack);
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
