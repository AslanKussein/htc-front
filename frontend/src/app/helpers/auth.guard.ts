import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";
import {ErrorInterceptor} from "./error.interceptor";
import {Util} from "../services/util";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private util: Util,
              private activatedRoute: ActivatedRoute,
              private errorInterceptor: ErrorInterceptor,
              private authenticationService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      return true;
    } else {
      if (localStorage.length == 0) {
        this.router.navigate(['/login']);
        return;
      }
      if (localStorage.getItem('action') != 'logout') {
        this.errorInterceptor.showAuthModal();
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
  }
}
