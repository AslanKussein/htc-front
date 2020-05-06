import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, first, map, mapTo, tap} from 'rxjs/operators';
import {User} from "../models/users";
import {ConfigService} from "./config.service";
import {Util} from "./util";
import {UserService} from "./user.service";
import {ModalComponent} from "../components/claims/create-claim/modal.window/modal.component";
import {LoginModalComponent} from "../components/login/login-modal/login-modal.component";
import {BsModalService} from "ngx-bootstrap";
import {NotificationService} from "./notification.service";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly CLIENT_ID = 'htc';
  options = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  }

  constructor(private http: HttpClient,
              private configService: ConfigService,
              private util: Util,
              private modalService: BsModalService,
              private userService: UserService,
              private notifyService: NotificationService) {
    this.currentUserSubject = new BehaviorSubject<User>(this.util.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(loginForm: any, id: number) {
    this.loginIDP(loginForm?.value)
      .pipe(first())
      .subscribe(
        datax => {
          this.userService.findUserByLogin().subscribe(data => {
            if (data != null) {
              datax.name = data.name
              datax.surname = data.surname
              datax.login = data.login
              datax.roles = data.roles
              datax.group = data.group
              datax.id = data.id
              localStorage.setItem('currentUser', JSON.stringify(datax));
            }
          });
          if (id == 1) {
            this.util.dnHref('/home')
          }
        },
        error => {
          this.notifyService.showError('Ошибка', 'Не корректные данные для входа')
        });
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
    this.util.dnHref(['/login']);
  }

  showAuthModal() {
    this.modalService.show(LoginModalComponent, {
      class: 'modal-lg',
      initialState: {
        centered: true
      }
    });
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
}
