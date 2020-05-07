import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {NotificationService} from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  getBoard(search: any): Observable<any> {

    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/register/getKanban`, search)
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  changeStatus(data: any) {
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/api/applications/changeStatus`, data)
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    return throwError(
      error);
  }
}
