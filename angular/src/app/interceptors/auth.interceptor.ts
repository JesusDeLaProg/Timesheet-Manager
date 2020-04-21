import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import { Observable, of, from, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { tap, flatMap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authRequest = of(true);
    if(!environment.production) {
      console.log('Intercepting : ', request);
    }
    if(this.shouldLogin() &&
      !request.url.endsWith('auth/login') &&
      !request.url.endsWith('auth/logout')) {
      if(!environment.production) {
        console.log('Requesting login because Token Expired :', localStorage.getItem('TokenExpiration'));
      }
      authRequest = from(this.authService.requestLogin());
    }
    return authRequest.pipe(
      flatMap(() => next.handle(request).pipe(
        tap(event => {
          if(event instanceof HttpResponse && event.headers.get('X-Token-Expiration')) {
            localStorage.setItem(
              'TokenExpiration',
              event.headers.get('X-Token-Expiration')
            );
          }
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            localStorage.removeItem('TokenExpiration');
            return this.authService.logout()
              .pipe(flatMap(() => this.intercept(request, next)));
          } else {
            return throwError(err);
          }
        })
      ))
    );
  }

  private shouldLogin() {
    return !localStorage.getItem('TokenExpiration') ||
      moment(new Date().toISOString()).isAfter(moment(localStorage.getItem('TokenExpiration')));
  }
}
