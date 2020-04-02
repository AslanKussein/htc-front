import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from "../models/users";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(loginForm: any) {

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    const body_ = new HttpParams()
      .set('username', loginForm.username)
      .set('password', loginForm.password)
      .set('grant_type', 'password')
      .set('client_id', 'htc');

    return this.http.post<any>(`auth`, body_.toString(), options).pipe(map(user => {
      console.log(user)
      if (user && user.access_token) {
        if (loginForm.rememberMe) {
          localStorage.setItem('username', loginForm.username);
          localStorage.setItem('password', loginForm.password);
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }

      return user;
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
