import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseDataService, IQueryOptions } from "./base-data.service";
import { IViewUser, ICrudResult } from "../../../../../../types/viewmodels";

@Injectable({
  providedIn: "root"
})
export class UserService extends BaseDataService {
  constructor(http: HttpClient) {
    super("user", http);
  }

  getAll(options?: IQueryOptions) {
    return this.get<ICrudResult<IViewUser[]>>("/", options, () => false);
  }

  getById(id: string) {
    return this.get<ICrudResult<IViewUser>>(`/${id}`, undefined, () => false);
  }

  save(timesheet: IViewUser) {
    return this.post<ICrudResult<IViewUser>>("/save", timesheet);
  }

  validate(timesheet: IViewUser) {
    return this.post<ICrudResult<IViewUser>>("/validate", timesheet);
  }
}
