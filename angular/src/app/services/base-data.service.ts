import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { join as joinPath } from 'path-browserify';
import conforms from 'lodash.conforms';
import { Error as MongooseError } from 'mongoose';
import { throwError, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ICrudResult } from '../../../../types/viewmodels';

export interface IQueryOptions {
  sort?: string;
  skip?: number;
  limit?: number;
}

export interface IDataService<T> {
  getById(id: string): Observable<ICrudResult<T>>;
  getAll(options: IQueryOptions): Observable<ICrudResult<T[]>>;
  count(): Observable<ICrudResult<number>>;
  validate(input: T): Observable<ICrudResult<MongooseError.ValidationError>>;
  save(input: T): Observable<ICrudResult<T | MongooseError.ValidationError>>;
}

export abstract class BaseDataService<T> implements IDataService<T> {
  protected readonly baseUrl;

  constructor(baseUrl: string, protected http: HttpClient) {
    this.baseUrl = joinPath('api', baseUrl);
  }

  private buildPath(path: string) {
    return new URL(joinPath(this.baseUrl, path), environment.apiUrl).toString();
  }

  protected get<U>(
    path: string,
    options?: IQueryOptions,
    errorMapper?: (err: any) => any,
    isErrorExpected?: (err: any) => boolean
  ): Observable<U> {
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
      .get<U>(this.buildPath(path), {
        params: httpParams,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError(errorMapper, isErrorExpected)));
  }

  protected post<U>(
    path: string,
    body: any,
    errorMapper?: (err: any) => any,
    isErrorExpected?: (err: any) => boolean
  ): Observable<U> {
    const headers = new HttpHeaders({ application: 'application/json' });

    return this.http
      .post<U>(this.buildPath(path), body, {
        headers,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError(errorMapper, isErrorExpected)));
  }

  protected handleError(
    errorMapper?: (err: any) => any,
    isErrorExpected?: (err: any) => boolean
  ) {
    if (!errorMapper) {
      errorMapper = (err) => err.error;
    }

    if (!isErrorExpected) {
      isErrorExpected = conforms({
        error: (err) =>
          conforms({
            result: (res) => res !== undefined,
            message: (mes) => mes !== undefined,
            success: (success) => success !== undefined,
          }),
      });
    }

    return (err) => {
      if (isErrorExpected(err)) {
        return of(errorMapper(err));
      }
      return throwError(err);
    };
  }

  getById(id: string) {
    return this.get<ICrudResult<T>>(this.buildPath(id));
  }

  getAll(options: IQueryOptions) {
    return this.get<ICrudResult<T[]>>(this.baseUrl, options);
  }

  count() {
    return this.get<ICrudResult<number>>(this.buildPath('count'));
  }

  save(input: T) {
    return this.post<ICrudResult<T | MongooseError.ValidationError>>(
      this.buildPath('save'),
      input
    );
  }

  validate(input: T) {
    return this.post<ICrudResult<MongooseError.ValidationError>>(
      this.buildPath('validate'),
      input
    );
  }
}
