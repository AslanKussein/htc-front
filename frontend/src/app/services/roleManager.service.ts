import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from "rxjs/operators";
import {NotificationService} from "./notification.service";
import {language} from "../../environments/language";

@Injectable({
  providedIn: 'root'
})
export class RoleManagerService {
  res: any
  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  /**
   * getOperations
   */
  getOperations(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiRoleManagerUrl}/api/operations?locale=` + language.language, {});
  }

  /**
   * getCheckOperationList
   */
  getCheckOperationList(params: any): Observable<any> {
    return this.http.get<any>(`${this.configService.apiRoleManagerUrl}/api/operations/check`, {params}).pipe(
      tap(data => {
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
    }
    return throwError(
      error);
  }
}
