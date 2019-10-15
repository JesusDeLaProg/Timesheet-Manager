import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import conforms from "lodash.conforms";
import { join } from "path";
import { throwError, of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";

export interface IQueryOptions {
  sort?: string;
  skip?: number;
  limit?: number;
}

export abstract class BaseDataService {
  protected readonly baseUrl;

  constructor(baseUrl: string, protected http: HttpClient) {
    baseUrl = join(environment.apiUrl, baseUrl);
  }

  get<T>(
    path: string,
    options?: IQueryOptions,
    isErrorExpected?: (any) => boolean
  ): Observable<T> {
    let httpParams = new HttpParams();
    if (options) {
      if (options.limit)
        httpParams = httpParams.append("limit", options.limit + "");
      if (options.skip)
        httpParams = httpParams.append("skip", options.skip + "");
      if (options.sort) httpParams = httpParams.append("sort", options.sort);
    }

    return this.http
      .get<T>(join(this.baseUrl, path), { params: httpParams })
      .pipe(catchError(this.handleError(isErrorExpected)));
  }

  post<T>(
    path: string,
    body: any,
    isErrorExpected?: (any) => boolean
  ): Observable<T> {
    const headers = new HttpHeaders({ application: "application/json" });

    return this.http
      .post<T>(join(this.baseUrl, path), body, { headers })
      .pipe(catchError(this.handleError(isErrorExpected)));
  }

  handleError(isErrorExpected?: (any) => boolean) {
    if (!isErrorExpected) {
      isErrorExpected = conforms({
        result: res => res !== undefined,
        message: mes => mes !== undefined,
        success: success => success !== undefined
      });
    }

    return err => {
      if (isErrorExpected(err)) return of(err);
      return throwError(err);
    };
  }
}
