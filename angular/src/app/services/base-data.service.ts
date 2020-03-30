import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import conforms from 'lodash.conforms';
import { throwError, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

export interface IQueryOptions {
  sort?: string;
  skip?: number;
  limit?: number;
}

export abstract class BaseDataService {
  protected readonly baseUrl;

  constructor(baseUrl: string, protected http: HttpClient) {
    if (environment.apiUrl.slice(-1)[0] === '/') {
    }
    this.baseUrl = this.joinPath(environment.apiUrl, baseUrl);
  }

  protected get<T>(
    path: string,
    options?: IQueryOptions,
    isErrorExpected?: (err: any) => boolean
  ): Observable<T> {
    let httpParams = new HttpParams();
    if (options) {
      if (options.limit) {
        httpParams = httpParams.append('limit', options.limit + '');
      }
      if (options.skip) {
        httpParams = httpParams.append('skip', options.skip + '');
      }
      if (options.sort) {
        httpParams = httpParams.append('sort', options.sort);
      }
    }

    return this.http
      .get<T>(this.joinPath(this.baseUrl, path), {
        params: httpParams,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError(isErrorExpected)));
  }

  protected post<T>(
    path: string,
    body: any,
    isErrorExpected?: (err: any) => boolean
  ): Observable<T> {
    const headers = new HttpHeaders({ application: 'application/json' });

    return this.http
      .post<T>(this.joinPath(this.baseUrl, path), body, {
        headers,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError(isErrorExpected)));
  }

  protected handleError(isErrorExpected?: (err: any) => boolean) {
    if (!isErrorExpected) {
      isErrorExpected = conforms({
        result: (res) => res !== undefined,
        message: (mes) => mes !== undefined,
        success: (success) => success !== undefined,
      });
    }

    return (err) => {
      if (isErrorExpected(err)) {
        return of(err);
      }
      return throwError(err);
    };
  }

  protected joinPath(base: string, path: string) {
    let result = '';
    if (base.startsWith('http://')) {
      result = 'http://';
      base = base.substring(7);
    } else if (base.startsWith('https://')) {
      result = 'https://';
      base = base.substring(8);
    } else {
      result = '/';
    }
    return (
      result +
      base
        .split('/')
        .concat(path.split('/'))
        .filter((e) => !!e)
        .join('/')
    );
  }
}
