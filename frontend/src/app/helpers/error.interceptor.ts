import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthenticationService} from "../services/authentication.service";
import {ConfigService} from "../services/config.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authenticationService: AuthenticationService,
              private configService: ConfigService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {

        return this.handle401Error(request, next);
      } else if (err.status === 400 && err.url.includes(this.configService.authUrl)) {
        if (err.error.error_description.includes('Refresh token expired') && err.error.error.includes('invalid_grant')) {
          this.authenticationService.logout();
          location.reload(true);
        } else {
          this.authenticationService.showAuthModal();
        }
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshing) {

      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authenticationService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access_token);
          this.authenticationService.storeTokens(token);
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token.access_token}`
            }
          });
          return next.handle(request);
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${jwt}`
            }
          });
          return next.handle(request);
        }));
    }
  }
}
