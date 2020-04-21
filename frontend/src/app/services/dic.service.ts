import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {catchError, tap} from 'rxjs/internal/operators';
import {language} from "../../environments/language";

@Injectable({
  providedIn: 'root'
})
export class DicService {

  constructor(private configService: ConfigService, private http: HttpClient) {
  }

  public getDics(dicName): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/dictionaries/` + dicName, {})
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public getResidentialComplexes(): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/residential-complexes`, {})
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
