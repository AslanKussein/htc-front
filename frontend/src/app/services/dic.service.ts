import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {catchError, tap} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class DicService {

  constructor(private configService: ConfigService, private http: HttpClient) {
  }

  public getOperationType(): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/dictionaries/operationTypes`, {})
      .pipe(
        tap(data => {}),
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
