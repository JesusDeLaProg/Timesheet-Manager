import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICrudResult } from "../../../../../../types/viewmodels";
import { BaseDataService } from "./base-data.service";

@Injectable({
  providedIn: "root"
})
export class AuthService extends BaseDataService {
  constructor(http: HttpClient) {
    super("/auth", http);
  }

  public login(username: string, password: string) {
    return this.post<ICrudResult<boolean>>(
      "/login",
      { username, password },
      () => false
    );
  }

  public logout() {
    return this.get("/logout", undefined, () => false);
  }
}
