import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthenticationService} from "../services/authentication.service";
import {ConfigService} from "../services/config.service";
import {NotificationService} from "../services/notification.service";
import {Util} from "../services/util";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ActivatedRoute} from "@angular/router";
import {BsModalService} from "ngx-bootstrap/modal";
import {LoginModalComponent} from "../components/login/login-modal/login-modal.component";
import {User} from "../models/users";

@Injectable({providedIn: 'root'})
export class ErrorInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authenticationService: AuthenticationService,
              private configService: ConfigService,
              private notificationService: NotificationService,
              private util: Util,
              private modalService: BsModalService,
              private ngxLoader: NgxUiLoaderService,
              private activatedRoute: ActivatedRoute) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      this.ngxLoader.stop();
      if (err.status === 401) {
        return this.handle401Error(request, next);
      } else if (err.status === 400) {
        if (err.url.includes(this.configService.authUrl)) {
          if (err.error.error_description.includes('Refresh token expired')) {
            this.authenticationService.logout();
            location.reload(true);
          } else {
            if (!['login'].includes(this.activatedRoute.snapshot['_routerState'].url.split(";")[0].replace('/', ''))) {
              this.showAuthModal();
            }
          }
        }
      }
      if (err.status != 400 && !this.util.isNullOrEmpty(err.error.message?.ru)) {
        this.notificationService.showInfo('Информация', err.error.message[this.util.getError()])
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

          let persons = JSON.parse(localStorage.getItem('currentUser'));

          persons.access_token = token.access_token;
          persons.refresh_token = token.refresh_token;
          localStorage.setItem("currentUser", JSON.stringify(persons));
          this.authenticationService.update();
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

  showAuthModal() {
    this.modalService.show(LoginModalComponent, {
      class: 'modal-md',
      initialState: {
        centered: true
      }
    });
  }
}
