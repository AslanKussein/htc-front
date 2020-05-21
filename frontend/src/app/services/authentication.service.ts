import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {first, map, tap} from 'rxjs/operators';
import {User} from "../models/users";
import {ConfigService} from "./config.service";
import {Util} from "./util";
import {UserService} from "./user.service";
import {NotificationService} from "./notification.service";
import {ActivatedRoute} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthenticationService implements OnDestroy {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly CLIENT_ID = 'htc';
  subscriptions: Subscription = new Subscription();

  options = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  }

  constructor(private http: HttpClient,
              private configService: ConfigService,
              private util: Util,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private notifyService: NotificationService) {
    this.currentUserSubject = new BehaviorSubject<User>(this.util.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(loginForm: any, id: number) {
    this.subscriptions.add(this.loginIDP(loginForm?.value)
      .pipe(first())
      .subscribe(
        param_ => {
          this.userService.findUserByLogin().subscribe(data => {
            if (data != null) {
              param_.name = data.name
              param_.surname = data.surname
              param_.login = data.login
              param_.roles = data.roles
              param_.group = data.group
              param_.id = data.id
              localStorage.setItem('currentUser', JSON.stringify(param_));
            }
          });
          if (id == 1) {
            this.util.dnHref('/home')
          }
        },
        () => {
          this.notifyService.showError('Ошибка', 'Не корректные данные для входа')
        }));
  }

  loginIDP(loginForm: any) {

    const body_ = new HttpParams()
      .set('username', loginForm.username)
      .set('password', loginForm.password)
      .set('grant_type', 'password')
      .set('client_id', this.CLIENT_ID);

    return this.http.post<any>(`${this.configService.authUrl}`, body_.toString(), this.options).pipe(map(user => {
      if (user && user.access_token) {
        this.storeTokens(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }

      return user;
    }));
  }

  refreshToken() {
    const body_ = new HttpParams()
      .set('refresh_token', this.getRefreshToken())
      .set('grant_type', 'refresh_token')
      .set('client_id', this.CLIENT_ID);
    return this.http.post<any>(`${this.configService.authUrl}`, body_.toString(), this.options)
      .pipe(tap((tokens: User) => {
        this.storeTokens(tokens);
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.JWT_TOKEN);
    this.currentUserSubject.next(null);
    if (!['login'].includes(this.activatedRoute.snapshot?.url[0]?.path)) {
      this.util.dnHref(['/login']);
    }
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  public storeTokens(tokens: User) {
    localStorage.setItem(this.JWT_TOKEN, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
