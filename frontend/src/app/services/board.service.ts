import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  getBoard(search: any): Observable<any> {

    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/api/register/getKanban`, search)
      .pipe(
        tap(data => {
        }),
        catchError(BoardService.handleError)
      );
  }

  changeStatus(data: any) {
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/api/kanban/changeStatus`, data)
      .pipe(
        tap(data => {
        }),
        catchError(BoardService.handleError)
      );
  }

  completeDeal(data: any) {
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/api/kanban/completeDeal`, data)
      .pipe(
        tap(data => {
        }),
        catchError(BoardService.handleError)
      );
  }

  getApplication(id: number): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/api/kanban/applicationInfo/${id}`, {})
      .pipe(tap(), catchError(BoardService.handleError));
  }

  completeTargetApplication(id: number): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/api/kanban/targetApplicationInfo/${id}`, {})
      .pipe(tap(), catchError(BoardService.handleError));
  }

  forceCloseDeal(data: any): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/api/kanban/forceCloseDeal`, data)
      .pipe(tap(), catchError(BoardService.handleError));
  }

  private static handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }
}
