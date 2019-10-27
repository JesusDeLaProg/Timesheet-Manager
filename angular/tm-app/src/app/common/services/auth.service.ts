import { Injectable } from "@angular/core";
import { BaseDataService } from "./base-data.service";
import { HttpClient } from "@angular/common/http";
import { ICrudResult } from "../../../../../../types/viewmodels";

@Injectable({
  providedIn: "root"
})
export class AuthService extends BaseDataService {
  constructor(http: HttpClient) {
    super("/auth", http);
  }

  login(username: string, password: string) {
    return this.post<ICrudResult<boolean>>(
      "/login",
      { username, password },
      () => false
    );
  }

  logout() {
    return this.get("/logout", undefined, () => false);
  }
}
