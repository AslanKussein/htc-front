import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {NotificationService} from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private configService: ConfigService,
              private noticeService: NotificationService,
              private http: HttpClient) {
  }

  /**
   * findUserByLogin
   */
  findUserByLogin(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/users/info`, {}).pipe(
      tap(data => {
        console.log(data)
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
      this.noticeService.showInfo('Ошибка', error)
    }
    return throwError(
      error);
  }
}
