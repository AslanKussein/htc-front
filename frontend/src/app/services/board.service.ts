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
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/api/applications/changeStatus`, data)
      .pipe(
        tap(data => {
        }),
        catchError(BoardService.handleError)
      );
  }

  private static handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }
}
