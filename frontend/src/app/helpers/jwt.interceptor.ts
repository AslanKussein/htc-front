import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";
import {Util} from "../services/util";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
              private util: Util) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.util.isNullOrEmpty(this.authenticationService.getJwtToken())) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authenticationService.getJwtToken()}`
        }
      });
    }

    return next.handle(request);
  }
}
